import React from "react";
import {
  Card,
  Typography,
  CardContent,
  IconButton,
  Stack,
  Box,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CardImages from "./cardImages";
import PostContext from "../../context/post";
import PostHeader from "./cardHeader";

type IState = {
  onLike(): unknown;
  openDeleteModal(): unknown;
  openCommentModal(): unknown;
  getComments(): unknown;
};

const showLikes = (likes: number) => {
  const digitsCount = likes.toString().length;
  if (digitsCount < 4) return likes;

  if (digitsCount < 7) return Math.floor(likes / 1_000).toString() + "k";
  if (digitsCount < 10) return Math.floor(likes / 1_000_000).toString() + "mln";
};

const PostCard = ({
  onLike,
  openCommentModal,
  openDeleteModal,
  getComments,
}: IState) => {
  const post = React.useContext(PostContext);
  if (!post) return <></>;
  const [commentsGained, setCommentsGain] = React.useState<boolean>(false);

  return (
    <Card sx={{ maxWidth: "600px" }}>
      <PostHeader author={post.author} openDeleteModal={openDeleteModal} />

      <CardContent>
        <Typography variant="body2" sx={{ overflowWrap: "break-word" }}>
          {post.content}
        </Typography>
      </CardContent>
      <CardImages postId={post._id} imagesCount={post.mediaCount} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          pb: 1,
          px: 1,
        }}>
        <Stack direction="row" alignItems="end" spacing={1}>
          <IconButton color="primary" onClick={onLike}>
            {post.liked === true && <ThumbUpIcon aria-label="like" />}
            {post.liked === false && (
              <ThumbUpOffAltIcon aria-label="not liked" />
            )}
          </IconButton>

          <IconButton color="primary" onClick={openCommentModal}>
            <AddCommentIcon aria-label="add post" />
          </IconButton>
        </Stack>

        <Stack direction="row" alignItems="end" spacing={1}>
          {!commentsGained && !post.noComments && getComments && (
            <Typography
              variant="caption"
              sx={{ mr: 1, pb: 1, cursor: "pointer" }}
              onClick={() => {
                getComments();
                setCommentsGain(true);
              }}>
              open comments
            </Typography>
          )}
          <Typography variant="caption" sx={{ mr: 1, pb: 1 }}>
            {showLikes(post.likesCount)} likes{" "}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
};

export default PostCard;
