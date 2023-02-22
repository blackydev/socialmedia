import { Box, Button, Modal, Typography } from "@mui/material";
import postService from "../../service/posts";
import PostContext from "../../context/post";
import React from "react";

type IProps = {
  isOpen: boolean;
  afterDelete(): unknown;
  onClose(): unknown;
};

const ConfirmDelete = ({ afterDelete, isOpen, onClose }: IProps) => {
  const post = React.useContext(PostContext);
  if (!post) return <></>;
  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="confirm delete">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}>
        <Typography variant="h6" component="h2">
          Are you sure you want to delete the post?
        </Typography>
        <Typography sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              await postService.delete(post._id);
              afterDelete();
            }}>
            DELETE
          </Button>
        </Typography>
      </Box>
    </Modal>
  );
};

export default ConfirmDelete;
