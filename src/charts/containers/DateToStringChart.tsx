import { Grid } from "@mui/material";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { Tuple, VictoryAxis, VictoryChart, VictoryContainer } from "victory";
import { victoryThemeMaterial } from "../../theme/VictoryTheme";
import { IScaleDate } from "../scales/IScaleDate";
import { getDefaultChartPadding } from "./ChartLayout";

export interface DateToStringChartProps {
  width: number;
  height: number;
  xDomain: Tuple<Date>;
  yTickValues: number[];
  yTickFormat: (y: number) => string;
  children: ReactNode;
}

export const DateToStringChart = (
  props: PropsWithChildren<DateToStringChartProps>
) => {
  const { width, height, xDomain, children, yTickFormat, yTickValues } = props;
  const domainPadding = 30;
  const theme = victoryThemeMaterial();
  const xScale = useMemo(
    () =>
      new IScaleDate({
        min: xDomain[0],
        max: xDomain[1],
        pixelSpan: width,
      }),
    [xDomain, width]
  );
  const maxYTickLength = yTickValues.reduce(
    (max, n) => Math.max(max, yTickFormat(n).length),
    0
  );
  const chartLeftPadding = maxYTickLength * 7;
  const chartPadding = getDefaultChartPadding(chartLeftPadding);
  const xTicks = useMemo(() => (xScale ? xScale.getTicks() : []), [xScale]);

  return (
    <Grid item style={{ width, height }}>
      <VictoryChart
        width={width}
        height={height}
        domainPadding={domainPadding}
        padding={chartPadding}
        theme={theme}
        containerComponent={
          <VictoryContainer
            style={{
              pointerEvents: "none",
              userSelect: "auto",
              touchAction: "auto",
            }}
          />
        }
      >
        <VictoryAxis
          key="x-axis"
          standalone={false}
          fixLabelOverlap
          orientation={"bottom"}
          domain={xDomain}
          tickValues={xTicks}
          tickFormat={(t, i) => (xScale ? xScale?.formatTick(t, i) : "")}
          style={{
            grid: {
              strokeDasharray: "",
              strokeWidth: 0,
            },
          }}
        />
        <VictoryAxis
          key="y-axis"
          standalone={false}
          dependentAxis
          crossAxis={false}
          tickValues={yTickValues}
          tickFormat={yTickFormat}
          orientation="left"
          style={{
            grid: {
              strokeDasharray: "",
              strokeWidth: 1,
            },
          }}
        />
        {children}
      </VictoryChart>
    </Grid>
  );
};
