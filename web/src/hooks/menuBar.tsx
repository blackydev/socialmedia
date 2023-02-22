import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Box, Toolbar, Typography, IconButton } from "@mui/material";
import auth from "../service/auth";
import UserContext from "../context/user";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const MenuBar = () => {
  const user = React.useContext(UserContext);
  if (!user) return <></>;

  const handleLogOut = () => {
    auth.logout();
    window.location.reload();
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar />
      </AppBar>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" flexGrow={1}>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                color: "white",
                marginRight: "20px",
              }}>
              Home
            </Link>
            <Link
              to="/followed"
              style={{ textDecoration: "none", color: "white" }}>
              Followed
            </Link>
          </Typography>
          <div>
            <Link to="/account">
              <IconButton aria-label="edit user" size="large">
                <SettingsIcon />
              </IconButton>
            </Link>

            <Link to={"/users/" + user?._id}>
              <IconButton aria-label="current user profile" size="large">
                <AccountCircleIcon />
              </IconButton>
            </Link>

            <IconButton
              aria-label="log out"
              size="large"
              onClick={handleLogOut}>
              <LogoutIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MenuBar;
