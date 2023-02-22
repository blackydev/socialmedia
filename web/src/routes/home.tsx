import { redirect } from "react-router-dom";
import authService from "../service/auth";
import { Box, Container, Grid } from "@mui/material";
import PostForm from "../hooks/forms/createPost";
import { useState } from "react";
import Wall from "../hooks/wall";

export const loader = async () => {
  const user = authService.getUser();
  if (!user) return redirect("/login");
  return null;
};

const Home = () => {
  const [newPosts, setNewPosts] = useState<string[]>([] as string[]);

  const pushToWall = (postId: string) => setNewPosts([postId, ...newPosts]);

  return (
    <Container maxWidth="sm">
      <Box mb={3}>
        <PostForm callback={pushToWall} />
      </Box>
      <Wall posts={newPosts} />
    </Container>
  );
};

export default Home;
