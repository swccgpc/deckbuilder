import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { SearchBar } from "../components/SearchBar";
import {
  ThemeProvider,
  createMuiTheme,
  ClickAwayListener,
  MenuItem,
} from "@material-ui/core";
import { grey, blueGrey } from "@material-ui/core/colors";
import { getToken, removeToken } from "../utils/frontend-auth";
import PersonIcon from "@material-ui/icons/Person";

const contentWidth = 960;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ecf0f1;
  min-height: 100vh;
`;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[500],
      contrastText: "white",
    },
    secondary: {
      main: blueGrey[500],
    },
  },
});

export const Page = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <PageContainer>{children}</PageContainer>
    </ThemeProvider>
  );
};

const ToolbarContainer = styled.div`
  background-color: #222;
  height: 80px;
  color: #ccc;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const ToolbarContent = styled.div`
  display: flex;
  width: ${contentWidth}px;
  align-items: center;
`;

const ToolbarLink = styled.a`
  margin-right: 25px;
  color: #ccc;
  text-decoration: none;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 80px);
`;

export function Content({ children }) {
  return (
    <ContentContainer>
      <div style={{ width: contentWidth + "px" }}>{children}</div>
    </ContentContainer>
  );
}

export function Toolbar() {
  const [showAvatarMenu, setAvatarMenu] = useState(false);
  return (
    <ToolbarContainer>
      <ToolbarContent>
        <Link href="/" passHref>
          <ToolbarLink>
            {" "}
            <img style={{width:"75px", height: "50px"}}
                 src="https://res.starwarsccg.org/swccgpc_deckdb2.svg"
                 onError={(e)=>{(e.target as any).onerror = null; (e.target as any).src="https://res.starwarsccg.org/swccgpc_deckdb2.png"}} />
          </ToolbarLink>
        </Link>
        <Link href="/my-decks" passHref>
          <ToolbarLink style={{ fontSize: "14px" }}>My decks</ToolbarLink>
        </Link>
        <Link href="/decklists" passHref>
          <ToolbarLink style={{ fontSize: "14px" }}>Decklists</ToolbarLink>
        </Link>
        <Link href="/cards" passHref>
          <ToolbarLink style={{ fontSize: "14px" }}>Cards</ToolbarLink>
        </Link>
        <div style={{ flexGrow: 1 }}></div>
        <SearchBar></SearchBar>
        {getToken() ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <PersonIcon
              style={{
                color: "white",
                fontSize: "22px",
                marginLeft: "5px",
                cursor: "pointer",
              }}
              onClick={() => setAvatarMenu(true)}
            />
            {showAvatarMenu ? (
              <ClickAwayListener onClickAway={() => setAvatarMenu(false)}>
                <div
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    bottom: "-50px",
                    right: "0px",
                    color: "black",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      removeToken();
                      setAvatarMenu(false);
                    }}
                  >
                    Logout
                  </MenuItem>
                </div>
              </ClickAwayListener>
            ) : null}
          </div>
        ) : null}
      </ToolbarContent>
    </ToolbarContainer>
  );
}
