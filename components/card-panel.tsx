import { useState, useEffect, useRef } from "react";
import { StickyContainer, Sticky } from "react-sticky";
import styled from "styled-components";
import { ClickAwayListener, LinearProgress } from "@material-ui/core";
import { darkBlue, goldenColor } from "../utils/colors";
import {
  Card,
  GetDeckQuery,
  SetStartingCardMutation,
  SetStartingCardMutationVariables,
} from "../graphql/types";
import { CardPanelRow } from "./card-panel-row";
import { groupCards } from "./card-panel-group-cards";
import { useMutation, gql } from "@apollo/client";
import SetStartingCard from "raw-loader!../graphql/set-starting-card.gql";
import UpdateDeck from "raw-loader!../graphql/update-deck.gql";
import {
  UpdateDeckMutation,
  UpdateDeckMutationVariables,
} from "../graphql/types";

const CardPanelSection = styled.div`
  background-color: black;
`;

const DeckBuilderCardsContainer = styled.div`
  overflow-y: scroll;
  height: 350px;
`;
const CardPanelSectionTitle = styled.div`
  color: ${goldenColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardInfoContainer = styled.div`
  position: absolute;
  width: 350px;
  top: 0px;
  left: -350px;
`;

const DeckBuilderTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const DeckBuilderHeader = styled.div`
  display: flex;
  align-items: center;
`;

const EmptyDeckState = styled.div`
  margin-top: 20px;
  display: flex;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  justify-content: center;
