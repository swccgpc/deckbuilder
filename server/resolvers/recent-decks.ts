import { PrismaClient } from "@prisma/client";
import { deserializeItem } from './query/decks';
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

export async function getFromDb() {
  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.DECKS_TABLE_NAME,
    Limit: 6,
  };
  const { Items } = await db.scan(payload).promise();    
  return deserialize(Items);
}

function deserialize(items) {
  if (items) {
      return items.map((item) => deserializeItem(item));
  }

  return null;
}