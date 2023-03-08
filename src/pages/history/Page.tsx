import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { Grid, Paper, Tooltip, Typography } from "@mui/material";
import {
  getCategoryOfUnit,
  Row_AnyLog,
  UniqueDatapoint,
} from "jm-castle-ac-dc-types/build";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Tuple } from "victory";
import { ChartChildType } from "../../charts/children/ChartChild";
import { DatapointChartChildProps } from "../../charts/children/DatapointChartChild";
import {
  DatapointsChart,
  DatapointsChartProps,
} from "../../charts/containers/DatapointsChart";
import { AppAction, AppActions } from "../../components/AppActions";
import { DatapointHistoryTable } from "../../components/DatapointHistoryTable";
import { backendApiUrl } from "../../configuration/Urls";
import { FilterComponent } from "../../filter/FilterComponent";
import { Filter } from "../../filter/Types";
import { useDatapointControlLogSelect } from "../../hooks/useDatapointControlLogSelect";
import { useDatapointLogSelect } from "../../hooks/useDatapointLogSelect";
import { usePersistentDatapoints } from "../../hooks/usePersistentDatapoints";
import { DatapointStateRow } from "../../types/RowTypes";
import {
  makeChartColorAccessOnControlLog,
  makeChartColorAccessOnDatapointLog,
} from "../../utils/Color";
import { getNewFilter } from "../../utils/Filter";
import { getNumberFormatter } from "../../utils/Format";
import {
  loadFilterForPage,
  loadOptionsForPage,
  storeFilterForPage,
  storeOptionsForPage,
} from "../../utils/LocalStorage";
import { getNewOptions, PageOptions } from "./parts/OptionsComponent";
import { OptionsMenu } from "./parts/OptionsMenu";

export const pageUrl = "/history";

const numberFormatter = getNumberFormatter({ decimals: 2 });

