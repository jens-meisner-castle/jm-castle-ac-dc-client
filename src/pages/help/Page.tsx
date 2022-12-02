import { Grid, Typography } from "@mui/material";
import { ApiServices } from "./parts/ApiServices";
import { DeviceInstall } from "./parts/DeviceInstall";
import { DeviceTypes } from "./parts/DeviceTypes";
import { MathJsPlayground } from "./parts/MathJsPlayground";

export const Page = () => {
  return (
    <Grid container direction="column" gap={2}>
      <Grid item>
        <Typography variant="h5">{"Help"}</Typography>
      </Grid>
      <Grid item>
        <DeviceTypes />
      </Grid>
      <Grid item>
        <ApiServices />
      </Grid>
      <Grid item>
        <MathJsPlayground initialCode="1+1" />
      </Grid>
      <Grid item>
        <DeviceInstall />
      </Grid>
    </Grid>
  );
};
