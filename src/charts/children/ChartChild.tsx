import {
  Datum,
  VictoryArea,
  VictoryScatter,
  VictoryStyleInterface,
} from "victory";
import { UniqueDatapoint } from "../../api-types/Types";
import { GanttFragment } from "../components/GanttFragment";
import {
  DateToNumberData,
  DateToNumberIntervalData,
  GanttData,
  VictoryChartChildData,
} from "../Types";

const getGanttData = (data: VictoryChartChildData) => {
  const ganttData: GanttData = { points: [] };
  const { points } = data;
  ganttData.label = (args: {
    datum: { ext: DateToNumberIntervalData["ext"] };
  }) => args?.datum?.ext?.label || "?";
  let lastStart: DateToNumberData | undefined = undefined;
  points.forEach((d, i) => {
    const previous = i > 0 ? points[i - 1] : undefined;
    if (!lastStart) {
      lastStart = d;
    }
    if (previous) {
      if (previous.ext.sourceValue !== d.ext.sourceValue) {
        const { fill, label, sourceValue } = lastStart.ext;
        ganttData.points.push({
          x: lastStart.x,
          y: lastStart.y,
          ext: {
            fill: fill || "gray",
            to: d.x,
            label,
            sourceValue,
          },
        });
        lastStart = d;
      }
    }
  });
  const lastPoint = points.length ? points[points.length - 1] : undefined;
  // Typescript Fehler: lastStart soll hier IMMER! undefined sein
  if (lastPoint && lastStart && lastStart !== lastPoint) {
    const { fill, label, sourceValue } =
      (lastStart as DateToNumberData).ext || {};
    ganttData.points.push({
      x: (lastStart as DateToNumberData).x,
      y: (lastStart as DateToNumberData).y,
      ext: {
        fill: fill || "gray",
        to: lastPoint.x,
        label,
        sourceValue,
      },
    });
  }
  return ganttData;
};

const getDataStyle = (
  colorFill: ChartChildProps["colorFill"],
  colorStroke: ChartChildProps["colorStroke"],
  moreAttributes: { pointBorderSize?: number }
) => {
  const { pointBorderSize } = moreAttributes;
  const dataStyle: VictoryStyleInterface["data"] = {
    stroke: colorStroke
      ? (args: {
          active?: boolean;
          data?: Datum[];
          datum?: Datum;
          horizontal?: boolean;
          index?: unknown;
          x?: number;
          y?: number;
        }) => {
          const { datum } = args;
          return datum ? colorStroke(datum) : "black";
        }
      : undefined,
    fill:
      typeof colorFill === "string"
        ? colorFill
        : (args: {
            active?: boolean;
            data?: Datum[];
            datum?: Datum;
            horizontal?: boolean;
            index?: unknown;
            x?: number;
            y?: number;
          }) => {
            const { datum } = args;
            return datum ? colorFill(datum) : "red";
          },
    fillOpacity: 0.5,
    strokeWidth: pointBorderSize || 0,
  };
  return dataStyle;
};

export const getChartChildForNumberDatapoint = (props: ChartChildProps) => {
  const { datapoint } = props;
  const { valueUnit } = datapoint;

  switch (valueUnit) {
    case "W":
      return getChartChildArea(props);
    default:
      return getChartChildPoints(props);
  }
};

export const getChartChildForBooleanDatapoint = (props: ChartChildProps) => {
  return getChartChildGantt(props);
};

export type ChartChildType = "gantt" | "area" | "points";

export interface ChartChildProps {
  key: string | number;
  datapoint: UniqueDatapoint;
  chartChildType?: ChartChildType;
  pointSize?: number;
  pointBorderSize?: number;
  data: VictoryChartChildData;
  colorFill: string | ((datum: { ext?: { fill?: string } }) => string);
  colorStroke?: (datum: { ext?: { stroke?: string } }) => string;
  standalone: boolean;
}

export const getChartChildForDatapoint = (props: ChartChildProps) => {
  const { datapoint, chartChildType } = props;
  const { valueType } = datapoint;

  switch (chartChildType) {
    case "area":
      return getChartChildArea(props);
    case "points":
      return getChartChildPoints(props);
    case "gantt":
      return getChartChildGantt(props);
  }

  switch (valueType) {
    case "number":
      return getChartChildForNumberDatapoint(props);
    case "boolean":
      return getChartChildForBooleanDatapoint(props);
    default:
      return undefined;
  }
};

export const getChartChildArea = (props: ChartChildProps) => {
  const { data, colorFill, standalone, key } = props;
  const dataStyle = getDataStyle(colorFill, undefined, {});

  return (
    <VictoryArea
      key={key}
      style={{ data: dataStyle }}
      standalone={standalone}
      data={data.points}
    />
  );
};

export const getChartChildPoints = (props: ChartChildProps) => {
  const {
    data,
    colorFill,
    colorStroke,
    standalone,
    key,
    pointSize,
    pointBorderSize,
  } = props;
  const dataStyle = getDataStyle(colorFill, colorStroke, { pointBorderSize });

  return (
    <VictoryScatter
      key={key}
      size={pointSize || 2}
      style={{ data: dataStyle }}
      standalone={standalone}
      data={data.points}
    />
  );
};

export const getChartChildGantt = (props: ChartChildProps) => {
  const { data, standalone, key } = props;
  const { points, label } = getGanttData(data);

  return (
    <VictoryScatter
      key={key}
      standalone={standalone}
      data={points}
      dataComponent={<GanttFragment text={label} height={15} />}
    />
  );
};
