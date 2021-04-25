import styled from "styled-components";
import { useRouter } from "next/router";
import { StarsComponent } from "./StarsComponent";
import moment from "moment";
import { GetRecentDecksQuery, Maybe } from "../graphql/types";

const Tile = styled.div`
  cursor: pointer;
  background-color: white;
  color: white;
  width: 450px;
  height: 175px;
  margin-bottom: 40px;
`;

const TileBannerImage = styled.img`
  height: 50px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #1d7a99;
`;

const TileBannerContainer = styled.div`
  display: flex;
`;

const TileBanner = styled.div`
  height: 50px;
  background-color: #1d7a99;
  font-size: 16px;
  padding: 5px;
  width: 100%;
`;

const TileAuthor = styled.div`
  font-size: 10px;
`;

const TileDescription = styled.div`
  color: black;
  font-size: 14px;
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
`;

const TileRatingContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

export const RatingText = styled.div`
  font-size: 10px;
  margin-left: 10px;
  color: black;
`;

const TileDeckCardTypes = styled.div`
  color: black;
  font-size: 12px;
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  width: 90%;
`;

export function DeckTile({
  id,
  img,
  title,
  author,
  createdAt,
  description,
  ratings,
  totalRating,
  totalRatingCount,
  types,
}: {
  id: string;
  img: string;
  title: string;
  author: string;
  createdAt: string;
  description: string;
  ratings: Maybe<{ id: string; rating: number }>[];
  totalRating: number;
  totalRatingCount: number;
  types: string[];
}) {
  const router = useRouter();
  return (
    <Tile onClick={() => router.push(`/deck/${id}`)}>
      <TileBannerContainer>
        <TileBannerImage src={img} />
        <TileBanner>
          {title}
          <TileAuthor>
            by {author} · updated {moment(createdAt).from(moment(new Date()))}
          </TileAuthor>
        </TileBanner>
      </TileBannerContainer>
      <TileDescription>Description: {description}</TileDescription>
      <TileDeckCardTypes>
        {Object.entries(
          types.reduce((all, type) => {
            if (!all[type]) {
              all[type] = 0;
            }
            all[type] += 1;
            return all;
          }, {})
        )
          .map(([type, count]) => {
            return `${count} ${count > 1 ? type + "s" : type}`;
          })
          .join(" • ")}
      </TileDeckCardTypes>
      <TileRatingContainer>
        <StarsComponent deck={{ totalRating, totalRatingCount }} ratings={ratings}></StarsComponent>
      </TileRatingContainer>
    </Tile>
  );
}
