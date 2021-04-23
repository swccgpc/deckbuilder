import { PrismaClient } from "@prisma/client";
import { deserializeItem, getFromDb } from './query/decks';
import AWS from "aws-sdk";


export async function recentDecks(prisma: PrismaClient) {
  return getFromDb({
    IndexName: "deleted-updated_at-index",
    ExpressionAttributeNames: {
        "#idx": "deleted"
    },
    ExpressionAttributeValues: {
        ':pub': {BOOL: true},
        ':del': {N: '0'},
    },
    FilterExpression : 'published = :pub',
    KeyConditionExpression: '#idx = :del',
    ScanIndexForward: false,
    Limit: 6,
  });
  // return prisma.deck.findMany({
  //   where: {
  //     deleted: false,
  //     published: true,
  //   },
  //   take: 6,
  // });
}

// export async function getFromDb() {
//   const db = new AWS.DynamoDB()
//   const payload = {
//     TableName: process.env.DECKS_TABLE_NAME,
//     Limit: 6,
//   };
//   const { Items } = await db.scan(payload).promise();    
//   return deserialize(Items);
// }

// function deserialize(items) {
//   if (items) {
//       return items.map((item) => deserializeItem(item));
//   }

//   return null;
// }