import { ApolloServer, gql } from "apollo-server-micro";
import schema from "raw-loader!../../graphql/schema.gql";
import { recentDecks } from "../../server/resolvers/recent-decks";
import { allCards, singleCard } from "../../server/resolvers/query/cards";
import jwt from "jsonwebtoken";
import { addCardToDeck } from "../../server/resolvers/mutation/add-card-to-deck";
import { removeCardFromDeck } from "../../server/resolvers/mutation/remove-card-from-deck";
import { CardResolver } from "../../server/resolvers/types/Card";
import { createDeck } from "../../server/resolvers/mutation/create-deck";
import { DeckCard } from "../../server/resolvers/DeckCard";
import { setStartingCard } from "../../server/resolvers/mutation/set-starting-card";
import { updateDeck } from "../../server/resolvers/mutation/update-deck";
import { deleteDeck } from "../../server/resolvers/mutation/delete-deck";
import { login } from "../../server/resolvers/mutation/login";
import { deck, decks } from "../../server/resolvers/query/decks";
import { createDeckRating } from "../../server/resolvers/mutation/create-deck-rating";
import { Deck } from "../../server/resolvers/types/Deck";
import { createComment } from "../../server/resolvers/mutation/create-comment";
import { Comment } from "../../server/resolvers/types/Comment";

const typeDefs = gql(schema + "");

function sortCardsByName(a: any, b: any) {
  const aTitle = a.front.title.replace(/[^0-9a-zA-z_.]/gi, "");
  const bTitle = b.front.title.replace(/[^0-9a-zA-z_.]/gi, "");

  if (aTitle < bTitle) {
    return -1;
  }
  if (aTitle > bTitle) {
    return 1;
  }
  return 0;
}

async function failSafe(func) {
  try {
    return await func();
  } catch (e) {
    console.error(e);
    throw new Error('There was error executing your request.');
  }
}

const resolvers = {
  Query: {
    hello: (_parent, _args, _context) => "Hello!",
    recentDecks: () => failSafe(() => recentDecks()), // done
    card: (_parent, _args) => singleCard(_parent, _args), // done
    cards: () => allCards().sort(sortCardsByName), // done
    deck: (_parent, _args) => failSafe(() => deck(_parent, _args)), // done
    decks: (_parent, _args, _context) => failSafe(() => decks(_parent, _args, _context)),
  },
  Mutation: {
    login: (_parent, _args) => failSafe(() => login(_parent, _args)), // done
    updateDeck: (_parent, _args, _context) => failSafe(() => updateDeck(_parent, _args, _context)), // done
    deleteDeck: (_parent, _args, _context) => failSafe(() => deleteDeck(_parent, _args, _context)), // done
    setStartingCard: (_parent, _args) => failSafe(() => setStartingCard(_parent, _args)), // done
    createDeck: (_parent, _args, _context) => failSafe(() => createDeck(_parent, _args, _context)), // done
    createDeckRating: (_parent, _args, _context) => failSafe(() => createDeckRating(_parent, _args, _context)), // done
    createComment: (_parent, _args, _context) => failSafe(() => createComment(_parent, _args, _context)), // done
    addCardToDeck: (_parent, _args, _context) => failSafe(() => addCardToDeck(_parent, _args, _context)), // done
    removeCardFromDeck: (_parent, _args, _context) => failSafe(() => removeCardFromDeck(_parent, _args, _context)), // done
  },
  Card: CardResolver,
  Comment,
  Deck,
  DeckCard: DeckCard,
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    try {
      // return { userId: '12345', username: 'Imad' };
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
        username: string;
      };
      return { userId: decoded.userId, username: decoded.username };
    } catch (e) {
      console.log(e);
      return {};
    }
  },
});

const handler = apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
