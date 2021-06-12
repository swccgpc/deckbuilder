import { useState } from "react";
import { Page, Toolbar, Content } from "../../../components/Toolbar";
import { useRouter } from "next/router";
import { CardSearchResults } from "../../../components/card-search-table/card-search-results";
import {
  CardFiltersBar,
  applyFilters,
} from "../../../components/card-search-table/card-filters-bar";
import { getCards } from "../../../components/card-search-table/getCards";
import { CardPanel } from "../../../components/card-panel";
import Footer from "../../../components/Footer";
import { useMutation, gql, useQuery } from "@apollo/client";
import AddCardToDeckMutation from "raw-loader!../../../graphql/add-card-to-deck.gql";
import RemoveCardFromDeckMutation from "raw-loader!../../../graphql/remove-card-from-deck.gql";
import GetDeckQuery from "raw-loader!../../../graphql/get-deck.gql";
import {
  MutationRemoveCardFromDeckArgs,
  GetDeckQueryVariables,
} from "../../../graphql/types";
import { CardFilters } from "../../../components/card-search-table/card-filters-bar";
import { GetDeckQuery as GetDeckQueryI, Side } from "../../../graphql/types";
import { LinearProgress } from "@material-ui/core";
import {
  MutationAddCardToDeckArgs,
  Mutation,
  Card,
} from "../../../graphql/types";

function getCardSuggestions({
  side,
  allCards,
  deckCards,
}: {
  side: Side;
  allCards: Card[];
  deckCards: DeckCard[];
}): Card[] {
  if (deckCards.length === 0) {
    if (side == Side.Dark) {
      return allCards.filter(({ title }) => {
        return title === "•Knowledge And Defense (V)";
      });
    } else {
      return allCards.filter(({ title }) => {
        return title === "•Anger, Fear, Aggression (V)";
      });
    }
  }

  const destroyTheJedi = allCards.find(({ title }) => {
    return (
      title ===
      "Hunt Down And Destroy The Jedi / Their Fire Has Gone Out Of The Universe"
    );
  });
  if (
    deckCards.some(
      (deckCard) =>
        deckCard?.card.cardId === (destroyTheJedi && destroyTheJedi.cardId)
    )
  ) {
    const cardsInDestroyTheJedi = [
      "•Executor: Holotheatre",
      "•Visage Of The Emperor",
      "•Executor: Meditation Chamber",
      "•Epic Duel",
    ];
    return allCards
      .filter(({ title }) => cardsInDestroyTheJedi.includes(title))
      .filter((cardSuggestion) => {
        return (
          deckCards
            .map((deckCard) => deckCard?.card.cardId)
            .indexOf(cardSuggestion.cardId) === -1
        );
      });
  }

  return [];
}

type DeckCard = GetDeckQueryI["deck"]["deckCards"][0];

export default function EditDeck() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    data: deckInfo,
    refetch: refreshDeck,
    loading: loadingDeck,
  } = useQuery<GetDeckQueryI, GetDeckQueryVariables>(gql(GetDeckQuery + "\n"), {
    variables: {
      id: router.query.id as string,
    },
    skip: !Boolean(router.query.id),
  });
  const [addCardToDeck] = useMutation<Mutation, MutationAddCardToDeckArgs>(
    gql(AddCardToDeckMutation)
  );
  const [removeCardFromDeck] = useMutation<
    Mutation,
    MutationRemoveCardFromDeckArgs
  >(gql(RemoveCardFromDeckMutation + ""));
  const [filters, updateFilters]: [
    CardFilters | undefined,
    (filters: CardFilters) => void
  ] = useState();
  const [allCards, setCards] = useState<Card[]>([]);
  const { id: deckId } = router.query;
  if (!deckId) {
    return (
      <Page>
        <Toolbar />
        <LinearProgress />
      </Page>
    );
  }
  if (allCards.length === 0) {
    getCards().then(setCards);
  }
  const addCard = (cardId: string) => {
    if (!cardId) {
      console.error("unable to aadd cardId:", cardId);
      return;
    }
    setLoading(true);
    addCardToDeck({
      variables: {
        cardId: cardId,
        deckId: deckId as string,
      },
    }).then(({ data, errors }) => {
      if (!data) {
        console.error("Error adding deckCard to deck", errors);
        return;
      }
      refreshDeck().then(() => {
        setLoading(false);
      });
    });
  };
  const removeCard = (cardToRemove: DeckCard) => {
    if (!cardToRemove) {
      console.log("Unable to remove card", cardToRemove);
      return;
    }
    setLoading(true);
    removeCardFromDeck({
      variables: {
        deckId: deckId as string,
        deckCardId: cardToRemove.id,
      },
    }).then(() => {
      refreshDeck().then(() => {
        setLoading(false);
      });
    });
  };
  if (!deckId || !deckInfo || !deckInfo.deck) {
    return (
      <Page>
        <Toolbar />
        <LinearProgress />
      </Page>
    );
  }

  return (
    <Page>
      <Toolbar />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <CardFiltersBar
          allCards={allCards}
          showSideFilter={false}
          filters={filters}
          onUpdateFilters={(filters) => updateFilters(filters)}
        />
        <div style={{ display: "flex" }}>
          <CardSearchResults
            cards={applyFilters(allCards, {
              ...filters,
              side: deckInfo.deck.side as any,
            })}
            showSide={deckInfo.deck.side}
            onCardSelected={addCard}
            newTab={"_blank"}
            style={{
              width: "70vw",
              marginLeft: "3vw",
            }}
          />
          <CardPanel
            loading={loading}
            deck={deckInfo.deck}
            suggestedCards={
              allCards.length
                ? getCardSuggestions({
                    deckCards: deckInfo.deck.deckCards || [],
                    allCards,
                    side: deckInfo.deck.side,
                  })
                : []
            }
            addCard={addCard}
            removeCard={removeCard}
          ></CardPanel>
        </div>
      </div>
      <Footer></Footer>
    </Page>
  );
}
