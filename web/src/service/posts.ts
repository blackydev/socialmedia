import joinURL from "url-join";
import http from "./http";
const endpoint = "posts/";
import { Post } from "./types/posts";
import { ObjectId } from "./types/objectId";

const getWall = (page?: number) =>
  http.get<ObjectId[]>(endpoint, { params: { page } });

const getFollowedWall = (page?: number) =>
  http.get<ObjectId[]>(joinURL(endpoint, "followed"), { params: { page } });

const getOne = (postId: ObjectId) => http.get<Post>(joinURL(endpoint, postId));

const getComments = (postId: ObjectId) =>
  http.get<ObjectId[]>(joinURL(endpoint, postId, "/comments"));

const createOne = (data: {
  content: string;
  parent?: ObjectId;
  media?: File[];
}) => {
  const formData = new FormData();
  formData.append("content", data.content);
  if (data.parent) formData.append("parent", data.parent);
  if (data.media)
    for (const file of data.media) formData.append("images", file);

  return http.post<ObjectId>(endpoint, formData);
};

const getImageURL = (postId: ObjectId, index: number) =>
  joinURL(http.apiEndpoint, endpoint, postId, "/media", index.toString());

const getMinifiedImageURL = (postId: ObjectId, index: number) =>
  joinURL(http.apiEndpoint, endpoint, postId, "/minMedia", index.toString());

const like = (postId: ObjectId) =>
  http.patch<undefined>(joinURL(endpoint, postId, "like"));

const unlike = (postId: ObjectId) =>
  http.patch<undefined>(joinURL(endpoint, postId, "unlike"));

const deleteOne = (postId: ObjectId) =>
  http.delete<undefined>(joinURL(endpoint, postId));

const postService = {
  getWall,
  getFollowedWall,
  getOne,
  getComments,
  createOne,
  like,
  unlike,
  getImage: getImageURL,
  getMinifiedImage: getMinifiedImageURL,
  delete: deleteOne,
};

export default postService;
