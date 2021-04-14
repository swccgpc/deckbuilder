import AWS from "aws-sdk";

export async function addCardComment(cardId: number, comment: string, userId: string) {
  const cd = new Date().toISOString();
  const item = {
    cardId,
    created_at: cd,
    comment: comment,
    updated_at: cd,
    authorId: userId
  };

  const payload = {
    TableName: process.env.CARD_COMMENTS_TABLE_NAME,
    Item: item,
  };

  const db = new AWS.DynamoDB.DocumentClient();
  await db.put(payload).promise();

  return {
    id: cd,
    created_at: cd,
    updated_at: cd,
    author: { id: userId, username: 'Good' },
    comment,
    cardId
  };
}

export async function createComment(_parent, _args, _context) {
  if (!_context.userId) {
    throw new Error("Please signin");
  }
  if (!_args.deckId && !_args.cardId) {
    throw new Error("Either deckId or cardId is required for a comment");
  }
  if (_args.deckId && _args.cardId) {
    throw new Error("Only deckId or cardId can be provided for a comment");
  }

  if (_args.cardId) {
    return await addCardComment(parseInt(_args.cardId), _args.comment, _context.userId);
  } else {
    throw new Error('Not implemented');
  }
}
