import { useState } from "react";
import moment from "moment";
import styled from "styled-components";
import {
  Side,
  UpdateDeckMutation,
  UpdateDeckMutationVariables,
} from "../graphql/types";
import { useRouter } from "next/router";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { ClickAwayListener, Menu, MenuItem } from "@material-ui/core";
import { useMutation, gql } from "@apollo/client";
import UpdateDeck from "raw-loader!../graphql/update-deck.gql";
import {
  GetDecksQuery,
  DeleteDeckMutation,
  DeleteDeckMutationVariables,
} from "../graphql/types";
import { StarsComponent } from "./StarsComponent";
import DeleteDeck from "raw-loader!../graphql/delete-deck.gql";

const DeckDiv = styled.div`
  cursor: pointer;
  display: flex;
  height: 75px;
  color: black;
  border-bottom: 1px solid grey;
`;

const Image = styled.img`
  height: 65px;
  margin: 5px;
`;

const TitleAuthorContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const Title = styled.div`
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 5px;
`;

const Author = styled.div`
  font-size: 10px;
`;

const IconDaysDiv = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  justify-content: flex-end;
  padding-top: 14px;
  flex-grow: 1;
  margin-right: 20px;
`;

const RatingText = styled.div`
  font-size: 10px;
  margin-left: 10px;
  color: black;
`;

const TileRatingContainer = styled.div`
  display: flex;
  font-size: 10px;
  margin-top: 6px;
  justify-content: flex-end;
  align-items: center;
`;

const Days = styled.div`
  font-size: 12px;
`;

const ratingChanged = (newRating: number) => {
  console.log(newRating);
};

type Deck = GetDecksQuery["decks"][0];

export function DeckRow({
  deck,
  onDeleted,
  editable = false,
}: {
  editable?: boolean;
  onDeleted?: () => void;
  deck: Deck;
}) {
  const router = useRouter();
  const [updateDeck] = useMutation<
    UpdateDeckMutation,
    UpdateDeckMutationVariables
  >(gql(UpdateDeck));
  const [deleteDeck] = useMutation<
    DeleteDeckMutation,
    DeleteDeckMutationVariables
  >(gql(DeleteDeck));
  const [dropDownOpen, setDropDownOpen] = useState(false);
  if (!deck) {
    return null;
  }
  return (
    <DeckDiv key={deck.id} onClick={() => router.push(`/deck/${deck.id}`)}>
      <Image
        src={deck.side === Side.Dark ? "https://res.starwarsccg.org/deckdb/dark.png" : "https://res.starwarsccg.org/deckdb/light.png"}
      ></Image>
      <TitleAuthorContainer>
        <Title>{deck.title}</Title>
        <Author>By {deck.author.username}</Author>
      </TitleAuthorContainer>
      <IconDaysDiv>
        <TileRatingContainer>
          <StarsComponent deck={deck} ratings={deck.ratings} />
        </TileRatingContainer>
        <Days>Created {moment(deck.createdAt).from(moment(new Date()))}</Days>
      </IconDaysDiv>
      {editable && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setDropDownOpen(!dropDownOpen);
          }}
        >
          <KeyboardArrowDownIcon />
          {dropDownOpen ? (
            <ClickAwayListener onClickAway={() => setDropDownOpen(false)}>
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  padding: "10px",
                  bottom: "-75px",
                  right: "0px",
                  zIndex: 3,
                  border: "1px solid black",
                }}
              >
                <MenuItem onClick={() => router.push(`/deck/edit/${deck.id}`)}>
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    updateDeck({
                      variables: {
                        deckId: deck.id,
                        published: !deck.published,
                      },
                    });
                  }}
                >
                  {deck.published ? "Unpublish" : "Publish"}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    deleteDeck({
                      variables: {
                        deckId: deck.id,
                      },
                    }).then(onDeleted ? onDeleted : () => {});
                  }}
                >
                  Delete
                </MenuItem>
              </div>
            </ClickAwayListener>
          ) : null}
        </div>
      )}
    </DeckDiv>
  );
}
