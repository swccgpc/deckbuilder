import { getDeckFromDb } from '../query/decks';
import AWS from "aws-sdk";
import DUE from "dynamodb-update-expression";

export async function createDeckRating(_parent, _args, _context) {
  if (!_context.userId) {
    throw new Error("Please signin");
  }
  if (_args.rating < 0 || _args.rating > 5) {
    throw new Error("Only ratings between 1 and 5 are allowed");
  }

  const userId = parseInt(_context.userId);

  let tasks = [];
  const previousRatingTask = getDeckRatingByAuthor(_args.deckId, userId);
  const deckTask = getDeckFromDb(_args.deckId, false);
  tasks.push(previousRatingTask);
  tasks.push(deckTask);

  await Promise.all(tasks);

  const previousRating = await previousRatingTask;
  const deck = await deckTask;

  if (!deck) {
    throw new Error(`deck not found: ${_args.deckId}`);
  }

  const cd = new Date();
  const updateExpression = DUE.getUpdateExpression(
    {
      deckId: _args.deckId,
      authorId: userId,
    },
    {
      rating: _args.rating,
      updated_at: cd.toISOString(),
      created_at: cd.toISOString(),
    }
  );

  const payload = {
    TableName: process.env.DECK_RATINGS_TABLE_NAME,
    Key: {
      deckId: _args.deckId,
      authorId: userId,
    },
    ...updateExpression,
  };

  tasks = [];
  const db = new AWS.DynamoDB.DocumentClient();
  tasks.push(db.update(payload).promise());

  const updatedRatingsTask = updateAverageRating(db, _args.deckId, _args.rating, previousRating?.rating || 0);
  tasks.push(updatedRatingsTask);

  await Promise.all(tasks);

  const updatedRatings = await updatedRatingsTask;
  Object.assign(deck, updatedRatings);

  return {
    id: cd.getTime(),
    rating: _args.rating,
    deckId: _args.deckId,
    deck,
  };
}

async function getDeckRatingByAuthor(deckId: string, userId: number) {
  const db = new AWS.DynamoDB.DocumentClient();
  const payload = {
    TableName: process.env.DECK_RATINGS_TABLE_NAME,
    Key: {
      'deckId': deckId,
      'authorId': userId
    },
  };

  const { Item } = await db.get(payload).promise();
  if (Item) {
    return {
      id: Item.updated_at,
      rating: Item.rating,
    };
  }

  return null;
}

async function updateAverageRating(db: AWS.DynamoDB.DocumentClient,
  deckId: string, newRating: number, oldRating: number) {

  const r = newRating - oldRating;
  var payload = {
    TableName: process.env.DECKS_TABLE_NAME,
    Key: { id: deckId },
    UpdateExpression: "set total_rating = (total_rating + :val), total_rating_count = total_rating_count + :tot",
    ExpressionAttributeValues:{
        ":val": r,
        ":tot": oldRating === 0 ? 1 : 0
    },
    ReturnValues:"UPDATED_NEW"
  };

  const { Attributes } = await db.update(payload).promise();
  return Attributes;
}
