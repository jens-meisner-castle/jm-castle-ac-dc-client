import { Grid, Typography } from "@mui/material";
import { LocalDatapoint, UniqueDatapoint } from "jm-castle-ac-dc-types/build";

export interface DatapointComponentProps {
  datapoint: UniqueDatapoint | LocalDatapoint;
  leftColumnWidth?: number;
}

export const DatapointComponent = (props: DatapointComponentProps) => {
  const { datapoint, leftColumnWidth } = props;
  const { id, name, valueUnit, valueType, localId } = datapoint;
  const usedLeftColumnWidth = leftColumnWidth || 200;

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: usedLeftColumnWidth }}>
            <Typography>
              {id ? "Datapoint (id)" : "Datapoint (local-id)"}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>{id || localId}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: usedLeftColumnWidth }}>
            <Typography>{"Name"}</Typography>
          </Grid>
          <Grid item>
            <Typography>{name}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: usedLeftColumnWidth }}>
            <Typography>{"Datentyp"}</Typography>
          </Grid>
          <Grid item>
            <Typography component="span">{valueType}</Typography>
            {valueUnit && (
              <Typography component="span">{` (${valueUnit})`}</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
