import { Modal, IconButton, Box } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Fragment, useState } from "react";
import postService from "../../service/posts";

type IProps = {
  postId: string;
  imagesCount: number;
};

const CardImages = ({ postId, imagesCount }: IProps) => {
  if (imagesCount === 0) return null;
  let cols = 2;
  if (imagesCount === 1) cols = 1;

  const numbers: number[] = [];
  for (let i = 0; i < imagesCount; i++) numbers.push(i);

  let i = 0;
  return (
    <>
      <ImageList cols={cols} gap={2} sx={{ my: 1 }}>
        {numbers.map((n) => {
          const [open, setOpen] = useState(false);
          const handleOpen = () => setOpen(true);
          const handleClose = () => setOpen(false);
          let size = 1;
          if (imagesCount === 3 && i++ === 0) size = 2;

          return (
            <Fragment key={n}>
              <ImageListItem
                onClick={handleOpen}
                sx={{ cursor: "pointer" }}
                cols={size}>
                <img
                  src={postService.getMinifiedImage(postId, n)}
                  alt="posts' image"
                  loading="lazy"
                />
              </ImageListItem>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Box sx={{ position: "relative" }}>
                  <img
                    src={postService.getImage(postId, n)}
                    alt="posts' image"
                    loading="lazy"
                    style={{ maxWidth: "100%" }}
                  />
                  <IconButton
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 0, top: 0 }}>
                    <ClearIcon />
                  </IconButton>
                </Box>
              </Modal>
            </Fragment>
          );
        })}
      </ImageList>
    </>
  );
};

export default CardImages;
