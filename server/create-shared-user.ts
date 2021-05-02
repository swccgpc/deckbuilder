import AWS from "aws-sdk";
import DUE from "dynamodb-update-expression";


export async function getSharedUser() {
  const db = new AWS.DynamoDB();
  const payload = {
    TableName: process.env.USERS_TABLE_NAME,
    Key: {
      'username': {S: "allusers"}
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
        username: "allusers",
      },
      {
        id: did,
        first_name: "Shared User",
        last_name: "For All Accounts",
      }
    );
  
    const payload = {
      TableName: process.env.USERS_TABLE_NAME,
      Key: { username: "allusers" },
      ...updateExpression,
    };
  
    const db = new AWS.DynamoDB.DocumentClient();
    await db.update(payload).promise();

    user = {
      id: did,
      first_name: "Shared User",
      last_name: "For All Accounts",
      username: "allusers",
    };
  } else {
    user = {
      id: Item.id.N,
      first_name: Item.first_name.S,
      last_name: Item.last_name.S,
      username: Item.username.S,
    };
  }

  return user;

  // const sharedUser = await prisma.user.findOne({
  //   where: {
  //     username: "allusers",
  //   },
  // });
  // if (sharedUser) {
  //   return sharedUser;
  // }

  // return prisma.user.create({
  //   data: {
  //     first_name: "Shared User",
  //     last_name: "For All Accounts",
  //     username: "allusers",
  //   },
  // });
}
