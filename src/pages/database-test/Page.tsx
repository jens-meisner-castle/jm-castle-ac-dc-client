import { Grid, Paper, Typography } from "@mui/material";
import { SelectFromDatapointControlLog } from "../../tests/database/SelectFromDatapointControlLog";
import { SelectFromDatapointLog } from "../../tests/database/SelectFromDatapointLog";

export const Page = () => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5">{"Some tests"}</Typography>
      </Grid>
      <Grid item>
        <Paper>
          <SelectFromDatapointLog />
        </Paper>
      </Grid>
      <Grid item>
        <Paper>
          <SelectFromDatapointControlLog />
        </Paper>
      </Grid>
    </Grid>
  );
};