export const Page = () => {
  const [pageOptions, setPageOptions] = useState(
    getNewOptions(loadOptionsForPage(pageUrl) || {})
  );
  const handleNewOptions = useCallback((newOptions: Partial<PageOptions>) => {
    let mergedOptions: PageOptions | Partial<PageOptions> = {};
    setPageOptions((previous) => {
      mergedOptions = { ...previous, ...newOptions };
      return { ...previous, ...newOptions };
    });
    mergedOptions && storeOptionsForPage(mergedOptions, pageUrl);
  }, []);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const optionsSelectionRef = useRef<HTMLButtonElement | null>(null);

  const { chartWidthFactor, isTableVisible } = pageOptions;
  const initialFilter = useMemo(
    () => getNewFilter(loadFilterForPage(pageUrl)),
    []
  );
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const handleFilterChange = useCallback((newFilter: Filter) => {
    storeFilterForPage(newFilter, pageUrl);
    setFilter(newFilter);
  }, []);
  const ref = useRef<HTMLDivElement | null>(null);
  const [indicatorSelect, setIndicatorSelect] = useState(1);

  const [width, setWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    const newWidth = ref.current ? ref.current.offsetWidth : undefined;
    newWidth && setWidth(newWidth);
  }, [indicatorSelect]);
  const chartsPerRow = width
    ? width > 1800
      ? 4
      : width > 1400
      ? 3
      : width > 900
      ? 2
      : 1
    : 1;
  const usedWidth = width ? width - 20 : undefined;
  const calculatedChartWidth = usedWidth
    ? Math.floor(usedWidth / chartsPerRow)
    : undefined;
  const chartHeight =
    calculatedChartWidth && Math.min(Math.round(calculatedChartWidth / 2), 500);
  const chartWidth = calculatedChartWidth
    ? calculatedChartWidth * chartWidthFactor
    : undefined;
  const maxTableWidth =
    usedWidth && calculatedChartWidth && isTableVisible
      ? Math.min(usedWidth, calculatedChartWidth * 1.5)
      : undefined;
  const tableHeight = chartHeight ? 3 * chartHeight : 250;
  const restWidthForAllCharts =
    usedWidth && maxTableWidth ? usedWidth - maxTableWidth : undefined;
  const usedWidthForAllCharts =
    restWidthForAllCharts && chartWidth
      ? restWidthForAllCharts > chartWidth
        ? restWidthForAllCharts
        : usedWidth
      : undefined;

  const { datapoints: datapointsArr } = usePersistentDatapoints(backendApiUrl);
  const datapointsHash = useMemo(() => {
    const newHash: Record<string, UniqueDatapoint> = {};
    datapointsArr &&
      datapointsArr.forEach((datapoint) => (newHash[datapoint.id] = datapoint));
    return newHash;
  }, [datapointsArr]);
  const availableFilterValues = useMemo(
    () => ({ datapoints: datapointsArr }),
    [datapointsArr]
  );

  const xDomain = useMemo((): Tuple<Date> => {
    return [filter.from.toJSDate(), filter.to.toJSDate()];
  }, [filter]);
  const { error: selectError1, result: selectResultDatapointLog } =
    useDatapointLogSelect(
      backendApiUrl,
      filter.from,
      filter.to,
      indicatorSelect
    );
  const { error: selectError2, result: selectResultControlLog } =
    useDatapointControlLogSelect(
      backendApiUrl,
      filter.from,
      filter.to,
      indicatorSelect
    );
  const valueDisplayFn = (row: Row_AnyLog, datapoint: UniqueDatapoint) => {
    switch (datapoint.valueType) {
      case "number":
        return numberFormatter(row.value_num);
      case "boolean":
        return row.value_string || "???";
      default:
        return (
          row.value_string ||
          (row.value_num ? row.value_num.toLocaleString() : "???")
        );
    }
  };
  const { rowsPerDatapoint, tableData } = useMemo(() => {
    const newTableData: DatapointStateRow[] = [];
    const newPerDatapoint: Record<
      string,
      {
        rows: Row_AnyLog[];
        datapoint: UniqueDatapoint;
        chartChildType?: ChartChildType;
        pointSize?: number;
        pointBorderSize?: number;
        color?: string;
        chartColorsForRow?: DatapointChartChildProps["chartColorsForRow"];
      }
    > = {};
    const forEachRow = (
      row: Row_AnyLog,
      chartChildType: ChartChildType | undefined,
      chartChildAttributes: { pointSize?: number; pointBorderSize?: number },
      makeChartColorsForRow?: (
        datapoint: UniqueDatapoint
      ) => string | DatapointChartChildProps["chartColorsForRow"]
    ) => {
      const { pointSize, pointBorderSize } = chartChildAttributes;
      const passFilter = filter.datapointId.includes(row.datapoint_id);
      if (passFilter) {
        const datapoint = datapointsHash[row.datapoint_id];
        if (datapoint) {
          const executed =
            typeof row.executed === "number" ? row.executed === 1 : undefined;
          const success =
            typeof row.success === "number" ? row.success === 1 : undefined;
          const atSeconds =
            typeof row.changed_at === "number" ? row.changed_at : row.logged_at;
          const atMs =
            typeof row.changed_at_ms === "number"
              ? row.changed_at_ms
              : row.logged_at_ms;
          newTableData.push({
            datapointId: datapoint.id,
            at: new Date(atSeconds * 1000),
            atMs,
            loggedAt: new Date(row.logged_at * 1000),
            loggedAtMs: row.logged_at_ms,
            valueDisplay: valueDisplayFn(row, datapoint),
            success,
            executed,
          });
          if (!newPerDatapoint[row.datapoint_id]) {
            const chartColorsForRow = makeChartColorsForRow
              ? makeChartColorsForRow(datapoint)
              : undefined;
            newPerDatapoint[row.datapoint_id] = {
              rows: [],
              datapoint,
              chartChildType,
              pointSize,
              pointBorderSize,
              color:
                typeof chartColorsForRow === "string"
                  ? chartColorsForRow
                  : undefined,
              chartColorsForRow:
                typeof chartColorsForRow === "function"
                  ? chartColorsForRow
                  : undefined,
            };
          }
          newPerDatapoint[row.datapoint_id].rows.push(row);
        }
      }
    };
    selectResultDatapointLog?.rows?.forEach((row) =>
      forEachRow(
        row,
        undefined,
        { pointSize: 2 },
        makeChartColorAccessOnDatapointLog
      )
    );
    selectResultControlLog?.rows?.forEach((row) =>
      forEachRow(
        row,
        "points",
        { pointSize: 6, pointBorderSize: 3 },
        makeChartColorAccessOnControlLog
      )
    );
    newTableData.sort((a, b) =>
      a.at === b.at
        ? a.datapointId.localeCompare(b.datapointId)
        : a.at.getTime() - b.at.getTime()
    );
    return {
      rowsPerDatapoint: newPerDatapoint,
      tableData: newTableData,
    };
  }, [
    filter,
    selectResultDatapointLog,
    selectResultControlLog,
    datapointsHash,
  ]);

  const { dataPerChart } = useMemo(() => {
    const newPerChart: {
      data: DatapointsChartProps["data"];
      tooltip: string;
      heading: string;
      width: number | undefined;
      height: number | undefined;
      type: DatapointsChartProps["type"];
    }[] = [];
    const booleanDatapoints: UniqueDatapoint[] = [];
    const booleanChart: typeof newPerChart[number] = {
      data: {},
      tooltip: "datapoints of type boolean",
      heading: "on / off",
      height: undefined,
      width:
        chartWidth && usedWidth
          ? Math.min(usedWidth, 2 * chartWidth)
          : undefined,
      type: {
        id: "date-to-string",
        yTickFormat: (y) => booleanDatapoints[y - 1]?.name || "?",
        yTickValues: [],
        yOffsetFn: (i) => i + 1,
      },
    };

    Object.keys(rowsPerDatapoint)
      .sort()
      .forEach((k) => {
        const data = rowsPerDatapoint[k];
        const { datapoint, rows } = data;
        const { valueType, valueUnit, name, id: datapointId } = datapoint;
        rows.sort((a, b) => a.logged_at - b.logged_at);
        if (valueType === "boolean") {
          booleanChart.data[k] = data;
          booleanDatapoints.push(datapoint);
        } else {
          const firstY = rows[0]?.value_num || 0;
          const yOffsetFn =
            valueUnit && getCategoryOfUnit(valueUnit) === "energy"
              ? () => -firstY
              : undefined;
          const heading = `${name} (${valueUnit || valueType})`;
          const tooltip = `id: ${datapointId}${
            yOffsetFn ? ", offset: " + yOffsetFn() : ""
          }`;
          const perChart: typeof newPerChart[number] = {
            data: {},
            tooltip,
            heading,
            width: chartWidth,
            height: chartHeight,
            type: { id: "date-to-number", yOffsetFn },
          };
          perChart.data[k] = data;
          newPerChart.push(perChart);
        }
      });
    if (Object.keys(booleanChart.data).length) {
      booleanDatapoints.forEach((datapoint, i) =>
        booleanChart.type.yTickValues?.push(i + 1)
      );
      chartHeight &&
        (booleanChart.height =
          chartHeight * Math.ceil(Object.keys(booleanChart.data).length / 7));
      return { dataPerChart: [booleanChart, ...newPerChart] };
    } else {
      return { dataPerChart: newPerChart };
    }
  }, [rowsPerDatapoint, usedWidth, chartWidth, chartHeight]);

  const executeSelect = useCallback(() => {
    setIndicatorSelect((previous) => previous + 1);
  }, []);

  const actions = useMemo(() => {
    const newActions: AppAction[] = [];
    newActions.push({
      label: (
        <Tooltip title="Daten aktualisieren">
          <RefreshIcon />
        </Tooltip>
      ),
      onClick: executeSelect,
    });
    newActions.push({
      label: <SettingsApplicationsIcon />,
      onClick: () => setIsOptionsVisible((previous) => !previous),
      elementRef: optionsSelectionRef,
    });
    return newActions;
  }, [executeSelect]);

  return (
    <>
      {isOptionsVisible && (
        <OptionsMenu
          options={pageOptions}
          onChange={handleNewOptions}
          onClose={() => setIsOptionsVisible(false)}
          anchorEl={optionsSelectionRef.current}
        />
      )}
      <div ref={ref} style={{ width: "100%" }} />
      {chartWidth && chartHeight && (
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h5">{"History"}</Typography>
          </Grid>
          <Grid item>
            <Paper>
              <AppActions actions={actions} />
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <FilterComponent
                filter={filter}
                available={availableFilterValues}
                onChange={handleFilterChange}
              />
            </Paper>
          </Grid>
          {selectError1 && (
            <Grid item>
              <Typography>{selectError1}</Typography>
            </Grid>
          )}
          {selectError2 && (
            <Grid item>
              <Typography>{selectError2}</Typography>
            </Grid>
          )}
          <Grid container direction="row">
            {isTableVisible && (
              <Grid item style={{ width: maxTableWidth }}>
                <DatapointHistoryTable
                  datapoints={datapointsHash}
                  data={tableData}
                  cellSize="small"
                  containerStyle={{
                    maxWidth: maxTableWidth,
                    height: tableHeight,
                  }}
                />
              </Grid>
            )}
            <Grid item style={{ width: usedWidthForAllCharts }}>
              <Grid container direction="row">
                {dataPerChart.map((perChart, i) => {
                  const { data, tooltip, heading, type, width, height } =
                    perChart;
                  return (
                    <Grid key={i} item>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {
                          <Tooltip title={tooltip}>
                            <Typography component="span">{heading}</Typography>
                          </Tooltip>
                        }
                        {
                          <DatapointsChart
                            data={data}
                            type={type}
                            width={width || chartWidth}
                            height={height || chartHeight}
                            xDomain={xDomain}
                          />
                        }
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};
