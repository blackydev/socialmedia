import { redirect, useParams } from "react-router-dom";
import { Container, Grid, Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import Wall from "../hooks/wall";
import userService from "../service/users";
import UserCard from "../hooks/userCard";
import UserContext from "../context/user";
import PostForm from "../hooks/forms/createPost";

type IUser = {
  _id: string;
  name: string;
  followedCount: number;
  followersCount: number;
};

const Profile = () => {
  const { id } = useParams();
  const theme = useTheme();

  const me = useContext(UserContext);
  const [posts, setPosts] = useState<string[]>([] as string[]);
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const asyncEff = async () => {
      try {
        const { data } = await userService.getPosts(id as string);
        setPosts(data);

        const { data: user } = await userService.get(id as string);
        setUser(user);
      } catch (ex) {
        return redirect("/");
      }
    };
    asyncEff();
  }, [posts.length, id]);

  const pushToWall = (postId: string) => setPosts([postId, ...posts]);

  return (
    <Container key={id}>
      <Grid container sx={{ mt: 2 }} spacing={5}>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}>
          {user && (
            <Box
              sx={{
                [theme.breakpoints.up("lg")]: {
                  position: "fixed",
                },
              }}>
              <UserCard user={user} profileLink={false} />
            </Box>
          )}
        </Grid>

        <Grid item lg={8} mx="auto">
          {id === me?._id && (
            <Box mb={1} sx={{ minWidth: "450px" }}>
              <PostForm callback={pushToWall} />
            </Box>
          )}
          <Wall home={false} posts={posts} />
        </Grid>
        <Grid lg={3} />
      </Grid>
    </Container>
  );
};

export default Profile;
