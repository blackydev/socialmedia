import * as Yup from "yup";
import React from "react";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { TextField, Paper, IconButton, Box, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import postService from "../../service/posts";
import UserAvatar from "../utils/userAvatar";
import UserContext from "../../context/user";
import { ObjectId } from "../../service/types/objectId";

const validationSchema = Yup.object().shape({
  content: Yup.string().min(2).max(1000).required(),
});

const PostForm = ({
  parent,
  callback,
}: {
  parent?: ObjectId;
  callback?(postId: string): unknown;
}) => {
  const formik = useFormik<{ content: string; files: File[] }>({
    initialValues: { content: "", files: [] },
    validationSchema: validationSchema,
    onSubmit: async ({ content, files }) => {
      try {
        const { data: postId } = await postService.createOne({
          content,
          parent,
          media: files,
        });

        if (callback) callback(postId);
        formik.resetForm();
      } catch (ex) {
        const error = ex as AxiosError;
        if (error.response?.status === 400)
          formik.errors.content = error.response.data as string;
      }
    },
  });

  const user = React.useContext(UserContext);
  if (!user) return <></>;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("files", e.currentTarget.files);
  };

  const clearFiles = () => formik.setFieldValue("files", []);

  return (
    <Paper
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ maxWidth: "600px" }}>
      <Box sx={{ display: "flex", px: 2, pt: 2 }}>
        <Link to={"/users/" + user?._id}>
          <Box sx={{ width: 32, height: 32, fontSize: "1rem", mr: 2 }}>
            {user && <UserAvatar id={user._id} name={user.name} />}
          </Box>
        </Link>
        <Box sx={{ display: "block", width: "100%" }}>
          <TextField
            name="content"
            variant="standard"
            InputLabelProps={{
              shrink: true,
            }}
            maxRows="2"
            multiline
            fullWidth
            value={formik.values.content}
            onChange={formik.handleChange}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
          />
          <Box sx={{ my: 1 }}>
            <Typography
              variant="caption"
              component="label"
              sx={{ cursor: "pointer" }}>
              {formik.values.files.length === 0 && <>attach images</>}
              {formik.values.files.length !== 0 && (
                <>{formik.values.files.length} files images</>
              )}

              <input
                type="file"
                hidden
                multiple
                onChange={handleFilesChange}
                accept="image/webp,image/png,image/jpeg"
              />
            </Typography>
            {formik.values.files.length !== 0 && (
              <IconButton onClick={clearFiles}>
                <ClearIcon sx={{ fontSize: "0.9rem" }} />
              </IconButton>
            )}
          </Box>
        </Box>
        <Box>
          <IconButton component="button" type="submit" sx={{ ml: 1 }}>
            <SendIcon sx={{ color: "primary.main" }} />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default PostForm;
