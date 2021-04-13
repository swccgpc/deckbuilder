import { prisma } from "../../../pages/api/graphql";
export const Deck = {
  createdAt: (_parent) => _parent.created_at,
  updatedAt: (_parent) => _parent.updated_at,
  title: (_parent) => _parent.title || "Un-named Deck",
  description: (_parent) => _parent.description || "",
  ratings: (_parent) => _parent.ratings || [],
  author: (_parent) => _parent.author ? JSON.parse(_parent.author) : { id: _parent.authorId },
  deckCards: (_parent) => _parent.deckCards || [],
  comments: (_parent) => _parent.comments || [],
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
