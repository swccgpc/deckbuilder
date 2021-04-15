import { prisma } from "../../../pages/api/graphql";
import {
  ResolversParentTypes,
  MutationUpdateDeckArgs,
  RequireFields,
} from "../../../graphql/types";
import { getDeckFromDb } from '../query/decks';
import { Context } from "@apollo/client";
import AWS from "aws-sdk";
import DUE from "dynamodb-update-expression";

export async function updateDeck(
  _parent: ResolversParentTypes,
  _args: RequireFields<MutationUpdateDeckArgs, "deckId" | "updates">,
  _context: Context
) {
  const deck = await getDeckFromDb(_args.deckId);


  if (_context.userId !== deck?.authorId) {
    throw new Error("This deck doesn't belong to you.");
  }

  await updateDeckItem(_args.deckId, {
    title: _args.updates.title,
    description: _args.updates.description,
    published: _args.updates.published || deck.published,
    updated_at: new Date().toISOString(),
  });

  return {
    id: _args.deckId,
    title: _args.updates.title,
    description: _args.updates.description,
    published: _args.updates.published || deck.published,
  };
}

export async function updateDeckItem(deckId: string, update: any) {
  const updateExpression = DUE.getUpdateExpression(
    {
      id: deckId,
    },
    update
  );

  const payload = {
    TableName: process.env.DECKS_TABLE_NAME,
    Key: { id: deckId },
    ...updateExpression,
  };

  const db = new AWS.DynamoDB.DocumentClient();
  await db.update(payload).promise();
}
