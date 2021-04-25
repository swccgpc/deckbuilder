import StarsRating from "stars-rating";
import { RatingText } from "./DeckTile";
import { Maybe } from "../graphql/types";
import { getToken } from "../utils/frontend-auth";
export function StarsComponent({
  deck,
  ratings,
  onChange,
}: {
  onChange?: (rating: number) => void;
  deck: Maybe<{ totalRating: number, totalRatingCount: number }>;
  ratings: Maybe<{ id: string; rating: number }>[];
}) {
  const average = deck.totalRating / deck.totalRatingCount;
  const isLoggedIn = Boolean(getToken());
  return (
    <>
      <StarsRating
        count={5}
        size={15}
        color2={"#ffd700"}
        edit={Boolean(onChange) && isLoggedIn}
        value={average}
        half={true}
        onChange={onChange}
      />
      <RatingText>{ratings.length} ratings</RatingText>
    </>
  );
}
