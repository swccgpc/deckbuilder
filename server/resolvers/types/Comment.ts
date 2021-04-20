import { prisma } from "../../../pages/api/graphql";
import { singleCardById } from '../query/cards';
import { getDeckFromDb } from '../query/decks';

export const Comment = {
  createdAt: (_parent) => _parent.created_at,
  updatedAt: (_parent) => _parent.updated_at,
  author: (_parent) => _parent.author,
  deck: async (_parent) => {
    if (!_parent.deckId) {
      return null;
    }

    return await getDeckFromDb(_parent.deckId, true);
  },
  card: (_parent) => {
    if (!_parent.cardId) {
      return null;
    }
    return singleCardById(_parent.cardId);
  },
};
