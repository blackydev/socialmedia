import UserAvatar from "./utils/userAvatar";
import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import userService from "../service/users";
import UserContext from "../context/user";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { FullUser } from "../service/types/users";

type IProps = {
  user: FullUser;
  profileLink?: boolean;
};

const UserCard = ({ user, profileLink = true }: IProps) => {
  const [isFollowed, setIsFollowed] = useState<boolean>();
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const me = useContext(UserContext);

  useEffect(() => {
    const asyncEff = async () => {
      const { data } = await userService.isFollowed(user._id);
      setIsFollowed(data);
    };
    asyncEff();
  }, [isFollowed !== undefined]);

  const handleFollow = async () => {
    try {
      await userService.follow(user._id);
    } catch (ex) {
      console.log(ex);
    }
    setIsFollowed(true);
    setFollowersCount(followersCount + 1);
  };

  const handleUnfollow = async () => {
    await userService.unfollow(user._id);
    setIsFollowed(false);
    setFollowersCount(followersCount - 1);
  };

  return (
    <Box
      sx={{
        bgcolor: "secondary.main",
        px: 5,
        py: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <Avatar
        alt={user.name}
        src={userService.getAvatarURL(user._id)}
        sx={{ width: "48px", height: "48px", fontSize: "24px" }}
      />
      <Typography variant="h6" sx={{ pt: 1 }}>
        {user.name}
      </Typography>
      <Box sx={{ display: "flex", mt: 1, mb: 2 }}>
        {user.followersCount !== -1 && (
          <Typography sx={{ mr: 1 }}>Followers: {followersCount}</Typography>
        )}

        {user.followedCount !== -1 && user._id === me?._id && (
          <Link to="/followed-list">
            <Typography sx={{ ml: 1 }}>
              Followed: {user.followedCount}
            </Typography>
          </Link>
        )}

        {user.followedCount !== -1 && user._id !== me?._id && (
          <Typography sx={{ ml: 1 }}>Followed: {user.followedCount}</Typography>
        )}
      </Box>
      <Box>
        {isFollowed === false && user._id !== me?._id && (
          <Button size="medium" variant="contained" onClick={handleFollow}>
            FOLLOW
          </Button>
        )}

        {isFollowed === true && user._id !== me?._id && (
          <Button size="medium" variant="text" onClick={handleUnfollow}>
            UNFOLLOW
          </Button>
        )}
      </Box>
      {profileLink && (
        <Link to={"/users/" + user._id}>
          <Button size="small" color="primary" variant="text">
            Show Profile
          </Button>
        </Link>
      )}

      <Link to="/followed-list" color="grey">
        <Typography variant="caption">Who I Follow?</Typography>
      </Link>
    </Box>
  );
};

export default UserCard;
