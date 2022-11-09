import {
  DatapointState,
  Row_AnyLog,
  UniqueDatapoint,
} from "jm-castle-ac-dc-types/dist/All.mjs";
import { useMemo } from "react";
import { Tuple } from "victory";
import { ChartChildType } from "../children/ChartChild";
import {
  DatapointChartChildProps,
  getDatapointChartChild,
} from "../children/DatapointChartChild";
import { DateToNumberChart } from "./DateToNumberChart";
import { DateToStringChart } from "./DateToStringChart";

export interface DatapointsChartProps {
  width: number;
  height: number;
  xDomain: Tuple<Date>;
  type:
    | {
        id: "date-to-number";
        yOffsetFn?: (i: number) => number;
        yTickValues?: number[];
        yTickFormat?: (y: number) => string;
      }
    | {
        id: "date-to-string";
        yOffsetFn?: (i: number) => number;
        yTickValues: number[];
        yTickFormat: (y: number) => string;
      };
  data: Record<
    string,
    {
      rows?: Row_AnyLog[];
      states?: DatapointState[];
      datapoint: UniqueDatapoint;
      chartChildType?: ChartChildType;
      pointSize?: number;
      pointBorderSize?: number;
      color?: string;
      chartColorsForRow?: DatapointChartChildProps["chartColorsForRow"];
    }
  >;
}

export const DatapointsChart = (props: DatapointsChartProps) => {
  const { data, width, height, xDomain, type } = props;
  const { id, yTickFormat, yTickValues, yOffsetFn } = type;
  const standalone = Object.keys(data).length < 2;
  const chartChildren = useMemo(() => {
    const newChildren: JSX.Element[] = [];
    Object.keys(data).forEach((k, i) => {
      const yOffset = yOffsetFn ? yOffsetFn(i) : undefined;
      const dataPackage = data[k];
      const {
        datapoint,
        rows,
        states,
        chartChildType,
        pointSize,
        pointBorderSize,
        color,
        chartColorsForRow,
      } = dataPackage || {};
      const child = getDatapointChartChild({
        yOffset,
        key: datapoint.id,
        chartChildType,
        pointSize,
        pointBorderSize,
        color,
        chartColorsForRow,
        datapoint,
        rows,
        states,
        standalone,
      });
      child && newChildren.push(child);
    });
    return newChildren;
  }, [data, standalone, yOffsetFn]);

  return id === "date-to-number" ? (
    <DateToNumberChart width={width} height={height} xDomain={xDomain}>
      {chartChildren}
    </DateToNumberChart>
  ) : (
    <DateToStringChart
      width={width}
      height={height}
      xDomain={xDomain}
      yTickFormat={yTickFormat}
      yTickValues={yTickValues}
    >
      {chartChildren}
    </DateToStringChart>
  );
};
