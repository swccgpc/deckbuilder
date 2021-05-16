import { PrismaClient, Deck } from "@prisma/client";
import { dummyDeckData } from "../utils/dummy-deck-data";
import { getSharedUser } from "../server/create-shared-user";
import { Card } from "../components/card-search-table/card.interface";
import { Side } from "../graphql/types";
const cards = require("../cards/cards.json");
const gempMapping = require("../cards/gemp_id_mapping.json");
const prisma = new PrismaClient();

function mapToString(val: any): string {
  return val === undefined || val === null ? undefined : val.toString();
}

function createCards(prisma: PrismaClient, allCards: Card[]) {
  const cardPromises = allCards
    .filter(({ legacy }) => {
      return legacy == false;
    })
    .map((card: Card) => {
      if (!gempMapping[card.id]) {
        console.log("No gemp matching", card.id, card.front.title);
      }
      return prisma.card.create({
        data: {
          card_id: card.id,
          side: card.side,
          rarity: card.rarity,
          card_set: card.set,
          front_title: card.front.title,
          front_imageUrl: card.front.imageUrl,
          front_type: card.front.type,
          front_subType: card.front.subType,
          front_destiny: mapToString(card.front.destiny),
          front_power: mapToString(card.front.power),
          front_deploy: mapToString(card.front.deploy),
          front_forfeit: mapToString(card.front.forfeit),
          front_gametext: card.front.gametext,
          front_lore: card.front.lore,
          front_hyperspeed: card.front.hyperspeed,
          counterpart: card.counterpart,
          gemp_card_id:
            gempMapping[card.id] && gempMapping[card.id].gemp_card_id,
        },
      });
    });
  return Promise.all(cardPromises);
}

function createDecks(userId: string, dummyDeckData): Promise<Deck[]> {
  const decks = dummyDeckData.map((deck) => {
    try {
      return prisma.deck.create({
        data: {
          User: {
            connect: {
              id: parseInt(userId),
            },
          },
          title: deck.title,
          side: deck.side,
          published: true,
        },
      });
    } catch (e) {
      console.log(e);
    }
  });
  return Promise.all(decks);
}

async function getCards(prisma: PrismaClient, cards: Card[]) {
  if ((await prisma.card.count()) === 0) {
    return createCards(prisma, cards);
  }
  return prisma.card.findMany();
}

async function getDecks(prisma: PrismaClient, user): Promise<Deck[]> {
  if ((await prisma.deck.count()) === 0) {
    return await createDecks(user.id, dummyDeckData);
  }

  return prisma.deck.findMany();
}

export function getRandomDeck(allCards, side: string) {
  // map over current array
  const newArray = allCards.map((cards) => {
    return cards;
  });

  // Shuffle array
  const shuffled = newArray.sort(() => 0.5 - Math.random());

  // Get sub-array of first 60 elements after shuffle
  let randomDeck = shuffled
    .filter(({ side: cardSide }) => cardSide === side)
    .slice(0, 60);

  return randomDeck;
}

getSharedUser(prisma).then(async (user) => {
  const dbCards = await getCards(prisma, cards);
  const dbDecks = await getDecks(prisma, user);
  const assembledDecks = dbDecks.map(async (deck) => {
    const numberOfCardsInDeck = await prisma.deckCard.count({
      where: { deckId: deck.id },
    });
    if (numberOfCardsInDeck > 0) {
      return Promise.resolve();
    }

    const createdCardConnections = getRandomDeck(dbCards, deck.side).map(
      (card) => {
        return prisma.deckCard.create({
          data: {
            Card: {
              connect: {
                id: card.id,
              },
            },
            Deck: {
              connect: {
                id: deck.id,
              },
            },
          },
        });
      }
    );
    return Promise.all(createdCardConnections);
  });
  Promise.all(assembledDecks).then(() => {
    prisma.disconnect();
    console.log("success");
  });
});
