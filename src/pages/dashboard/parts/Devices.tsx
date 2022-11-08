import { Grid, Paper } from "@mui/material";
import { MutableRefObject, useCallback, useState } from "react";
import { backendApiUrl } from "../../../configuration/Urls";
import { useDevices } from "../../../hooks/useDevices";
import { DeviceMiniStatus } from "../../../components/DeviceMiniStatus";
import { UpdateFunction } from "../Types";

export interface DevicesContent {
  component: JSX.Element;
  update: UpdateFunction;
  error?: string;
}

export interface DevicesPartProps {
  children: (content: DevicesContent) => JSX.Element;
  updateRef?: MutableRefObject<UpdateFunction | null>;
  leftColumnWidth: number;
}

export const DevicesPart = (props: DevicesPartProps) => {
  const { children, leftColumnWidth, updateRef } = props;
  const [updateIndicator, setUpdateIndicator] = useState(1);
  const refreshStatus = useCallback(
    () => setUpdateIndicator((previous) => previous + 1),
    []
  );
  updateRef && (updateRef.current = refreshStatus);
  const { devicesWithDatapoints, error } = useDevices(backendApiUrl);
  const minWidthOfDevice = 300;

  return children({
    error,
    update: refreshStatus,
    component: (
      <Grid container direction="row">
        {devicesWithDatapoints &&
          devicesWithDatapoints.map((deviceWithDatapoints) => (
            <Grid key={deviceWithDatapoints.device.id} item>
              <Paper
                style={{ padding: 5, margin: 5, marginTop: 0, marginLeft: 0 }}
              >
                <DeviceMiniStatus
                  updateIndicator={updateIndicator}
                  leftColumnWidth={leftColumnWidth}
                  minWidth={minWidthOfDevice}
                  device={deviceWithDatapoints.device}
                />
              </Paper>
            </Grid>
          ))}
      </Grid>
    ),
  });
};
