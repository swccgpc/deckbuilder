import { useState } from "react";
import { Toolbar, Content, Page } from "../../components/Toolbar";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import styled from "styled-components";
import Router from "next/router";
import Footer from "../../components/Footer";
import CreateDeckQuery from "raw-loader!../../graphql/create-deck.gql";
import { useMutation, gql } from "@apollo/client";
import { MutationCreateDeckArgs, Side, Mutation } from "../../graphql/types";

const DeckSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
`;

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
`;

export default function NewDeck() {
  const [createDeck] = useMutation<Mutation, MutationCreateDeckArgs>(
    gql(CreateDeckQuery + "")
  );
  const [side, setSide] = useState(Side.Dark);
  return (
    <Page>
      <Toolbar />
      <Content>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DeckSideContainer onClick={() => setSide(Side.Dark)}>
              <img src="https://res.starwarsccg.org/deckdb/dark.png"></img>
              <RadioContainer>
                <Radio
                  checked={side === Side.Dark}
                  onChange={() => setSide(Side.Dark)}
                  value="a"
                  name="radio-button-demo"
                />
                Dark
              </RadioContainer>
            </DeckSideContainer>
            <DeckSideContainer onClick={() => setSide(Side.Light)}>
              <img src="https://res.starwarsccg.org/deckdb/light.png"></img>
              <RadioContainer>
                <Radio
                  checked={side === Side.Light}
                  onChange={() => setSide(Side.Light)}
                  value="a"
                  name="radio-button-demo"
                />
                Light
              </RadioContainer>
            </DeckSideContainer>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                createDeck({
                  variables: {
                    side: side,
                  },
                }).then((res) => {
                  Router.push({
                    pathname: `/deck/edit/${res.data.createDeck.id}`,
                  });
                })
              }
            >
              Create deck
            </Button>
          </div>
        </div>
      </Content>
      <Footer></Footer>
    </Page>
  );
}
