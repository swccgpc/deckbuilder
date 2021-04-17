import { prisma } from "../../../pages/api/graphql";
import { getDeckFromDb } from '../query/decks';
import { updateDeckItem  } from '../mutation/update-deck';

export async function setStartingCard(_parent, _args) {
  const deck = await getDeckFromDb(_args.deckId);
  if (!deck) {
    throw new Error(`deck not found: ${_args.deckId}`);
  }

  if (!deck.cards) {
    throw new Error(`deck has no cards`);
  }

  let cardDeck = deck.cards.filter(c => c.cardId === parseInt(_args.deckCardId));
  if (cardDeck.length === 0) {
    throw new Error(`deckCard not found: ${_args.deckCardId}`);
  }

  cardDeck[0].is_starting_card = _args.isStartingCard;

  console.log(deck.cards);
  await updateDeckItem(_args.deckId, {
    cards: JSON.stringify(deck.cards),
  });

  return {
    id: cardDeck[0].id,
    is_starting_card: _args.isStartingCard
  };
}
