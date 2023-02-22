import { Outlet } from "react-router-dom";
import MenuBar from "../hooks/menuBar";
import UserContext from "../context/user";
import auth from "../service/auth";
import { Container } from "@mui/material";

const Layout = () => {
  return (
    <UserContext.Provider value={auth.getUser()}>
      <MenuBar />
      <Outlet />
    </UserContext.Provider>
  );
};

export default Layout;
