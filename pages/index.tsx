import { Toolbar, Content, Page } from "../components/Toolbar";
import styled from "styled-components";
import { DeckTile } from "../components/DeckTile";
import Footer from "../components/Footer";
import { useQuery, gql } from "@apollo/client";
import {
  GetRecentDecksQuery as GetRecentDecksQueryI,
  Side,
} from "../graphql/types";
import GetRecentDecksQuery from "raw-loader!../graphql/get-recent-decks.gql";
import { LinearProgress } from "@material-ui/core";

const HomePageContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const HomePageTitle = styled.div`
  font-size: 64px;
  font-weight: bold;
  color: #333333;
  margin-top: 20px;
`;

const HomePageH2 = styled.div`
  font-size: 32px;
  margin-bottom: 25px;
`;

const RecentTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-bottom: 2px solid #404040;
  width: 100%;
  margin-bottom: 20px;
`;

const RecentTitle = styled.div`
  display: flex;
  display: block;
  width: 122px;
  height: 40px;
  font-size: 20px;
  text-align: center;
  color: #404040;
  border-radius: 4px;
`;

const TileContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export default function Home() {
  const { data, loading } = useQuery<GetRecentDecksQueryI>(
    gql(GetRecentDecksQuery)
  );

  return (
    <Page>
      <Toolbar />
      <Content>
        <HomePageContent>
          <HomePageTitle>Deck Builder</HomePageTitle>
          <HomePageH2>For the Star Wars Customizable Card Game</HomePageH2>
          <RecentTitleContainer>
            <RecentTitle>Recent decks</RecentTitle>
            {loading && <LinearProgress style={{ width: "100%" }} />}
          </RecentTitleContainer>
          <TileContainer>
            {data &&
              data.recentDecks.map((deck, i) => {
                if (!deck) {
                  return;
                }
                return (
                  <DeckTile
                    key={i}
                    id={deck.id}
                    img={
                      deck.side === Side.Dark
                        ? "https://res.starwarsccg.org/deckdb/dark.png"
                        : "https://res.starwarsccg.org/deckdb/light.png"
                    }
                    title={deck.title}
                    createdAt={deck.createdAt}
                    ratings={deck.ratings}
                    description={deck.description}
                    author={deck.author.username}
                    totalRating={deck.totalRating}
                    totalRatingCount={deck.totalRatingCount}
                    types={
                      deck.deckCards
                        .map((deckCard) => deckCard?.card.type)
                        .filter(Boolean) as string[]
                    }
                  />
                );
              })}
          </TileContainer>
        </HomePageContent>
      </Content>
      <Footer></Footer>
    </Page>
  );
}
