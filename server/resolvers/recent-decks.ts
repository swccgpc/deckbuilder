import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";

export async function recentDecks(prisma: PrismaClient) {
  return getFromDb();
  // return prisma.deck.findMany({
  //   where: {
  //     deleted: false,
  //     published: true,
  //   },
  //   take: 6,
  // });
}

export async function allCards() {
  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.DECKS_TABLE_NAME,
    ProjectionExpression: "cards",
  };
  const { Items } = await db.scan(payload).promise();    
  return deserializeCards(Items);
}

export async function getFromDb() {
  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.DECKS_TABLE_NAME,
    Limit: 6,
  };
  const { Items } = await db.scan(payload).promise();    
  return deserialize(Items);
}

function deserializeCards(items) {
  if (items) {
    let cards = [];
    items.map((item) => {
      if (item.cards) {
        const c = JSON.parse(item.cards);
        cards = cards.concat(c);
      }
    });

    return cards;
  }

  return null;
}

function deserialize(items) {
  if (items) {
      return items.map((item) => ({
          id: item.id?.S,
          side: item.side?.S,
          title: item.title?.S,
      }));
  }

  return null;
}