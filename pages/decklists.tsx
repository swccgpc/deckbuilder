import { Toolbar, Content, Page } from "../components/Toolbar";
import styled from "styled-components";
import { DeckFilter } from "../components/DeckFilter";
import Footer from "../components/Footer";
import { useQuery, gql } from "@apollo/client";
import { GetDecksQuery, GetDecksQueryVariables } from "../graphql/types";
import GetDecks from "raw-loader!../graphql/get-decks.gql";
import { DeckRow } from "../components/deck-row";
import { LinearProgress } from "@material-ui/core";

const BodyContainer = styled.div`
  display: flex;
  background-color: white;
  margin-top: 30px;
  border-radius: 5px;
`;

const DeckFilterContainer = styled.div`
  width: 20%;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
  margin-right: 70px;
`;

const Table = styled.div`
  color: white;
  width: 65%;
`;

export default function DeckLists() {
  const { data } = useQuery<GetDecksQuery, GetDecksQueryVariables>(
    gql(GetDecks)
  );
  const decks = data && data.decks;
  if (!decks) {
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
      <Content>
        <BodyContainer>
          <DeckFilterContainer>
            <DeckFilter></DeckFilter>
          </DeckFilterContainer>
          <Table>
            {decks.map((deck, i) => {
              return <DeckRow key={i} deck={deck} />;
            })}
          </Table>
        </BodyContainer>
      </Content>
      <Footer></Footer>
    </Page>
  );
}
