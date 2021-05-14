import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import BlurOnIcon from "@material-ui/icons/BlurOn";
import FlagIcon from "@material-ui/icons/Flag";
import GavelIcon from "@material-ui/icons/Gavel";
import { Side } from "./card.interface";
import { unique, sortAlphabetically } from "../../utils/utils";
import { useState } from "react";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import FilterListIcon from "@material-ui/icons/FilterList";
import { orange } from "@material-ui/core/colors";
import { FilterIcon } from "./FilterIcon";
import { Card as CardFromServer } from "../../graphql/types";
import sets from '../../cards/sets.json';

export const lightOrange = orange[200];

const SearchContainer = styled.div`
  border-radius: 50px;
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 7px;
  margin-right: 10px;
`;

const CardFilterBarContainer = styled.div`
  display: flex;
  background-color: #2d2d2f;
  justify-content: center;
  color: white;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 20px;
  @media (min-width: 1000px) {
    padding: 10px 100px;
  }
`;

const Input = styled.input`
  background-color: transparent;
  border: 0px;
  color: white;
  &:focus {
    outline: none;
  }
`;

function getSetName(setId: string) {
  const set = sets.filter(s => s.id === setId);
  if (set && set.length) {
    const setObject = set[0];
    return setObject.name;
  }

  return setId;
}

function getSetId(setName: string) {
  const set = sets.filter(s => s.name === setName);
  if (set && set.length) {
    const setObject = set[0];
    return setObject.id;
  }

  return setName;
}

export function applyFilters(allCards: CardFromServer[], filters: CardFilters) {
  return allCards
    .filter((card) => {
      if (!filters || !filters.side) {
        return true;
      }

      return filters.side.includes(card.side);
    })
    .filter((card) => {
      if (!filters || !filters.type) {
        return true;
      }

      return filters.type.includes(card.type);
    })
    .filter((card) => {
      if (!filters || !filters.sets) {
        return true;
      }

      return filters.sets.includes(card.set);
    })
    .filter((card) => {
      if (!filters || !filters.destiny) {
        return true;
      }

      const destiny = card.destiny;
      if (destiny === undefined) {
        return false;
      }
      return filters.destiny.includes(destiny);
    })
    .filter((card) => {
      if (!filters || !filters.forfeit) {
        return true;
      }

      const forfeit = card.forfeit;
      if (forfeit === undefined) {
        return false;
      }
      return filters.forfeit.includes(forfeit);
    })
    .filter((card) => {
      if (!filters || !filters.deploy) {
        return true;
      }

      const deploy = card.deploy;
      if (deploy === undefined) {
        return false;
      }
      return filters.deploy.includes(deploy);
    })
    .filter((card) => {
      if (!filters || !filters.power) {
        return true;
      }

      const power = card.power;
      if (power === undefined) {
        return false;
      }
      return filters.power.includes(power);
    })
    .filter((card) => {
      if (!filters || !filters.titleFilter) {
        return true;
      }
      return card.title
        .toLowerCase()
        .includes(filters.titleFilter.toLowerCase());
    });
}

enum DropDownFilters {
  side = "side",
  set = "set",
  type = "type",
  destiny = "destiny",
  power = "power",
  deploy = "deploy",
  forfeit = "forfeit",
}

export const DEFAULT_OPTION = "All";

export interface CardFilters {
  titleFilter?: string;
  side?: Side | string[];
  sets?: string[];
  type?: string[];
  destiny?: string[];
  power?: string[];
  deploy?: string[];
  forfeit?: string[];
}

