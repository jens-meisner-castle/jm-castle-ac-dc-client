import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Grid, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { SerializableEngine } from "../api-types/Types";
import { backendApiUrl } from "../configuration/Urls";
import { useEngineStatus } from "../hooks/useEngineStatus";
import { getDateFormat } from "../utils/Format";

export interface EngineMiniStatusProps {
  updateIndicator: number;
  width?: number;
  leftColumnWidth: number;
  engine: SerializableEngine;
}

export const EngineMiniStatus = (props: EngineMiniStatusProps) => {
  const { engine, updateIndicator, leftColumnWidth, width } = props;
  const { key } = engine;
  const { error: statusError, status } = useEngineStatus(
    backendApiUrl,
    key,
    updateIndicator
  );
  const {
    running,
    lastLapEndAt,
    duration,
    errors: errorsPerLap,
  } = status || {};
  const lastErrorAtLap =
    errorsPerLap && errorsPerLap.length
      ? errorsPerLap[errorsPerLap.length - 1].lap
      : undefined;
  const { laps } = duration || {};

  return (
    <Grid container direction="column" style={{ width }}>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Engine (key)"}</Typography>
          </Grid>
          <Grid item>
            <Typography>{key}</Typography>
          </Grid>
        </Grid>
      </Grid>
      {statusError && (
        <Grid item>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{"Current status error"}</Typography>
            </Grid>
            <Grid item style={{ maxWidth: 800 }}>
              <Typography>{statusError}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Run state"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            {running ? <CheckIcon /> : <HighlightOffIcon />}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Count of laps"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            <Typography>{laps ? laps.toLocaleString() : "0"}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Last lap at"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            <Typography>
              {lastLapEndAt
                ? DateTime.fromMillis(lastLapEndAt).toFormat(
                    getDateFormat("second")
                  )
                : "never"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Last error at lap"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            <Typography>{lastErrorAtLap || "never"}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
