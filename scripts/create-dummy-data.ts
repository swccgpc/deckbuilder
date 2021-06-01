const cards = require("../cards/cards.json");
const gempMapping = require("../cards/gemp_id_mapping.json");

function mapToString(val: any): string {
  return val === undefined || val === null ? undefined : val.toString();
}

export function getRandomDeck(allCards, side: string) {
  // map over current array
  const newArray = allCards.map((cards) => {
    return cards;
  });

  // Shuffle array
  const shuffled = newArray.sort(() => 0.5 - Math.random());

  // Get sub-array of first 60 elements after shuffle
  let randomDeck = shuffled
    .filter(({ side: cardSide }) => cardSide === side)
    .slice(0, 60);

  return randomDeck;
}
