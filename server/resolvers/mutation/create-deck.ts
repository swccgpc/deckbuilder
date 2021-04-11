import { prisma } from "../../../pages/api/graphql";
const AWS = require("aws-sdk");
const DUE = require("dynamodb-update-expression");

export async function createDeck(_parent, _args, _context) {
  if (!_context.userId) {
    throw new Error("Please login");
  }

  const did = new Date().getTime();
  const updateExpression = DUE.getUpdateExpression(
    {
      id: `${did}`,
    },
    {
      deleted: 0,
      userId: _context.userId,
      updatedAt: new Date().toISOString(),
      side: _args.side,
    }
  );

  const payload = {
    TableName: process.env.DECKS_TABLE_NAME,
    Key: { id: `${did}` },
    ...updateExpression,
  };

  const db = new AWS.DynamoDB.DocumentClient();
  return db.update(payload).promise().then(() => ({ id: did, side: _args.side }));
}
