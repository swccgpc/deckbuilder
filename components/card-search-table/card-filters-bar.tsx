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
    })
    .filter((card) => {
      if (!filters || !filters.subType) {
        return true;
      }

      const subType = card.subType;
      if (subType === undefined) {
        return false;
      }
      return filters.subType.includes(subType);
    })
    .filter((card) => {
      if (!filters || !filters.hyperspeed) {
        return true;
      }

      const hyperspeed = card.hyperspeed;
      if (hyperspeed === undefined) {
        return false;
      }
      return filters.hyperspeed.includes(hyperspeed);
    })
    .filter((card) => {
      if (!filters || !filters.defense) {
        return true;
      }

      const defense = card.defense;
      if (defense === undefined) {
        return false;
      }
      return filters.defense.includes(defense);
    })
    .filter((card) => {
      if (!filters || !filters.ability) {
        return true;
      }

      const ability = card.ability;
      if (ability === undefined) {
        return false;
      }
      return filters.ability.includes(ability);
    })
    .filter((card) => {
      if (!filters || !filters.armor) {
        return true;
      }

      const armor = card.armor;
      if (armor === undefined) {
        return false;
      }
      return filters.armor.includes(armor);
    })
    .filter((card) => {
      if (!filters || !filters.landspeed) {
        return true;
      }

      const landspeed = card.landspeed;
      if (landspeed === undefined) {
        return false;
      }
      return filters.landspeed.includes(landspeed);
    })
    .filter((card) => {
      if (!filters || !filters.maneuver) {
        return true;
      }

      const maneuver = card.maneuver;
      if (maneuver === undefined) {
        return false;
      }
      return filters.maneuver.includes(maneuver);
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
  subType = "subType",
  defense = "defense",
  hyperspeed = "hyperspeed",
  ability = "ability",
  armor = "armor",
  landspeed = "landspeed",
  maneuver = "maneuver",
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
  subType?: string[];
  defense?: string[];
  hyperspeed?: string[];
  ability?: string[];
  armor?: string[];
  landspeed?: string[];
  maneuver?: string[];
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
  const subTypeOptions = getAllOptions("subType");
  const defenseOptions = getAllOptions("defense");
  const hyperSpeedOptions = getAllOptions("hyperspeed");
  const abilityOptions = getAllOptions("ability");
  const armorOptions = getAllOptions("armor");
  const landspeedOptions = getAllOptions("landspeed");
  const maneuverOptions = getAllOptions("maneuver");
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
            flexWrap: 'wrap',
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
          <FilterIcon
            Icon={FlagIcon}
            name={"Subtype:"}
            active={filters && filters.subType}
            options={subTypeOptions}
            open={openDropDown === DropDownFilters.subType}
            onOpen={() => setOpenDropDown(DropDownFilters.subType)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("subType")}
          />
          <FilterIcon
            Icon={FlagIcon}
            name={"Defense:"}
            active={filters && filters.defense}
            options={defenseOptions}
            open={openDropDown === DropDownFilters.defense}
            onOpen={() => setOpenDropDown(DropDownFilters.defense)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("defense")}
          />
          <FilterIcon
            Icon={FlagIcon}
            name={"Hyperspeed:"}
            active={filters && filters.hyperspeed}
            options={hyperSpeedOptions}
            open={openDropDown === DropDownFilters.hyperspeed}
            onOpen={() => setOpenDropDown(DropDownFilters.hyperspeed)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("hyperspeed")}
          />
          <FilterIcon
            Icon={FlagIcon}
            name={"Ability:"}
            active={filters && filters.ability}
            options={abilityOptions}
            open={openDropDown === DropDownFilters.ability}
            onOpen={() => setOpenDropDown(DropDownFilters.ability)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("ability")}
          />
          <FilterIcon
            Icon={FlagIcon}
            name={"Armor:"}
            active={filters && filters.armor}
            options={armorOptions}
            open={openDropDown === DropDownFilters.armor}
            onOpen={() => setOpenDropDown(DropDownFilters.armor)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("armor")}
          />
          <FilterIcon
            Icon={FlagIcon}
            name={"Landspeed:"}
            active={filters && filters.landspeed}
            options={landspeedOptions}
            open={openDropDown === DropDownFilters.landspeed}
            onOpen={() => setOpenDropDown(DropDownFilters.landspeed)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("landspeed")}
          />
          <FilterIcon
            Icon={FlagIcon}
            name={"Maneuver:"}
            active={filters && filters.maneuver}
            options={maneuverOptions}
            open={openDropDown === DropDownFilters.maneuver}
            onOpen={() => setOpenDropDown(DropDownFilters.maneuver)}
            onClose={() => setOpenDropDown(undefined)}
            onOptionChosen={optionChosen("maneuver")}
          />

        </div>
      ) : null}
    </CardFilterBarContainer>
  );
}
