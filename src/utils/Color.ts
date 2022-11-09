import {
  AnyDataValue,
  Row_AnyLog,
  UniqueDatapoint,
} from "jm-castle-ac-dc-types/dist/All.mjs";

const DatapointColors: Record<string, string> = {};

const colorSequence = [
  "blue",
  "red",
  "purple",
  "brown",
  "orange",
  "navy",
  "darkGreen",
];

let index = -1;

export const getDatapointColor = (id: string) => {
  let color = DatapointColors[id];
  if (color) {
    return color;
  }
  index = index >= colorSequence.length - 1 ? 0 : index + 1;
  color = colorSequence[index];
  DatapointColors[id] = color;
  return color;
};

const booleanColorScale = (value: AnyDataValue) =>
  value === true || value === "true" || value === 1 ? "green" : "red";

export const getBooleanColorScale = () => {
  return booleanColorScale;
};

export const makeChartColorFillAccess = (datapoint: UniqueDatapoint) => {
  const { valueType, id } = datapoint;
  switch (valueType) {
    case "boolean":
      return getBooleanColorScale();
    default:
      return getDatapointColor(id);
  }
};

export const makeChartColorAccessOnDatapointLog = (
  datapoint: UniqueDatapoint
) => {
  const fillValueOrFn = makeChartColorFillAccess(datapoint);
  if (typeof fillValueOrFn === "string") {
    return fillValueOrFn;
  }
  return (row: Row_AnyLog) => {
    const fill =
      typeof fillValueOrFn === "string"
        ? fillValueOrFn
        : fillValueOrFn(row.value_string || row.value_num);
    return {
      fill,
    };
  };
};

export const makeChartColorAccessOnControlLog = (
  datapoint: UniqueDatapoint
) => {
  const fillValueOrFn = makeChartColorFillAccess(datapoint);
  return (row: Row_AnyLog) => {
    const fill =
      typeof fillValueOrFn === "string"
        ? fillValueOrFn
        : fillValueOrFn(row.value_string || row.value_num);
    return {
      stroke: row.executed ? (row.success ? "green" : "red") : "gray",
      fill,
    };
  };
};
