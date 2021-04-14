import { prisma } from "../../../pages/api/graphql";
import { singleCardById } from '../query/cards';

export const Comment = {
  createdAt: (_parent) => _parent.created_at,
  updatedAt: (_parent) => _parent.updated_at,
  author: (_parent) => _parent.author,
  deck: (_parent) => {
    if (!_parent.deckId) {
      return null;
    }
    return prisma.deck.findOne({
      where: {
        id: _parent.deckId,
      },
    });
  },
  card: (_parent) => {
    if (!_parent.cardId) {
      return null;
    }
    return singleCardById(_parent.cardId);
  },
};
