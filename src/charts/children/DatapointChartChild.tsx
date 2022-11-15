import {
  DatapointState,
  Row_AnyLog,
  UniqueDatapoint,
} from "jm-castle-ac-dc-types/build";
import { VictoryChartChildData } from "../Types";
import {
  ChartChildProps,
  ChartChildType,
  getChartChildForDatapoint,
} from "./ChartChild";

export interface DatapointChartChildProps {
  key: string | number;
  datapoint: UniqueDatapoint;
  chartChildType?: ChartChildType;
  pointSize?: number;
  pointBorderSize?: number;
  standalone: boolean;
  rows?: Row_AnyLog[];
  states?: DatapointState[];
  color?: string;
  chartColorsForRow?: (row: Row_AnyLog) => { stroke?: string; fill?: string };
  yOffset?: number;
}

export const getDatapointChartChild = (props: DatapointChartChildProps) => {
  const {
    rows,
    states,
    datapoint,
    standalone,
    key,
    yOffset,
    chartChildType,
    pointSize,
    pointBorderSize,
    color,
    chartColorsForRow,
  } = props;
  const { valueType } = datapoint;
  const data: VictoryChartChildData = { points: [] };
  const colorStroke: ChartChildProps["colorStroke"] = chartColorsForRow
    ? (datum) => datum?.ext?.stroke || color || "black"
    : undefined;
  const colorFill: ChartChildProps["colorFill"] = chartColorsForRow
    ? (datum) => datum?.ext?.fill || color || "black"
    : color || "black";
  switch (valueType) {
    case "number":
      rows?.forEach((row) => {
        const ext = chartColorsForRow ? chartColorsForRow(row) : undefined;
        data.points.push({
          x: row.logged_at * 1000 + row.logged_at_ms,
          y: (row.value_num || 0) + (yOffset || 0),
          ext: ext
            ? { ...ext, sourceValue: row.value_num || 0 }
            : { sourceValue: row.value_num || 0 },
        });
      });
      states?.forEach((state) => {
        data.points.push({
          x: state.at,
          y: (state.valueNum || 0) + (yOffset || 0),
          ext: { sourceValue: state.valueNum || 0 },
        });
      });
      break;
    case "boolean":
      rows?.forEach((row) => {
        const ext = chartColorsForRow ? chartColorsForRow(row) : undefined;
        data.points.push({
          x: row.logged_at * 1000 + row.logged_at_ms,
          y: yOffset || 0,
          ext: ext
            ? {
                ...ext,
                sourceValue: row.value_num || 0,
                label: row.value_num === 1 ? "on" : "off",
              }
            : {
                sourceValue: row.value_num || 0,
                label: row.value_num === 1 ? "on" : "off",
              },
        });
      });
      states?.forEach((state) => {
        data.points.push({
          x: state.at,
          y: yOffset || 0,
          ext: { sourceValue: state.valueNum || 0 },
        });
      });
      break;
    case "string":
      {
        const mapping: Record<number, string> = {};
        const reverseMapping: Record<string, number> = {};
        let index = 0;
        rows?.forEach((row) => {
          const ext = chartColorsForRow ? chartColorsForRow(row) : undefined;
          const stringValue = row.value_string || "?";
          let y = reverseMapping[stringValue];
          if (!y) {
            index++;
            reverseMapping[stringValue] = index;
            mapping[index] = stringValue;
            y = index;
          }
          data.points.push({
            x: row.logged_at * 1000 + row.logged_at_ms,
            y,
            ext: ext
              ? { ...ext, sourceValue: row.value_string || 0 }
              : { sourceValue: row.value_string || 0 },
          });
        });
        states?.forEach((state) => {
          const stringValue = state.valueString || "?";
          let y = reverseMapping[stringValue];
          if (!y) {
            index++;
            reverseMapping[stringValue] = index;
            mapping[index] = stringValue;
            y = index;
          }
          data.points.push({
            x: state.at,
            y,
            ext: { sourceValue: stringValue },
          });
        });
        data.yMap = mapping;
      }
      break;
  }
  data.points.sort((a, b) => a.x - b.x);

  return getChartChildForDatapoint({
    key,
    datapoint,
    chartChildType,
    pointSize,
    pointBorderSize,
    data,
    colorFill,
    colorStroke,
    standalone,
  });
};
