import { prisma } from "../../../pages/api/graphql";
import { getDeckFromDb } from '../query/decks';
import { updateDeckItem  } from '../mutation/update-deck';

export async function deleteDeck(_parent, _args, _context) {
  const deck = await getDeckFromDb(_args.deckId);

  if (deck.authorId !== _context.userId) {
    throw new Error("You can only delete decks you created.");
  }

  await updateDeckItem(_args.deckId, {
    deleted: 1,
  });

  return {
    success: true,
  };
}
