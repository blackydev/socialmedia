import http from "./http";
import joinURL from "url-join";
import { ObjectId } from "./types/objectId";
import { FullUser, Token } from "./types/users";
const endpoint = "users/";

const signup = (data: { email: string; name: string; password: string }) =>
  http.post<Token>(endpoint, data);

const get = (userId: ObjectId) => http.get<FullUser>(joinURL(endpoint, userId));

const isFollowed = (userId: ObjectId) =>
  http.get<boolean>(joinURL(endpoint, userId, "isFollowed"));

const getPosts = (userId: ObjectId) =>
  http.get<ObjectId[]>(joinURL(endpoint, userId, "/posts"));

const change = (
  userId: ObjectId,
  data: {
    email: string;
    name: string;
  },
) => http.patch<Token>(joinURL(endpoint, userId), data); // returns token if request is correct

const changePassword = (userId: ObjectId, newPassword: string) =>
  http.patch<undefined>(joinURL(endpoint, userId, "/password"), {
    password: newPassword,
  });

const changeAvatar = (userId: ObjectId, file: File) => {
  const data = new FormData();
  data.append("avatar", file);
  return http.patch<undefined>(joinURL(endpoint, userId, "/avatar"), data);
};

const deleteAvatar = (userId: string) =>
  http.delete<undefined>(joinURL(endpoint, userId, "/avatar"));

const follow = (userId: string) =>
  http.patch<undefined>(joinURL(endpoint, userId, "follow"));

const unfollow = (userId: string) =>
  http.patch<undefined>(joinURL(endpoint, userId, "unfollow"));

const getAvatarURL = (userId: string) => {
  return joinURL(http.apiEndpoint, endpoint, userId, "/avatar");
};

const getFollowedList = (userId: string) => {
  return http.get<{ _id: string; name: string }[]>(
    joinURL(endpoint, userId, "followed"),
  );
};

const userService = {
  signup,

  get,
  getPosts,
  getAvatarURL,
  getFollowedList,
  isFollowed,

  change,
  changePassword,
  changeAvatar,
  deleteAvatar,

  follow,
  unfollow,
};

export default userService;
