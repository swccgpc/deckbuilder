import { prisma } from "../../../pages/api/graphql";
import {
  ResolversParentTypes,
  RequireFields,
  QueryDecksArgs,
} from "../../../graphql/types";
import { Context } from "@apollo/client";
import AWS from "aws-sdk";


export function decks(
  _parent: ResolversParentTypes,
  _args: RequireFields<QueryDecksArgs, "authorId">,
  _context: Context
) {
  if (_args.authorId) {
    console.log(_context.userId);
    if (parseInt(_args.authorId) !== _context.userId) {
      throw new Error("You can only query for your own decks");
    } else {
      if (_args.authorId) {
        return prisma.deck.findMany({
          orderBy: {
            updated_at: "desc",
          },
          where: {
            deleted: false,
            User: {
              id: parseInt(_args.authorId),
            },
          },
        });
      }
    }
  }

  return getFromDb();
  // return prisma.deck.findMany({
  //   orderBy: {
  //     updated_at: "desc",
  //   },
  //   where: {
  //     deleted: false,
  //     published: true,
  //   },
  // });
}

export async function getFromDb() {
  const deleted  = '0';
  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.DECKS_TABLE_NAME,
    IndexName: "deleted-updatedAt-index",
    ExpressionAttributeNames: {
        "#kid": "deleted"
    },
    ExpressionAttributeValues: {
        ':del': {N: deleted},
    },
    KeyConditionExpression: '#kid = :del',
    ScanIndexForward: false
  };
  const { Items } = await db.query(payload).promise();    
  return deserialize(Items);
}

function deserialize(items) {
  if (items) {
      return items.map((item) => ({
          id: item.asset_id?.N,
          side: item.side?.S,
          title: item.title?.S,
      }));
  }

  return null;
}
