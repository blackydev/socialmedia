import React from "react";
import { Link } from "react-router-dom";
import { Box, CardHeader, IconButton, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import dayjs from "dayjs";
import UserContext from "../../context/user";
import UserAvatar from "../utils/userAvatar";
import PostContext from "../../context/post";

type IState = {
  author: {
    _id: string;
    name: string;
  };
  openDeleteModal?(): unknown;
};

const showDate = (date: string) => {
  const time = dayjs(date);

  const sameYear = time.year() === dayjs().year();
  const today =
    time.date() === dayjs().date() &&
    time.month() === dayjs().month() &&
    sameYear;

  if (today) return time.format("H:mm");
  if (sameYear) return time.format("D MMMM");
  else return time.format("D MMMM YYYY");
};

const PostHeader = ({ author, openDeleteModal }: IState) => {
  const currentUser = React.useContext(UserContext);
  const post = React.useContext(PostContext);
  if (!post || !post.author?.name) return <></>;

  return (
    <CardHeader
      avatar={
        <Link to={"/users/" + author._id}>
          <UserAvatar id={author._id} name={author.name} />
        </Link>
      }
      action={
        openDeleteModal &&
        currentUser?._id === author._id && (
          <IconButton
            sx={{ color: "text.secondary" }}
            size="small"
            aria-label="open delete confirm form"
            onClick={openDeleteModal}>
            <DeleteForeverIcon />
          </IconButton>
        )
      }
      title={
        <Typography variant="subtitle2">
          <Link to={"/users/" + author._id}>{author.name}</Link>
        </Typography>
      }
      subheader={
        <Box sx={{ transform: "translateY(-4px)" }}>
          <Typography variant="caption" color="gray">
            <Link to={"/users/" + author._id}>{showDate(post.createdAt)}</Link>
          </Typography>
        </Box>
      }
      sx={{ pb: 0 }}
    />
  );
};
export default PostHeader;
