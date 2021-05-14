import ClickAwayListener from "react-click-away-listener";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Checkbox from "@material-ui/core/Checkbox";
import { DEFAULT_OPTION, lightOrange } from "./card-filters-bar";
import styled from "styled-components";
import { darkBlue } from "../../utils/colors";

const FilterName = styled.div<{ isFiltered: boolean }>`
  margin-left: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => (props.isFiltered ? lightOrange : "white")};
`;

const FilterOptionsContainer = styled.div`
  position: absolute;
  background-color: ${darkBlue};
  color: white;
  max-height: 400px;
  overflow-y: scroll;
  top: 37px;
  left: 0px;
  padding: 10px;
  font-size: 14px;
  width: 200px;
  border: 1px solid black;
`;

const ClickableFilterIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
`;

const FilterIconContainer = styled.div<{ isFiltered: boolean }>`
  z-index: 10;
  position: relative;
  border-radius: 50px;
  border: 1px solid ${(props) => (props.isFiltered ? lightOrange : "#6f6f6f")};
  display: flex;
  align-items: center;
  padding: 2px 0px;
  padding-right: 10px;
  justify-content: center;
  margin-right: 10px;
`;

export function FilterIcon({
  open,
  Icon,
  name,
  options,
  active,
  onOptionChosen,
  onOpen,
  onClose,
  formatName,
}: {
  open: boolean;
  name: string;
  active?: string | string[];
  Icon: any;
  options?: string[];
  onOpen: () => void;
  onClose: () => void;
  onOptionChosen: (option: string) => void;
  formatName?: (option: string) => string;
}) {
  const isChecked = (option) => {
    if (option === DEFAULT_OPTION && active === undefined) {
      return true;
    }
    return Array.isArray(active) ? active.includes(option) : active === option;
  };
  const isFiltered = !Boolean(
    active === DEFAULT_OPTION || active === undefined
  );
  return (
    <FilterIconContainer isFiltered={isFiltered}>
      <ClickableFilterIcon onClick={() => (!open ? onOpen() : onClose())}>
        <Icon
          style={{
            fontSize: "30px",
            marginRight: "5px",
            borderRadius: "100px",
            border: `1px solid ${isFiltered ? lightOrange : "white"}`,
            padding: "5px",
            color: isFiltered ? lightOrange : "white",
          }}
        ></Icon>
        <FilterName isFiltered={isFiltered}>
          {name}&nbsp;
          {isFiltered ? "Filtered" : DEFAULT_OPTION}
        </FilterName>

        <ExpandMoreIcon
          style={{
            color: isFiltered ? lightOrange : "white",
            marginLeft: "5px",
            fontSize: "16px",
          }}
        />
      </ClickableFilterIcon>
      {open ? (
        <ClickAwayListener onClickAway={() => onClose()}>
          <FilterOptionsContainer>
            {[DEFAULT_OPTION, ...(options || [])].map((option, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  cursor: "pointer",
                  alignItems: "center",
                }}
                onClick={() => onOptionChosen(option)}
              >
                <Checkbox
                  style={{ color: "white" }}
                  checked={isChecked(option)}
                />
                <div>{formatName ? formatName(option) : option}</div>
              </div>
            ))}
          </FilterOptionsContainer>
        </ClickAwayListener>
      ) : null}
    </FilterIconContainer>
  );
}
