import { createBrowserRouter } from "react-router-dom";
import Home, { loader as homeLoader } from "./routes/home";
import Layout from "./routes/layout";
import Account from "./routes/account";
import { signLoader } from "./routes/sign";
import SignupForm from "./hooks/forms/account/signup";
import LoginForm from "./hooks/forms/account/login";
import Profile from "./routes/profile";
import FollowedList from "./routes/followedList";
import Followed from "./routes/followed";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: homeLoader,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/followed",
        element: <Followed />,
      },
      {
        path: "/account/",
        element: <Account />,
      },
      {
        path: "/users/:id",
        element: <Profile />,
      },
      {
        path: "/followed-list",
        element: <FollowedList />,
      },
    ],
  },
  {
    path: "/sign-up",
    element: <SignupForm />,
    loader: signLoader,
  },
  {
    path: "/login",
    element: <LoginForm />,
    loader: signLoader,
  },
]);

export default router;
