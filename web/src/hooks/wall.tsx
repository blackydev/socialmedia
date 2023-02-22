import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, LinearProgress } from "@mui/material";
import authService from "../service/auth";
import postService from "../service/posts";
import Post from "./post";
import { ObjectId } from "../service/types/objectId";
import PostForm from "./forms/createPost";
import { AxiosResponse } from "axios";

export const loader = async () => {
  const user = authService.getUser();
  if (!user) return redirect("/login");
  return null;
};

type IProps = {
  posts: ObjectId[];
  home?: boolean;
  followed?: boolean;
};

const Wall = ({ home = true, followed = false, posts: extraPosts }: IProps) => {
  const [posts, setPosts] = useState<string[]>([] as string[]); // posts
  const [page, setPage] = useState(1); // post page
  const [hasMore, setHasMore] = useState(true); // has more posts?

  let getWall: (page?: number) => Promise<AxiosResponse<string[], any>>;
  if (followed) getWall = postService.getFollowedWall;
  if (!followed) getWall = postService.getWall;

  useEffect(() => {
    const asyncEff = async () => {
      if (home) {
        const { data } = await getWall(0);
        setPosts(data);
        if (Array.isArray(data) && !data.length) return setHasMore(false);
      }
    };
    asyncEff();
  }, [posts.length !== 0]);

  const getMorePosts = async () => {
    const { data } = await getWall(page);
    if (Array.isArray(data) && !data.length) return setHasMore(false); // if we do not have more posts
    setPosts([...posts, ...data]);
    setPage(page + 1);
  };

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={
          (posts.length !== 0 && (
            <Box textAlign="center" sx={{ my: 5 }}>
              Loading...
              <LinearProgress color="primary" sx={{ mt: 1 }} />
            </Box>
          )) || <>No posts.</>
        }>
        {extraPosts.concat(posts).map((postId) => (
          <Box sx={{ mb: 2 }} key={postId}>
            <Post id={postId} />
          </Box>
        ))}
      </InfiniteScroll>
    </>
  );
};

export default Wall;
