import styled from "styled-components";
import PersonIcon from "@material-ui/icons/Person";
import Link from "@material-ui/core/Link";
import { groupBy } from "../utils/utils";
import { CardTypeSection } from "../pages/deck/[id]";
import { DeckCard } from "../graphql/types";
import { getUserId } from '../utils/frontend-auth';

const MiddleContent = styled.div`
  display: flex;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
`;

const LeftContent = styled.div`
  width: 50%;
`;

const DeckInfoContainer = styled.div`
  display: flex;
  font-size: 14px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const DeckCardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const PlayerName = styled.div`
  display: flex;
  font-size: 24px;
`;

const Description = styled.div`
  font-size: 14px;
`;

export default function DeckIdContent({
  username,
  description,
  deckCards,
  deckId,
  deckUserId,
}: {
  description: string;
  username: string;
  deckCards: DeckCard[];
  deckId: string;
  deckUserId: string;
}) {
  return (
    <div>
      <MiddleContent>
        <LeftContent>
          <DeckCardsContainer>
            {groupBy(deckCards, ["card", "type"])
              .sort((groupA, groupB) => groupA.length - groupB.length)
              .map((cardsInType, i) => (
                <CardTypeSection key={i} deckCards={cardsInType} />
              ))}
          </DeckCardsContainer>
        </LeftContent>
        <RightContent>
          <PlayerName>
            <PersonIcon style={{ fontSize: "31px" }} />
            <div>{username}</div>
          </PlayerName>
          <Description>{description}</Description>
          { deckUserId === getUserId() ? <Link title="Edit Deck" variant="button" href={`/deck/edit/${deckId}`}>Edit Deck</Link> : null }
        </RightContent>
      </MiddleContent>
    </div>
  );
}
