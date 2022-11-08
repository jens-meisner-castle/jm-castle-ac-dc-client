import { Grid, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import {
  Device,
  DeviceDatapoint,
  SerializableDeviceType,
} from "../../api-types/Types";
import { DeviceComponent } from "../../components/DeviceComponent";
import { backendApiUrl } from "../../configuration/Urls";
import { useDevices } from "../../hooks/useDevices";
import { useDeviceTypes } from "../../hooks/useDeviceTypes";

export const Page = () => {
  const { devicesWithDatapoints, error: errorDevices } =
    useDevices(backendApiUrl);
  const { deviceTypes, error: errorDeviceTypes } =
    useDeviceTypes(backendApiUrl);
  const pairs = useMemo(() => {
    const newPairs: {
      device: Device;
      datapoints: DeviceDatapoint[];
      type: SerializableDeviceType;
    }[] = [];
    devicesWithDatapoints?.forEach((deviceWithDatapoints) => {
      const { type: typeId } = deviceWithDatapoints.device;
      const type = deviceTypes && deviceTypes.find((t) => t.id === typeId);
      type && newPairs.push({ ...deviceWithDatapoints, type });
    });
    return newPairs;
  }, [devicesWithDatapoints, deviceTypes]);

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5">{"All devices"}</Typography>
      </Grid>
      {errorDeviceTypes && (
        <Grid item>
          <Typography>{`Device types error: ${errorDeviceTypes}`}</Typography>
        </Grid>
      )}
      {errorDevices && (
        <Grid item>
          <Typography>{`Devices error: ${errorDevices}`}</Typography>
        </Grid>
      )}
      {pairs.map((pair, i) => (
        <Grid key={pair.device.id} item>
          <Paper style={{ marginTop: i > 0 ? 5 : 0 }}>
            <DeviceComponent
              device={pair.device}
              deviceType={pair.type}
              leftColumnWidth={450}
            />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
