import React from "react";
import { useRef } from "react";
import postService from "../service/posts";
import { Box, Button } from "@mui/material";
import PostCard from "./post/card";
import CardSkeleton from "./post/cardSkeleton";
import PostContext from "../context/post";
import ConfirmDelete from "./post/confirmDelete";
import PostForm from "./forms/createPost";
import { Post } from "../service/types/posts";

const Post = ({
  id: postId,
  nestingLevel = 0,
}: {
  id: string;
  nestingLevel?: number;
}) => {
  const [post, setPost] = React.useState<Post>();

  const [allComments, setAllComments] = React.useState<string[]>(); // ALL COMMENTS ID'S
  const [displayedComments, setDisplayedComments] = React.useState<string[]>(
    [],
  );

  const [isDeletionModalOpen, setDeletionModalOpen] = React.useState(false);
  const [areCommentsDisplayed, setCommentsDisplay] = React.useState(false);

  const [isDeleted, setDeleted] = React.useState(false);
  const ref = useRef(null) as any;
  React.useEffect(() => {
    const postLazyLoading = async () => {
      const { top, bottom } = ref.current?.getBoundingClientRect();
      const isInView = top < window.innerHeight && bottom >= 0;
      if (isInView) {
        const { data } = await postService.getOne(postId);
        setPost(data);
        clearInterval(myInterval);
      }
    };

    const myInterval = setInterval(postLazyLoading, 200);
    postLazyLoading();
  }, [postId]);

  if (isDeleted) return null; // if user delete a post we hide it
  if (!post)
    return (
      <Box ref={ref}>
        <CardSkeleton />
      </Box>
    ); // if post is unloaded

  const handleLike = async () => {
    let updated = { ...post };
    if (post.liked === false) {
      await postService.like(post._id);
      updated.liked = true;
      updated.likesCount++;
    } else {
      await postService.unlike(post._id);
      updated.liked = false;
      updated.likesCount--;
    }
    setPost(updated);
  };

  const getAllComments = async () => {
    const { data: allComments } = await postService.getComments(post._id);
    setAllComments(allComments);
    setDisplayedComments([...displayedComments, ...allComments?.slice(0, 2)]);
  };

  const getMoreComments = async () => {
    if (allComments && allComments.length > displayedComments.length) {
      const tmp = displayedComments.concat(
        allComments.slice(
          displayedComments.length,
          displayedComments.length + 2,
        ),
      );

      setDisplayedComments(tmp);
    }
  };

  const pushToWall = async (postId: string) => {
    setDisplayedComments([postId, ...displayedComments]);
  };

  return (
    <PostContext.Provider value={post}>
      <Box
        ml={nestingLevel * 3 + "px"}
        borderLeft={nestingLevel ? "white 2px solid" : ""}>
        <Box mb="3px">
          <PostCard
            onLike={handleLike}
            openCommentModal={() => setCommentsDisplay(!areCommentsDisplayed)}
            openDeleteModal={() => setDeletionModalOpen(true)}
            getComments={getAllComments}
          />
        </Box>

        {areCommentsDisplayed && (
          <Box mb="3px">
            <PostForm parent={post._id} callback={pushToWall} />
          </Box>
        )}
        {displayedComments.map((commentId) => (
          <Post
            key={commentId}
            id={commentId}
            nestingLevel={nestingLevel + 1}
          />
        ))}
      </Box>

      {!post.noComments &&
        Array.isArray(allComments) &&
        allComments.length > displayedComments.length && (
          <Button onClick={getMoreComments} size="small">
            Get More Comments
          </Button>
        )}

      <ConfirmDelete
        isOpen={isDeletionModalOpen}
        afterDelete={() => setDeleted(true)}
        onClose={() => setDeletionModalOpen(false)}
      />
    </PostContext.Provider>
  );
};

export default Post;
