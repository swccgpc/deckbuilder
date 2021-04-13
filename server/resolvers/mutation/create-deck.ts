import { prisma } from "../../../pages/api/graphql";
import AWS from "aws-sdk";
import DUE from "dynamodb-update-expression";

export async function createDeck(_parent, _args, _context) {
  if (!_context.userId) {
    throw new Error("Please login");
  }

  const cd = new Date();
  const did = cd.getTime();
  const updateExpression = DUE.getUpdateExpression(
    {
      id: `${did}`,
    },
    {
      deleted: 0,
      authorId: _context.userId,
      created_at: cd.toISOString(),
      updated_at: cd.toISOString(),
      side: _args.side,
    }
  );

  const payload = {
    TableName: process.env.DECKS_TABLE_NAME,
    Key: { id: `${did}` },
    ...updateExpression,
  };

  const db = new AWS.DynamoDB.DocumentClient();
  await db.update(payload).promise();
  
  return { id: did, side: _args.side };
}
