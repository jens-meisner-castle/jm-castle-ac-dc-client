import { Grid, Typography } from "@mui/material";
import {
  DatapointState,
  Device,
  PreviewOptions,
  SerializableDeviceType,
  UniqueDatapoint,
} from "jm-castle-ac-dc-types/dist/All.mjs";
import { DateTime, Duration } from "luxon";
import { useMemo } from "react";
import { Tuple } from "victory";
import { getDatapointChartChild } from "../charts/children/DatapointChartChild";
import { DateToNumberChart } from "../charts/containers/DateToNumberChart";
import { backendApiUrl } from "../configuration/Urls";
import { useSimulationPreview } from "../hooks/useSimulationPreview";
import { getDatapointColor } from "../utils/Color";

export interface SimulationPreviewComponentProps {
  device: Device;
  deviceType: SerializableDeviceType;
  precision: Duration;
  width: number;
  height: number;
  from: DateTime;
  to: DateTime;
}

export const SimulationPreviewComponent = (
  props: SimulationPreviewComponentProps
) => {
  const { device, deviceType, width, height, from, to, precision } = props;
  const chartWidth = width;
  const chartHeight = height;
  const previewOptions = useMemo<PreviewOptions>(
    () => ({ precision, interval: { from, to } }),
    [precision, from, to]
  );
  const { error, result } = useSimulationPreview(
    backendApiUrl,
    device.id,
    previewOptions
  );
  const { datapoints, data } = result || {};
  const xDomain = useMemo((): Tuple<Date> => {
    return [from.toJSDate(), to.toJSDate()];
  }, [from, to]);
  const statesPerDatapoint = useMemo(() => {
    const newData: Record<
      string,
      { states: DatapointState[]; datapoint: UniqueDatapoint }
    > = {};
    data &&
      Object.keys(data).forEach((k) => {
        const datapoint = datapoints && datapoints[k];
        if (datapoint) {
          const datapointStates = data[k];
          datapointStates.forEach((state) => {
            if (!newData[k]) {
              newData[k] = { states: [], datapoint };
            }
            newData[k].states.push(state);
          });
        }
      });
    return newData;
  }, [datapoints, data]);

  return (
    <Grid container direction="column">
      {error && (
        <Grid item>
          <Typography>{error}</Typography>
        </Grid>
      )}
      <Grid item>
        <Grid container direction="row">
          {Object.keys(statesPerDatapoint).map((k) => {
            const { datapoint, states } = statesPerDatapoint[k];
            const color = getDatapointColor(k);
            const chartChild = getDatapointChartChild({
              key: datapoint.id,
              datapoint,
              color,
              states,
              standalone: true,
            });
            return (
              <Grid key={k} item>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography component="span">
                    {`${datapoint?.name} (${
                      datapoint.valueUnit || datapoint.valueType
                    }) (sim-type: ${deviceType.id})`}
                  </Typography>
                  {chartChild && (
                    <DateToNumberChart
                      key={k}
                      width={chartWidth}
                      height={chartHeight}
                      xDomain={xDomain}
                    >
                      {chartChild}
                    </DateToNumberChart>
                  )}
                </div>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
