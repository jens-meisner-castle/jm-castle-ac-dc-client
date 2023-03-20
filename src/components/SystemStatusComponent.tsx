import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { SystemStatus } from "jm-castle-ac-dc-types/build";
import { TextareaComponent } from "jm-castle-components/build";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { backendApiUrl } from "../configuration/Urls";
import { useDatastateDatapoints } from "../hooks/useDatastateDatapoints";
import { useDeviceControlDatapoints } from "../hooks/useDeviceControlDatapoints";
import { useDeviceDatapoints } from "../hooks/useDeviceDatapoints";
import { usePersistentDatapoints } from "../hooks/usePersistentDatapoints";
import { getDateFormat } from "../utils/Format";
import { DatapointComponent } from "./DatapointComponent";

export interface SystemStatusComponentProps {
  status: SystemStatus | undefined;
}

export const SystemStatusComponent = (props: SystemStatusComponentProps) => {
  const { status } = props;
  const { startedAt, configuration } = status || {};
  const { content, valid } = configuration || {};
  const { isValid } = content || {};
  const leftColumnWidth = 200;

  const [isConfigVisible, setIsConfigVisible] = useState(false);
  const [isValidConfigVisible, setIsValidConfigVisible] = useState(false);

  const [isDeviceDatapointsVisible, setIsDeviceDatapointsVisible] =
    useState(false);
  const [
    isDeviceControlDatapointsVisible,
    setIsDeviceControlDatapointsVisible,
  ] = useState(false);
  const { datapoints: deviceDatapoints, error: errorDeviceDatapoints } =
    useDeviceDatapoints(backendApiUrl);
  const {
    datapoints: deviceControlDatapoints,
    error: errorDeviceControlDatapoints,
  } = useDeviceControlDatapoints(backendApiUrl);
  useEffect(() => {
    deviceDatapoints?.sort((a, b) => a.name.localeCompare(b.name));
  }, [deviceDatapoints]);

  const [isDatastateDatapointsVisible, setIsDatastateDatapointsVisible] =
    useState(false);
  const { datapoints: datastateDatapoints, error: errorDatastateDatapoints } =
    useDatastateDatapoints(backendApiUrl);
  useEffect(() => {
    datastateDatapoints?.sort((a, b) => a.name.localeCompare(b.name));
  }, [datastateDatapoints]);

  const [isPersistentDatapointsVisible, setIsPersistentDatapointsVisible] =
    useState(false);
  const { datapoints: persistentDatapoints, error: errorPersistentDatapoints } =
    usePersistentDatapoints(backendApiUrl);
  useEffect(() => {
    persistentDatapoints?.sort((a, b) => a.name.localeCompare(b.name));
  }, [persistentDatapoints]);

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Paper>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{"Last start at"}</Typography>
            </Grid>
            <Grid item style={{ maxWidth: 800 }}>
              <Typography>
                {startedAt
                  ? DateTime.fromMillis(startedAt).toFormat(
                      getDateFormat("second")
                    )
                  : "never"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Paper>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{"Configuration (external)"}</Typography>
              {isValid ? <CheckIcon /> : <HighlightOffIcon />}
              <IconButton
                onClick={() => setIsConfigVisible((previous) => !previous)}
              >
                <MoreHorizIcon />
              </IconButton>
            </Grid>
            <Grid item flexGrow={1}>
              {isConfigVisible && content && (
                <TextareaComponent
                  value={content}
                  style={{
                    width: "90%",
                    resize: "none",
                    marginRight: 30,
                  }}
                  formatObject
                  maxRows={20}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Paper>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{"Configuration (valid)"}</Typography>
              {isValid ? <CheckIcon /> : <HighlightOffIcon />}
              <IconButton
                onClick={() => setIsValidConfigVisible((previous) => !previous)}
              >
                <MoreHorizIcon />
              </IconButton>
            </Grid>
            <Grid item flexGrow={1}>
              {isValidConfigVisible && valid && (
                <TextareaComponent
                  value={valid}
                  style={{
                    width: "90%",
                    resize: "none",
                    marginRight: 30,
                  }}
                  formatObject
                  maxRows={20}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Paper>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{`Device datapoints`}</Typography>
              <Typography component="span">{`${
                deviceDatapoints ? deviceDatapoints.length : ""
              }`}</Typography>
              <IconButton
                onClick={() =>
                  setIsDeviceDatapointsVisible((previous) => !previous)
                }
              >
                <MoreHorizIcon />
              </IconButton>
            </Grid>
            <Grid item flexGrow={1}>
              {errorDeviceDatapoints && (
                <Typography>{errorDeviceDatapoints}</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={1}>
          {isDeviceDatapointsVisible &&
            deviceDatapoints &&
            deviceDatapoints.map((datapoint) => (
              <Grid key={datapoint.id} item>
                <Paper style={{ padding: 5, minWidth: 300 }}>
                  <DatapointComponent datapoint={datapoint} />
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid item>
        <Paper>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{`Device control datapoints`}</Typography>
              <Typography component="span">{`${
                deviceControlDatapoints ? deviceControlDatapoints.length : ""
              }`}</Typography>
              <IconButton
                onClick={() =>
                  setIsDeviceControlDatapointsVisible((previous) => !previous)
                }
              >
                <MoreHorizIcon />
              </IconButton>
            </Grid>
            <Grid item flexGrow={1}>
              {errorDeviceControlDatapoints && (
                <Typography>{errorDeviceControlDatapoints}</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={1}>
          {isDeviceControlDatapointsVisible &&
            deviceControlDatapoints &&
            deviceControlDatapoints.map((datapoint) => (
              <Grid key={datapoint.id} item>
                <Paper style={{ padding: 5, minWidth: 300 }}>
                  <DatapointComponent datapoint={datapoint} />
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid item>
        <Paper>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{`Datastate datapoints`}</Typography>
              <Typography component="span">{`${
                datastateDatapoints ? datastateDatapoints.length : ""
              }`}</Typography>
              <IconButton
                onClick={() =>
                  setIsDatastateDatapointsVisible((previous) => !previous)
                }
              >
                <MoreHorizIcon />
              </IconButton>
            </Grid>
            <Grid item flexGrow={1}>
              {errorDatastateDatapoints && (
                <Typography>{errorDatastateDatapoints}</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={1}>
          {isDatastateDatapointsVisible &&
            datastateDatapoints &&
            datastateDatapoints.map((datapoint) => (
              <Grid key={datapoint.id} item>
                <Paper style={{ padding: 5, minWidth: 300 }}>
                  <DatapointComponent datapoint={datapoint} />
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid item>
        <Paper>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{`Persistent datapoints`}</Typography>
              <Typography component="span">{`${
                persistentDatapoints ? persistentDatapoints.length : ""
              }`}</Typography>
              <IconButton
                onClick={() =>
                  setIsPersistentDatapointsVisible((previous) => !previous)
                }
              >
                <MoreHorizIcon />
              </IconButton>
            </Grid>
            <Grid item flexGrow={1}>
              {errorPersistentDatapoints && (
                <Typography>{errorPersistentDatapoints}</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={1}>
          {isPersistentDatapointsVisible &&
            persistentDatapoints &&
            persistentDatapoints.map((datapoint) => (
              <Grid key={datapoint.id} item>
                <Paper style={{ padding: 5, minWidth: 300 }}>
                  <DatapointComponent datapoint={datapoint} />
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
