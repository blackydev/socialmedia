import { Card, CardHeader, CardContent, Skeleton } from "@mui/material";

const CardSkeleton = () => {
  return (
    <Card>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        subheader={<Skeleton width={80} />}
      />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}>
        <Skeleton
          variant="rounded"
          width={"100%"}
          height={250}
          sx={{ mb: 1 }}
        />
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
