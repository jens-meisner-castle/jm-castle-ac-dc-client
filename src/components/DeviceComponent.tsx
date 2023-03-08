import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Grid, Tooltip, Typography, useTheme } from "@mui/material";
import {
  DatapointState,
  Device,
  SerializableDeviceType,
  UniqueDatapoint,
} from "jm-castle-ac-dc-types/build";
import { DateTime, Duration } from "luxon";
import { MouseEventHandler, useCallback, useMemo, useState } from "react";
import { backendApiUrl } from "../configuration/Urls";
import { useDeviceControlDatapoints } from "../hooks/useDeviceControlDatapoints";
import { useDeviceDatapoints } from "../hooks/useDeviceDatapoints";
import { useDeviceStatus } from "../hooks/useDeviceStatus";
import { AppAction, AppActions } from "./AppActions";
import { DatapointComponent } from "./DatapointComponent";
import { DatapointStateComponent } from "./DatapointStateComponent";
import { SimulationPreviewComponent } from "./SimulationPreviewComponent";

export interface DeviceComponentProps {
  leftColumnWidth?: number;
  device: Device;
  deviceType: SerializableDeviceType;
}

export const DeviceComponent = (props: DeviceComponentProps) => {
  const { device, deviceType, leftColumnWidth } = props;
  const { isSimulation, simulation } = deviceType;
  const { id, type, webInterface, api, ipAddress } = device;
  const [updateIndicator, setUpdateIndicator] = useState(1);
  const refreshStatus = useCallback(
    () => setUpdateIndicator((previous) => previous + 1),
    []
  );
  const actions = useMemo(() => {
    const newActions: AppAction[] = [];
    newActions.push({
      label: (
        <Tooltip title="Daten aktualisieren">
          <RefreshIcon />
        </Tooltip>
      ),
      onClick: refreshStatus,
    });
    return newActions;
  }, [refreshStatus]);
  const openWebInterface: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event) => {
      event.preventDefault();
      webInterface && window.open(webInterface);
      return false;
    },
    [webInterface]
  );
  const { datapoints, error: datapointsError } = useDeviceDatapoints(
    backendApiUrl,
    device.id
  );
  const { datapoints: controlDatapoints, error: controlDatapointsError } =
    useDeviceControlDatapoints(backendApiUrl, device.id);
  const { error: statusError, status } = useDeviceStatus(
    backendApiUrl,
    id,
    updateIndicator
  );
  const { responsive, datapoints: datapointStates } = status || {};
  const stateAssociations = useMemo(() => {
    const newStateAssociations: {
      datapoint: UniqueDatapoint;
      state: DatapointState | undefined;
    }[] = [];
    datapoints &&
      datapointStates &&
      datapoints.forEach((datapoint) => {
        const state = datapointStates[datapoint.id];
        newStateAssociations.push({ datapoint, state });
      });
    newStateAssociations.sort((a, b) =>
      a.datapoint.id.localeCompare(b.datapoint.id)
    );
    return newStateAssociations;
  }, [datapoints, datapointStates]);
  const theme = useTheme();
  const usedLeftColumnWidth = leftColumnWidth || 450;
  const { dateLevel } = simulation || {};
  const previewFrom = useMemo(
    () =>
      dateLevel === "year"
        ? DateTime.now().startOf("year")
        : DateTime.now().startOf("day"),
    [dateLevel]
  );
  const previewTo = useMemo(
    () =>
      dateLevel === "year"
        ? DateTime.now().endOf("year")
        : DateTime.now().endOf("day"),
    [dateLevel]
  );
  const previewPrecision = useMemo(
    () =>
      dateLevel === "year"
        ? Duration.fromObject({ hours: 24 })
        : Duration.fromObject({ seconds: 30 }),
    [dateLevel]
  );

  return (
    <Grid container direction="row">
      <Grid item style={{ minWidth: 400 }}>
        <Grid container direction="column">
          <Grid item>
            <Grid container direction="row">
              <Grid item style={{ width: usedLeftColumnWidth }}>
                <Typography>{"Device (id)"}</Typography>
              </Grid>
              <Grid item>
                <Typography>{id}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item style={{ width: usedLeftColumnWidth }}>
                <Typography>{"Controls"}</Typography>
              </Grid>
              <Grid item>
                <AppActions actions={actions} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item style={{ width: usedLeftColumnWidth }}>
                <Typography>{"Type"}</Typography>
              </Grid>
              <Grid item>
                <Typography>{type}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item style={{ width: usedLeftColumnWidth }}>
                <Typography>{"IP address"}</Typography>
              </Grid>
              <Grid item>
                <Typography>{ipAddress}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item style={{ width: usedLeftColumnWidth }}>
                <Typography>{"Web interface"}</Typography>
              </Grid>
              <Grid item>
                <a
                  style={{ color: theme.palette.text.primary }}
                  href={webInterface}
                  rel="noreferrer noopener"
                  onClick={openWebInterface}
                >
                  <Typography>{webInterface}</Typography>
                </a>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row">
              <Grid item style={{ width: usedLeftColumnWidth }}>
                <Typography>{"Api"}</Typography>
              </Grid>
              <Grid item>
                <Typography>{api}</Typography>
              </Grid>
            </Grid>
          </Grid>
          {datapointsError && (
            <Grid item>
              <Grid container direction="row">
                <Grid item style={{ width: usedLeftColumnWidth }}>
                  <Typography>{"Device datapoints error"}</Typography>
                </Grid>
                <Grid item style={{ maxWidth: 800 }}>
                  <Typography>{datapointsError}</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {controlDatapointsError && (
            <Grid item>
              <Grid container direction="row">
                <Grid item style={{ width: usedLeftColumnWidth }}>
                  <Typography>{"Device control datapoints error"}</Typography>
                </Grid>
                <Grid item style={{ maxWidth: 800 }}>
                  <Typography>{controlDatapointsError}</Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {statusError && (
            <Grid item>
              <Grid container direction="row">
                <Grid item style={{ width: usedLeftColumnWidth }}>
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
              <Grid item style={{ width: usedLeftColumnWidth }}>
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
            <Typography>{"Datapoints"}</Typography>
          </Grid>
          {stateAssociations.map((s) => (
            <Grid key={s.datapoint.id} item>
              <DatapointStateComponent
                state={s.state}
                datapoint={s.datapoint}
                leftColumnWidth={usedLeftColumnWidth}
              />
            </Grid>
          ))}
          <Grid item>
            <Typography>{"Control datapoints"}</Typography>
          </Grid>
          {controlDatapoints &&
            controlDatapoints.map((datapoint) => (
              <Grid key={datapoint.id} item>
                <DatapointComponent
                  datapoint={datapoint}
                  leftColumnWidth={usedLeftColumnWidth}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>
      {isSimulation && (
        <Grid item>
          <SimulationPreviewComponent
            from={previewFrom}
            to={previewTo}
            precision={previewPrecision}
            device={device}
            deviceType={deviceType}
            width={leftColumnWidth || 500}
            height={200}
          />
        </Grid>
      )}
    </Grid>
  );
};
