import { prisma } from "../../../pages/api/graphql";
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

  const deck = await getDeckFromDb(_args.deckId);
  if (!deck) {
    throw new Error(`deck not found: ${_args.deckId}`);
  }

  const userId = parseInt(_context.userId);

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

  const db = new AWS.DynamoDB.DocumentClient();
  await db.update(payload).promise();

  return {
    id: cd.getTime(),
    rating: _args.rating,
    deckId: _args.deckId,
    deck,
  };

  // const previousRatings = await prisma.deckRating.findMany({
  //   where: {
  //     Deck: {
  //       id: parseInt(_args.deckId),
  //     },
  //     User: {
  //       id: parseInt(_context.userId),
  //     },
  //   },
  // });
  // let rating;
  // if (previousRatings.length > 0) {
  //   rating = await prisma.deckRating.update({
  //     where: {
  //       id: previousRatings[0].id as number,
  //     },
  //     data: {
  //       rating: _args.rating,
  //     },
  //   });
  // } else {
  //   rating = await prisma.deckRating.create({
  //     data: {
  //       Deck: {
  //         connect: {
  //           id: parseInt(_args.deckId),
  //         },
  //       },
  //       User: {
  //         connect: {
  //           id: parseInt(_context.userId),
  //         },
  //       },
  //       rating: _args.rating,
  //     },
  //   });
  // }

  // return {
  //   ...rating,
  //   deck: () =>
  //     prisma.deck.findOne({
  //       where: {
  //         id: parseInt(_args.deckId),
  //       },
  //     }),
  // };
}
