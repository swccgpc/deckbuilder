import AWS from "aws-sdk";

export async function getDeckCommentsFromDb(deckId: string) {
  const db = new AWS.DynamoDB()
  const payload = {
    TableName: process.env.DECK_COMMENTS_TABLE_NAME,
    ExpressionAttributeNames: {
      "#did": "deckId"
    },
    ExpressionAttributeValues: {
        ':deck': {S: deckId},
    },
    KeyConditionExpression: '#did = :deck',
  };

  const { Items } = await db.query(payload).promise();    
  const desItem = deserialize(Items);

  return desItem;
}

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
    deckId: item.deckId?.S,
    created_at: item.created_at?.S,
    updated_at: item.updated_at?.S,
    authorId: item.authorId?.S,
    comment: item.comment?.S,
    author: item.author ? JSON.parse(item.author?.S) : {},
  } : null;
}