import { useParams, useNavigate } from "react-router-dom";
import { Grid, Container, Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import userService from "../service/users";
import UserContext from "../context/user";
import UserCard from "../hooks/userCard";

type IUser = {
  _id: string;
  name: string;
};

const FollowedList = () => {
  const [list, setList] = useState<IUser[]>([]);
  const currentUser = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const asyncEff = async () => {
      if (!currentUser) return navigate("/");
      try {
        const { data } = await userService.getFollowedList(
          currentUser._id as string,
        );
        setList(data);
      } catch (ex) {
        return navigate("/");
      }
    };
    asyncEff();
  }, [list.length]);

  return (
    <Container sx={{ mt: 6 }}>
      <Grid spacing={2} container>
        {list.length === 0 && (
          <Typography variant="h4">You do not follow any users.</Typography>
        )}
        {list.map((user) => {
          return (
            <Grid item xs={12} md={4} lg={3} key={user._id}>
              <UserCard
                user={{ ...user, followersCount: -1, followedCount: -1 }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default FollowedList;
