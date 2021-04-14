import AWS from "aws-sdk";

export async function getCardCommentsFromDb(cardId: number) {
  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.CARD_COMMENTS_TABLE_NAME,
    ExpressionAttributeNames: {
      "#cid": "cardId"
    },
    ExpressionAttributeValues: {
        ':card': {N: `${cardId}`},
    },
    KeyConditionExpression: '#cid = :card',
  };

  const { Items } = await db.query(payload).promise();    
  const desItem = deserialize(Items);

  return desItem;
}

function deserialize(items) {
  if (items) {
      return items.map((item) =>  deserializeItem(item));
  }

  return null;
}

export function deserializeItem(item) {
  return item ? {
    id: item.created_at?.S,
    cardId: item.cardId?.N,
    created_at: item.created_at?.S,
    updated_at: item.updated_at?.S,
    authorId: item.authorId?.S,
    comment: item.comment?.S,
    author: { id: item.authorId?.S, username: 'Good' },
  } : null;
}