`;

export type DeckCard = GetDeckQuery["deck"]["deckCards"][0];

export interface CardWithDeckInfo extends Card {
  isSideDeck: boolean;
}

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function CardPanel({
  loading,
  deck,
  suggestedCards,
  addCard,
  removeCard,
}: {
  loading: boolean;
  deck?: GetDeckQuery["deck"];
  suggestedCards: Card[];
  addCard: (cardId: string) => void;
  removeCard: (card: DeckCard) => void;
}) {
  const [setStartingCard] = useMutation<
    SetStartingCardMutation,
    SetStartingCardMutationVariables
  >(gql(SetStartingCard));
  const [updateDeck] = useMutation<
    UpdateDeckMutation,
    UpdateDeckMutationVariables
  >(gql(UpdateDeck));
  const [scrollDiv, setScrollDiv] = useState(undefined);
  // TODO need to setup this scroll
  const prev = usePrevious({
    cardRowLength: groupCards(deck?.deckCards || []).length,
  });
  useEffect(() => {
    if (
      prev &&
      groupCards(deck?.deckCards || []).length > (prev as any).cardRowLength &&
      scrollDiv
    ) {
      (scrollDiv as any).scrollIntoViewIfNeeded({ behavior: "smooth" });
    }
  }, [deck?.deckCards]);
  const [cardInfo, setCardInfo]: [
    { card?: Card; clickAwayActive: boolean } | undefined,
    (cardInfo: { card?: Card; clickAwayActive: boolean } | undefined) => void
  ] = useState();
  const onCardInfoHandler = (card?: Card) => () => {
    if (cardInfo?.card?.id === card?.id) {
      setCardInfo(undefined);
    } else {
      if (cardInfo) {
        // this means we are switching between cards
        // and we dont want the click away listener to remove
        // the card
        setCardInfo({ card, clickAwayActive: false });
      } else {
        setCardInfo({ card, clickAwayActive: true });
      }
    }
  };
  const cardsInMainDeck =
    deck?.deckCards.filter((deckCard) => !deckCard?.isInSideDeck) || [];
  const cardsInSideDeck =
    deck?.deckCards.filter((deckCard) => deckCard?.isInSideDeck) || [];
  if (!deck) {
    return <div>Loading...</div>;
  }
  return (
    <StickyContainer>
      <Sticky>
        {({ style }) => (
          <div
            style={{
              ...style,
              width: "300px",
              backgroundColor: darkBlue,
              border: "2px solid grey",
              margin: "10px",
              color: "white",
              position: "relative",
              ...(loading
                ? {
                    pointerEvents: "none",
                  }
                : {}),
            }}
          >
            {loading ? (
              <LinearProgress color="secondary" style={{ height: "3px" }} />
            ) : (
              <div style={{ height: "3px" }}></div>
            )}
            <DeckBuilderHeader>
              <img src="https://res.starwarsccg.org/deckdb/dark.png" style={{ height: "50px" }}></img>

              <DeckBuilderTitle>
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    updateDeck({
                      variables: {
                        deckId: deck.id,
                        title: e.target.innerText,
                      },
                    });
                  }}
                >
                  {deck.title}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>
                  &nbsp;({cardsInMainDeck.length}/60)
                </span>
              </DeckBuilderTitle>
            </DeckBuilderHeader>
            <textarea
              placeholder="No deck description"
              style={{
                width: "100%",
                backgroundColor: "initial",
                border: "0px",
                resize: "vertical",
                textAlign: "center",
                color: "white",
                borderBottom: "1px solid black",
              }}
              defaultValue={deck.description}
              onBlur={(e) => {
                updateDeck({
                  variables: {
                    deckId: deck.id,
                    description: e.target.value,
                  },
                });
              }}
            ></textarea>
            <DeckBuilderCardsContainer>
              {deck?.deckCards?.length === 0 ? (
                <EmptyDeckState>
                  Click add in the table to add cards to your deck
                </EmptyDeckState>
              ) : (
                groupCards(cardsInMainDeck).map(({ deckCard, count }, i) => (
                  <CardPanelRow
                    key={i}
                    card={deckCard?.card as Card}
                    textColor={
                      deckCard?.isStartingCard ? goldenColor : undefined
                    }
                    count={count}
                    hoverButtons={[
                      {
                        onClick: () => {
                          if (!deckCard) {
                            console.error(
                              "Unable to set starting card for",
                              deckCard
                            );
                            return;
                          }
                          setStartingCard({
                            variables: {
                              deckCardId: deckCard.id,
                              isStartingCard: !Boolean(deckCard.isStartingCard),
                            },
                          });
                        },
                        text: "s",
                        fontSize: "12px",
                        tooltip: "Mark as starting card",
                      },
                      {
                        onClick: onCardInfoHandler(deckCard?.card as Card),
                        text: "i",
                        fontSize: "12px",
                      },
                      { onClick: () => removeCard(deckCard), text: "-" },
                      {
                        onClick: () =>
                          deckCard?.card.id && addCard(deckCard?.card.id),
                        text: "+",
                      },
                    ]}
                  />
                ))
              )}
              <div
                style={{ height: "0px" }}
                ref={(ref) => {
                  (window as any).ref = ref;
                  setScrollDiv(ref as any);
                }}
              ></div>
            </DeckBuilderCardsContainer>
            {cardsInSideDeck.length ? (
              <CardPanelSection>
                <CardPanelSectionTitle>Side Deck</CardPanelSectionTitle>
                {groupCards(cardsInSideDeck).map(({ deckCard, count }, i) => (
                  <CardPanelRow
                    key={i}
                    card={deckCard?.card as Card}
                    count={count}
                    hoverButtons={[
                      {
                        onClick: onCardInfoHandler(deckCard?.card as Card),
                        text: "i",
                        fontSize: "12px",
                      },
                      { onClick: () => removeCard(deckCard), text: "-" },
                      {
                        onClick: () =>
                          deckCard?.card.id && addCard(deckCard?.card.id),
                        text: "+",
                      },
                    ]}
                  />
                ))}
              </CardPanelSection>
            ) : null}
            {suggestedCards.length ? (
              <CardPanelSection>
                <CardPanelSectionTitle>Suggested Cards</CardPanelSectionTitle>
                {suggestedCards.map((card, i) => (
                  <CardPanelRow
                    key={i}
                    card={card}
                    count={0}
                    backgroundColor="black"
                    hoverButtons={[
                      {
                        onClick: onCardInfoHandler(card),
                        text: "i",
                        fontSize: "12px",
                      },
                      {
                        onClick: () => card.id && addCard(card.id),
                        text: "accept",
                        fontSize: "12px",
                      },
                    ]}
                  />
                ))}
              </CardPanelSection>
            ) : null}
            {cardInfo ? (
              <ClickAwayListener
                onClickAway={() => {
                  if (cardInfo.clickAwayActive) {
                    setCardInfo(undefined);
                  } else {
                    setCardInfo({ ...cardInfo, clickAwayActive: true });
                  }
                }}
              >
                <CardInfoContainer>
                  <img src={cardInfo?.card?.imageUrl || ""} />
                </CardInfoContainer>
              </ClickAwayListener>
            ) : null}
          </div>
        )}
      </Sticky>
    </StickyContainer>
  );
}
