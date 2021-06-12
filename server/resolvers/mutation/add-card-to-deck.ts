import { singleCardById } from '../query/cards';
import { getDeckFromDb } from '../query/decks';
import { updateDeckItem  } from '../mutation/update-deck';

function isCardInSideDeck(card: any) {
  return (
    card.front.type === "Objective" || card.front.type === "Defensive Shield"
  );
}

export async function addCardToDeck(_parent, _args, _context) {
  if (!_context.userId) {
    throw new Error("Please login");
  }

  const cardId = parseInt(_args.cardId);
  const cardToAdd = singleCardById(cardId);

  if (!cardToAdd) {
    throw new Error(`card not found: ${_args.cardId}`);
  }

  const deck = await getDeckFromDb(_args.deckId);
  if (!deck) {
    throw new Error(`deck not found: ${_args.deckId}`);
  }

  const cd = new Date();
  const newId = cd.getTime();
  deck.cards.push({
    id: newId,
    is_in_side_deck: isCardInSideDeck(cardToAdd),
    is_starting_card: false,
    cardId: cardId,
    created_at: cd.toISOString()
  });

  await updateDeckItem(_args.deckId, {
    cards: JSON.stringify(deck.cards),
  });

  return {
    newDeckCardId: newId,
  };
}
