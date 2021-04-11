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
    if (parseInt(_args.authorId) !== _context.userId) {
      throw new Error("You can only query for your own decks");
    } else {
      if (_args.authorId) {
        return getFromDb({
          IndexName: "userId-updatedAt-index",
          ExpressionAttributeNames: {
              "#kid": "userId"
          },
          ExpressionAttributeValues: {
              ':uid': {N: _args.authorId},
              ':del': {N: '0'},
          },
          FilterExpression : 'deleted = :del',
          KeyConditionExpression: '#kid = :uid',
          ScanIndexForward: false
        });      
      }
    }
  }

  return getFromDb({
    TableName: process.env.DECKS_TABLE_NAME,
    IndexName: "deleted-updatedAt-index",
    ExpressionAttributeNames: {
        "#kid": "deleted"
    },
    ExpressionAttributeValues: {
        ':del': {N: '0'},
    },
    KeyConditionExpression: '#kid = :del',
    ScanIndexForward: false
  });
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

export async function getFromDb(params: any) {
  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.DECKS_TABLE_NAME,
  };
  Object.assign(payload, params);

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