export function CardFiltersBar({
  allCards,
  filters = {},
  showSideFilter = true,
  onUpdateFilters,
}: {
  allCards: CardFromServer[];
  showSideFilter?: boolean;
  filters?: CardFilters;
  onUpdateFilters: (cardFilters: CardFilters) => void;
}) {
  const [openDropDown, setOpenDropDown] = useState(undefined);
  const [filterBarOpen, setFilterBarOpen] = useState(false);
  const sets = sortAlphabetically(unique(allCards.map(({ set }) => set)).map(m => getSetName(m))).map(n => getSetId(n));
  const types = sortAlphabetically(unique(allCards.map(({ type }) => type)));
  const getAllOptions = (key: string) => {
    return sortAlphabetically(
      unique(
        allCards
          .map((c) => c[key])
          .filter(Boolean)
          .map((item) => item.toString())
      )
    );
  };
  const destiny = getAllOptions("destiny");
  const powerOptions = getAllOptions("power");
  const deployOptions = getAllOptions("deploy");
  const forfeitOptions = getAllOptions("forfeit");
  const optionChosen = (filterKey: string) => (newOption: string) => {
    if (newOption === DEFAULT_OPTION) {
      onUpdateFilters({
        ...filters,
        [filterKey]: undefined,
      });
      return;
    }
    const options = filters[filterKey] || [];
    let newOptions;
    if (options.includes(newOption)) {
      const indexOfOption = options.indexOf(newOption);
      newOptions = [
        ...options.slice(0, indexOfOption),
        undefined,
        ...options.slice(indexOfOption + 1),
      ];
    } else {
      newOptions = [...options, newOption];
    }

    onUpdateFilters({
      ...filters,
      [filterKey]: newOptions.length === 0 ? undefined : newOptions,
    });
  };
  return (
    <CardFilterBarContainer>
      <SearchContainer>
        <SearchIcon style={{ transform: "rotate(90deg)" }} />
        <Input
          placeholder="Search"
          defaultValue={filters && filters.titleFilter}
          onKeyUp={(e) =>
            onUpdateFilters({
              ...filters,
              titleFilter: (e.target as any).value,
            })
          }
        ></Input>
      </SearchContainer>

      <div style={{ display: "flex", flexGrow: 1 }}></div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          cursor: "pointer",
          color: "white",
          width: "50%",
        }}
        onClick={() => setFilterBarOpen(!filterBarOpen)}
      >
        <FilterListIcon></FilterListIcon>
        <div>Filters</div>
      </div>

      {filterBarOpen ? (
        <div
          style={{
            display: "flex",
            marginTop: "10px",
            justifyContent: "space-between",
          }}
        >
          {showSideFilter ? (
            <FilterIcon
              Icon={RecentActorsIcon}
              name={"Side:"}
              options={[Side.dark, Side.light]}
              active={filters && filters.side}
              open={openDropDown === DropDownFilters.side}
              onOpen={() => setOpenDropDown(DropDownFilters.side)}
              onClose={() => setOpenDropDown(undefined)}
              onOptionChosen={optionChosen("side")}
            />
          ) : null}

          <FilterIcon
            Icon={MenuBookIcon}
            name={"Set:"}
            options={sets}
            active={filters && filters.sets}
            open={openDropDown === DropDownFilters.set}
            onOpen={() => setOpenDropDown(DropDownFilters.set)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("sets")}
            formatName={(setId: string) => getSetName(setId)}
          />
          <FilterIcon
            Icon={SupervisorAccountIcon}
            name={"Type:"}
            options={types}
            active={filters && filters.type}
            open={openDropDown === DropDownFilters.type}
            onOpen={() => setOpenDropDown(DropDownFilters.type)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("type")}
          />
          <FilterIcon
            Icon={BlurOnIcon}
            name={"Destiny:"}
            active={filters && filters.destiny}
            options={destiny}
            open={openDropDown === DropDownFilters.destiny}
            onOpen={() => setOpenDropDown(DropDownFilters.destiny)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("destiny")}
          />
          <FilterIcon
            Icon={GavelIcon}
            name={"Power:"}
            active={filters && filters.power}
            options={powerOptions}
            open={openDropDown === DropDownFilters.power}
            onOpen={() => setOpenDropDown(DropDownFilters.power)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("power")}
          />
          <FilterIcon
            Icon={ArrowUpwardIcon}
            name={"Deploy:"}
            active={filters && filters.deploy}
            options={deployOptions}
            open={openDropDown === DropDownFilters.deploy}
            onOpen={() => setOpenDropDown(DropDownFilters.deploy)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("deploy")}
          />
          <FilterIcon
            Icon={FlagIcon}
            name={"Forfeit:"}
            active={filters && filters.forfeit}
            options={forfeitOptions}
            open={openDropDown === DropDownFilters.forfeit}
            onOpen={() => setOpenDropDown(DropDownFilters.forfeit)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("forfeit")}
          />
        </div>
      ) : null}
    </CardFilterBarContainer>
  );
}
