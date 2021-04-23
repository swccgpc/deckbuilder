import { ApolloServer, gql } from "apollo-server-micro";
import schema from "raw-loader!../../graphql/schema.gql";
import { PrismaClient } from "@prisma/client";
import { recentDecks } from "../../server/resolvers/recent-decks";
import { allCards, singleCard } from "../../server/resolvers/query/cards";
import jwt from "jsonwebtoken";
import { addCardToDeck } from "../../server/resolvers/mutation/add-card-to-deck";
import { removeCardFromDeck } from "../../server/resolvers/mutation/remove-card-from-deck";
import { CardResolver } from "../../server/resolvers/Card";
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

export const prisma = new PrismaClient();

const typeDefs = gql(schema + "");

function sortCardsByName(a: any, b: any) {
  const aTitle = a.front_title.replace(/[^0-9a-zA-z_.]/gi, "");
  const bTitle = b.front_title.replace(/[^0-9a-zA-z_.]/gi, "");

  if (aTitle < bTitle) {
    return -1;
  }
  if (aTitle > bTitle) {
    return 1;
  }
  return 0;
}

const resolvers = {
  Query: {
    hello: (_parent, _args, _context) => "Hello!",
    recentDecks: () => recentDecks(prisma), // done
    card: (_parent, _args) => singleCard(_parent, _args), // done
    // cards: async () => {
    //   return (await prisma.card.findMany()).sort(sortCardsByName);
    // },
    cards: () => allCards(), // done
    deck, // done
    // deck: deck, (_parent, _args) => {
    //   return prisma.deck.findOne({
    //     where: { id: parseInt(_args.id) },
    //   });
    // },
    decks,
  },
  Mutation: {
    login, // done
    updateDeck, // done
    deleteDeck, // done
    setStartingCard, // done
    createDeck, // done
    createDeckRating, // done
    createComment, // done
    addCardToDeck, // done
    removeCardFromDeck, // done
    // removeCardFromDeck: async (_parent, _args, _context) => {
    //   if (!_context.userId) {
    //     throw new Error("Please login");
    //   }
    //   await prisma.deckCard.delete({
    //     where: {
    //       id: parseInt(_args.deckCardId),
    //     },
    //   });
    //   return {
    //     success: true,
    //   };
    // },
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
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: string;
      };
      return { userId: decoded.userId || 1234 };
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
