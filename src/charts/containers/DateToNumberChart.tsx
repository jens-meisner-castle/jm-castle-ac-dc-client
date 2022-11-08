import { Grid } from "@mui/material";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { Tuple, VictoryAxis, VictoryChart, VictoryContainer } from "victory";
import { victoryThemeMaterial } from "../../theme/VictoryTheme";
import { IScaleDate } from "../scales/IScaleDate";
import { getDefaultChartPadding } from "./ChartLayout";

export interface DateToNumberChartProps {
  width: number;
  height: number;
  xDomain: Tuple<Date>;
  yLabel?: string;
  children: ReactNode;
}

export const DateToNumberChart = (
  props: PropsWithChildren<DateToNumberChartProps>
) => {
  const { width, height, xDomain, children, yLabel } = props;
  const chartPadding = getDefaultChartPadding(60);
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
          label={yLabel}
          standalone={false}
          dependentAxis
          crossAxis={false}
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
