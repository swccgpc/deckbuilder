import jwt from "jsonwebtoken";
import { prisma } from "../../../pages/api/graphql";
import { handler } from "../../decode-verify-jwt";
import AWS from "aws-sdk";
import DUE from "dynamodb-update-expression";

export async function login(_parent, _args) {
  const { error, userName } = await handler({ token: _args.awsJWTToken });
  if (error) {
    throw new Error("Error while logging in: " + JSON.stringify(error));
  }

  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.USERS_TABLE_NAME,
    Key: {
      'username': {S: userName}
    },
    "ConsistentRead": true,
  };

  const { Item } = await db.getItem(payload).promise();
  let user;
  if (!Item) {
    const cd = new Date();
    const did = cd.getTime();

    const updateExpression = DUE.getUpdateExpression(
      {
        username: userName,
      },
      {
        id: did,
      }
    );
  
    const payload = {
      TableName: process.env.USERS_TABLE_NAME,
      Key: { username: userName },
      ...updateExpression,
    };
  
    const db = new AWS.DynamoDB.DocumentClient();
    await db.update(payload).promise();

    user = { id: did };
  } else {
    user = { id: Item.id.N };
  }

  return {
    jwt: jwt.sign({ userId: user.id, username: userName }, process.env.JWT_SECRET),
  };
}
