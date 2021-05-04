import { getCardCommentsFromDb } from '../query/comments';

export const CardResolver = {
  id: (_parent) => _parent.id,
  type: (_parent) => _parent.front.type,
  cardId: (_parent) => _parent.id,
  side: (_parent) => _parent.side,
  rarity: (_parent) => _parent.rarity,
  set: (_parent) => _parent.set,
  title: (_parent) => _parent.front.title,
  imageUrl: (_parent) => _parent.front.imageUrl,
  subType: (_parent) => _parent.front.subType,
  destiny: (_parent) => _parent.front.destiny,
  power: (_parent) => _parent.front.power,
  deploy: (_parent) => _parent.front.deploy || undefined,
  forfeit: (_parent) => _parent.front.forfeit,
  gametext: (_parent) => _parent.front.gametext,
  lore: (_parent) => _parent.front.lore,
  gemp_card_id: (_parent) => _parent.gempId,
  comments: async (_parent, _context) => {
    return await getCardCommentsFromDb(_parent.id);
  },
};
