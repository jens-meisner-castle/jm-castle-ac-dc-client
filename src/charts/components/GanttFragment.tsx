/* eslint-disable @typescript-eslint/no-explicit-any */
import { VictoryLabel } from "victory";

export interface GanttFragmentProps {
  height: number;
  textColor?: string;
  text?: string | ((props: GanttFragmentProps | any) => string);
}

export interface RightAlignedProps {
  width: number;
  height: number;
  icon?: JSX.Element;
  fill: string;
  fillOpacity: number;
  textColor?: string;
  text?: string | ((props: RightAlignedProps | any) => string);
  theme: any;
}

const getRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  fillOpacity: number,
  events: Record<string, unknown>
) => {
  return (
    <rect
      {...events}
      x={x}
      y={y}
      style={{
        fill: fill,
        fillOpacity: fillOpacity,
      }}
      width={width}
      height={height}
    />
  );
};

const getGanttRectForProps = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: GanttFragmentProps | any,
  x?: number,
  y?: number
) => {
  return getRect(
    typeof x === "number" ? x : props.x,
    (typeof y === "number" ? y : props.y) - props.height / 2,
    props.scale.x(props.datum.ext.to) - props.x,
    props.height,
    props.datum.ext.fill,
    props.datum.ext.fillOpacity,
    props.events
  );
};

const getRightAlignedRectForProps = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: RightAlignedProps | any,
  x?: number,
  y?: number
) => {
  return getRect(
    (typeof x === "number" ? x : props.x) - props.width,
    (typeof y === "number" ? y : props.y) - props.height / 2,
    props.width,
    props.height,
    props.fill,
    props.fillOpacity,
    props.events
  );
};

const getGanttGroup = (props: GanttFragmentProps | any, text: string) => {
  const x = props.x;
  const y = props.y - props.height / 2;
  const width = props.scale.x(props.datum.ext.to) - props.x;
  return (
    <g {...props.events} transform={`translate(${x} ${y})`}>
      {getRect(
        0,
        0,
        width,
        props.height,
        props.datum.ext.fill,
        props.datum.ext.fillOpacity,
        {}
      )}
      <VictoryLabel
        text={text}
        style={{
          fontSize: 10,
          fill: props.textColor ? props.textColor : "white",
        }}
        dx={width / 2}
        dy={props.height / 2}
        textAnchor="middle"
      />
    </g>
  );
};

const getRightAlignedGroup = (
  props: RightAlignedProps | any,
  text?: string,
  icon?: JSX.Element
) => {
  const x = props.x - props.width;
  const y = props.y - props.height / 2;
  return (
    <g {...props.events} transform={`translate(${x} ${y})`}>
      {getRect(
        0,
        0,
        props.width,
        props.height,
        props.fill,
        props.fillOpacity,
        props.events
      )}
      {text && (
        <VictoryLabel
          text={text}
          key="label"
          style={{ fill: props.textColor ? props.textColor : "white" }}
          dx={props.width / 2}
          dy={props.height / 2}
          textAnchor="middle"
        />
      )}
      {icon}
    </g>
  );
};

export const GanttFragment = (props: GanttFragmentProps | any) => {
  const { text } = props;
  const usedText = text
    ? typeof text === "string"
      ? text
      : text(props)
    : null;
  if (usedText) {
    return getGanttGroup(props, usedText);
  } else {
    return getGanttRectForProps(props);
  }
};

export function RightAligned(props: RightAlignedProps | any) {
  const text = props.text
    ? typeof props.text === "string"
      ? props.text
      : props.text(props)
    : null;
  if (text || props.icon) {
    return getRightAlignedGroup(props, text, props.icon);
  } else {
    return getRightAlignedRectForProps(props);
  }
}
