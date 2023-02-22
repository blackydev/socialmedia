import { Avatar, Icon } from "@mui/material";
import userService from "../../service/users";
import { ObjectId } from "../../service/types/objectId";

const UserAvatar = ({ id, name }: { id: ObjectId; name: string }) => (
  <Avatar alt={name} src={userService.getAvatarURL(id)} />
);
export default UserAvatar;
