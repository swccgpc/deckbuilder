import { prisma } from "../../pages/api/graphql";
import { Card } from "../../graphql/types";
import { singleCardById } from './query/cards';

export const DeckCard = {
  updatedAt: (_parent) => _parent.updated_at,
  createdAt: (_parent) => _parent.created_at,
  isInSideDeck: (_parent) => _parent.is_in_side_deck,
  isStartingCard: (_parent) => _parent.is_starting_card,
  card: (_parent) => singleCardById(_parent.cardId),
  deck: () => null,
};
