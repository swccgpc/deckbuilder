import {
  ResolversParentTypes,
  RequireFields,
  QueryDecksArgs,
  QueryDeckArgs,
} from "../../../graphql/types";
import { Context } from "@apollo/client";
import AWS from "aws-sdk";

export async function deck(
  _parent: ResolversParentTypes,
  _args: RequireFields<QueryDeckArgs, "id">,
) {
  if (_args.id) {
    return await getDeckFromDb(_args.id, false);
  } else {
    return null;
  }
}

export async function getDeckFromDb(deckId: string, getRatings: boolean = false) {
  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.DECKS_TABLE_NAME,
    Key: {
      'id': {S: deckId}
    },
  };

  const deckItemTask = db.getItem(payload).promise();
  let ratings = [];
  if (getRatings) {
    const ratingTask = getRatingsFromDb(deckId);
    await Promise.all([deckItemTask, ratingTask]);
    ratings = await ratingTask;
  } else {
    await deckItemTask;
  }
  const { Item } = await deckItemTask;
  const desItem = deserializeItem(Item, ratings);

  return desItem;
}

export async function getRatingsFromDb(deckId: string) {
  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.DECK_RATINGS_TABLE_NAME,
    ExpressionAttributeNames: {
      "#did": "deckId"
    },
    ExpressionAttributeValues: {
        ':deck': {S: deckId},
    },
    KeyConditionExpression: '#did = :deck',
    ConsistentRead: true,
  };

  const { Items } = await db.query(payload).promise();
  if (Items) {
    return Items.map((item) => ({
      id: item.updated_at.S,
      rating: item.rating.N,
    }));
  }

  return [];
}

export function decks(
  _parent: ResolversParentTypes,
  _args: RequireFields<QueryDecksArgs, "authorId">,
  _context: Context
) {
  if (_args.authorId) {
    if (_args.authorId !== _context.userId) {
      throw new Error("You can only query for your own decks");
    } else {
      if (_args.authorId) {
        return getFromDb({
          IndexName: "authorId-updated_at-index",
          ExpressionAttributeNames: {
              "#kid": "authorId"
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
    IndexName: "deleted-updated_at-index",
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
      return items.map((item) =>  deserializeItem(item));
  }

  return null;
}

export function deserializeItem(item: any, ratings: any[] = []) {
  return item ? {
    id: item.id?.S,
    side: item.side?.S,
    title: item.title?.S,
    description: item.description?.S,
    created_at: item.created_at?.S,
    updated_at: item.updated_at?.S,
    authorId: item.authorId?.N,
    author: item.author?.S,
    published: item.published?.BOOL || false,
    cards: item.cards ? JSON.parse(item.cards?.S) : [],
    total_rating: item.total_rating?.N || 0,
    total_rating_count: item.total_rating_count?.N || 0,
    ratings,
  } : null;
}
