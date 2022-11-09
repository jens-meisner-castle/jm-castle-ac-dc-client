import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Grid, Typography } from "@mui/material";
import { Device } from "jm-castle-ac-dc-types/dist/All.mjs";
import { useMemo } from "react";
import { backendApiUrl } from "../configuration/Urls";
import { useDeviceStatus } from "../hooks/useDeviceStatus";

export interface DeviceMiniStatusProps {
  updateIndicator: number;
  leftColumnWidth: number;
  minWidth: number;
  device: Device;
}

export const DeviceMiniStatus = (props: DeviceMiniStatusProps) => {
  const { device, leftColumnWidth, updateIndicator, minWidth } = props;
  const { id, type, ipAddress } = device;
  const { error: statusError, status } = useDeviceStatus(
    backendApiUrl,
    id,
    updateIndicator
  );
  const { responsive, datapoints: datapointStates } = status || {};
  const datapointStateArr = useMemo(
    () =>
      datapointStates &&
      Object.keys(datapointStates)
        .sort()
        .map((k) => datapointStates[k]),
    [datapointStates]
  );

  return (
    <Grid container direction="column" style={{ minWidth }}>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Device (id)"}</Typography>
          </Grid>
          <Grid item>
            <Typography>{id}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Type"}</Typography>
          </Grid>
          <Grid item>
            <Typography>{type}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"IP address"}</Typography>
          </Grid>
          <Grid item>
            <Typography>{ipAddress}</Typography>
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
            <Typography>{"Responsive"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            {responsive === true ? (
              <CheckIcon />
            ) : responsive === false ? (
              <HighlightOffIcon />
            ) : (
              <HourglassEmptyIcon />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Datapoints"}</Typography>
          </Grid>
          <Grid item>
            <Typography>
              {datapointStateArr && datapointStateArr.length}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
