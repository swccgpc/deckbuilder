import { prisma } from "../../../pages/api/graphql";
import { singleCardById } from '../query/cards';
import { getDeckCommentsFromDb } from '../query/comments';

export const Deck = {
  createdAt: (_parent) => _parent.created_at,
  updatedAt: (_parent) => _parent.updated_at,
  title: (_parent) => _parent.title || "Un-named Deck",
  description: (_parent) => _parent.description || "",
  ratings: (_parent) => _parent.ratings || [],
  author: (_parent) => _parent.author ? JSON.parse(_parent.author) : { id: _parent.authorId },
  deckCards: (_parent) => {
    return _parent.cards.map(c => {
      const card = singleCardById(c.cardId);
      const o = { ...c, ...card };
      return o;
    });
  },
  totalRating: (_parent) => _parent.total_rating,
  totalRatingCount: (_parent) => _parent.total_rating_count,
  comments: async (_parent, _context) => {
    return await getDeckCommentsFromDb(_parent.id);
  },
  // {
  //   return prisma.comment.findMany({
  //     orderBy: {
  //       created_at: "asc",
  //     },
  //     where: {
  //       Deck: {
  //         id: _parent.id,
  //       },
  //     },
  //   });
  // },
};
