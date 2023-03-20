import { Grid, Typography } from "@mui/material";
import { ApiServices } from "./parts/ApiServices";
import { DeviceInstall } from "./parts/DeviceInstall";
import { DeviceTypes } from "./parts/DeviceTypes";
import { MathJsPlayground } from "./parts/MathJsPlayground";

export const Page = () => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5">{"Help"}</Typography>
      </Grid>
      <Grid item>
        <div style={{ marginTop: 5 }}>
          <DeviceTypes />
        </div>
      </Grid>
      <Grid item>
        <div style={{ marginTop: 5 }}>
          <ApiServices />
        </div>
      </Grid>
      <Grid item>
        <div style={{ marginTop: 5 }}>
          <MathJsPlayground initialCode="1+1" />
        </div>
      </Grid>
      <Grid item>
        <div style={{ marginTop: 5 }}>
          <DeviceInstall />
        </div>
      </Grid>
    </Grid>
  );
};
