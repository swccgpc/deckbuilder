import { getDeckFromDb } from '../query/decks';
import { updateDeckItem  } from '../mutation/update-deck';

export async function removeCardFromDeck(_parent, _args, _context) {
    if (!_context.userId) {
        throw new Error("Please login");
    }

    const deck = await getDeckFromDb(_args.deckId);
    if (!deck) {
      throw new Error(`deck not found: ${_args.deckId}`);
    }

    if (!deck.cards) {
        throw new Error(`deck has no cards: ${_args.deckId}`);
    }

    let cards = deck.cards.filter(c => c.id !== parseInt(_args.deckCardId));
    await updateDeckItem(_args.deckId, {
        cards: JSON.stringify(cards),
    });

    return {
        success: true,
    };
};
