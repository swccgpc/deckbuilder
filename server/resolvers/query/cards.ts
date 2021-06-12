const darkCards = require("../../../cards/Dark.json");
const lightCards = require("../../../cards/Light.json");

const allCardsArray = darkCards.cards.concat(lightCards.cards);

export function allCards() {
  return allCardsArray;
}

export function singleCard(_parent, _args) {
  const argId = parseInt(_args.id);
  return singleCardById(argId);
}

export function singleCardById(cardId: number) {
  const card = allCardsArray.filter(a => a.id === cardId);
  if (card && card.length) {
    return card[0];
  } else {
    return null;
  }  
}