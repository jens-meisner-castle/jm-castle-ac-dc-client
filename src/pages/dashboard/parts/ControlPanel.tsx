import { Grid, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { EngineActionControl } from "../../../components/EngineActionControl";
import { backendApiUrl } from "../../../configuration/Urls";
import { useEngines } from "../../../hooks/useEngines";

export const ControlPanel = () => {
  const { engines, error } = useEngines(backendApiUrl);
  const enginesWithActions = useMemo(
    () => engines?.filter((engine) => Object.keys(engine.actions).length > 0),
    [engines]
  );
  return (
    <Grid container direction="column">
      <Grid item>
        <Paper
          style={{
            padding: 5,
            margin: 5,
            marginTop: 0,
            marginLeft: 0,
          }}
        >
          <Typography>{"Steuerung"}</Typography>
        </Paper>
      </Grid>
      {error && (
        <Grid item>
          <Typography>
            {"Received error when using engines: " + error}
          </Typography>
        </Grid>
      )}
      {enginesWithActions &&
        enginesWithActions.map((engine) => (
          <Grid key={engine.key} item>
            <Paper
              style={{
                padding: 5,
                margin: 5,
                marginTop: 0,
                marginLeft: 0,
              }}
            >
              <EngineActionControl engine={engine} />
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
};
