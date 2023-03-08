import { Grid, Paper, Typography } from "@mui/material";
import {
  Device,
  DeviceDatapoint,
  SerializableDeviceType,
} from "jm-castle-ac-dc-types/build";
import { DateTime, Duration } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppAction, AppActions } from "../../components/AppActions";
import { SimulationPreviewComponent } from "../../components/SimulationPreviewComponent";
import { backendApiUrl } from "../../configuration/Urls";
import { FilterComponent } from "../../filter/FilterComponent";
import { Filter } from "../../filter/Types";
import { useDevices } from "../../hooks/useDevices";
import { useDeviceTypes } from "../../hooks/useDeviceTypes";

import { getNewFilter } from "../../utils/Filter";

export const Page = () => {
  const { deviceTypes, error: deviceTypesError } =
    useDeviceTypes(backendApiUrl);
  const { devicesWithDatapoints, error: devicesError } =
    useDevices(backendApiUrl);
  const devicePairs = useMemo(() => {
    const newPairs: Record<
      string,
      {
        device: Device;
        datapoints: DeviceDatapoint[];
        deviceType: SerializableDeviceType;
      }
    > = {};
    if (devicesWithDatapoints && deviceTypes) {
      devicesWithDatapoints.forEach((deviceWithDatapoints) => {
        const deviceType = deviceTypes.find(
          (t) => t.id === deviceWithDatapoints.device.type
        );
        deviceType &&
          deviceType.isSimulation &&
          (newPairs[deviceWithDatapoints.device.id] = {
            ...deviceWithDatapoints,
            deviceType,
          });
      });
    }
    return newPairs;
  }, [deviceTypes, devicesWithDatapoints]);
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    const newWidth = ref.current ? ref.current.offsetWidth : undefined;
    newWidth && setWidth(newWidth);
  }, []);
  const chartsPerRow = width
    ? width > 2000
      ? 4
      : width > 1500
      ? 3
      : width > 1000
      ? 2
      : 1
    : 1;
  const usedWidth = width ? width - 30 : undefined;
  const chartWidth = usedWidth
    ? Math.floor(usedWidth / chartsPerRow)
    : undefined;
  const chartHeight = chartWidth && Math.min(Math.round(chartWidth / 2), 500);
  const initialFilter = useMemo(
    () =>
      getNewFilter(
        undefined,
        DateTime.now().startOf("day"),
        DateTime.now().endOf("day")
      ),
    []
  );
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const fromYear = useMemo(() => filter.from.startOf("year"), [filter]);
  const toYear = useMemo(() => filter.to.endOf("year"), [filter]);
  const actions = useMemo(() => {
    const newActions: AppAction[] = [];
    return newActions;
  }, []);

  return (
    <>
      <div ref={ref} style={{ width: "100%" }} />
      {chartWidth && chartHeight && (
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h5">{"Simulation"}</Typography>
          </Grid>
          <Grid item>
            <Paper>
              <AppActions actions={actions} />
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <FilterComponent filter={filter} onChange={setFilter} />
            </Paper>
          </Grid>
          {deviceTypesError && (
            <Grid item>
              <Typography>{`Device types error: ${deviceTypesError}`}</Typography>
            </Grid>
          )}
          {devicesError && (
            <Grid item>
              <Typography>{`Devices error: ${devicesError}`}</Typography>
            </Grid>
          )}
          <Grid container direction="row">
            {Object.keys(devicePairs).map((k) => {
              const { device, deviceType } = devicePairs[k];
              const { simulation } = deviceType;
              const { dateLevel } = simulation || {};
              const precision =
                dateLevel === "year"
                  ? Duration.fromObject({ hours: 24 })
                  : Duration.fromObject({ minutes: 1 });
              return (
                <Grid key={k} item>
                  <SimulationPreviewComponent
                    device={device}
                    deviceType={deviceType}
                    from={dateLevel === "year" ? fromYear : filter.from}
                    to={dateLevel === "year" ? toYear : filter.to}
                    precision={precision}
                    width={chartWidth}
                    height={chartHeight}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
    </>
  );
};
