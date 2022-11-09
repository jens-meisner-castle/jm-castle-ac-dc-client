import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { Box, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { CalendarOrClockPickerView } from "@mui/x-date-pickers/internals/models";
import { DateTime, DurationLike } from "luxon";
import { useCallback, useMemo } from "react";
import { UniqueDatapoint } from "jm-castle-ac-dc-types/dist/All.mjs";
import { getNewFilter } from "../utils/Filter";
import { getDateFormat } from "../utils/Format";
import { DatapointSelectionComponent } from "./DatapointSelectionComponent";
import { DatapointSelection } from "./DatapointSelectionMenu";
import { Filter } from "./Types";

const handleChangeDatePickerIgnored = (value: DateTime | null) =>
  1 > 2 && console.error("never", value);

export interface FilterComponentProps {
  filter: Filter;
  available?: { datapoints?: UniqueDatapoint[] };
  onChange?: (filter: Filter) => void;
}

export const FilterComponent = (props: FilterComponentProps) => {
  const { filter, available, onChange } = props;
  const { datapoints } = available || {};
  const datapointsSelection = useMemo(() => {
    const { datapointId: filteredDatapoints } = filter;
    const newSelection: DatapointSelection = datapoints
      ? datapoints.map((datapoint) => ({
          datapoint,
          selected: filteredDatapoints.includes(datapoint.id),
        }))
      : filteredDatapoints.map((id) => ({
          datapoint: { id, name: id, valueType: "string" },
          selected: true,
        }));
    return newSelection;
  }, [filter, datapoints]);
  const isDatapointsSelectionVisible = !!datapointsSelection.length;
  const handleDatapointSelection = useCallback(
    (newSelection: DatapointSelection) => {
      const datapointIds = newSelection
        .filter((sel) => sel.selected)
        .map((sel) => sel.datapoint.id);
      const newFilter = getNewFilter(
        filter,
        undefined,
        undefined,
        datapointIds
      );
      onChange && newFilter && onChange(newFilter);
    },
    [onChange, filter]
  );
  const setNewTimeInterval = useCallback(
    (from?: DateTime, to?: DateTime) => {
      const newFilter = getNewFilter(filter, from, to);
      onChange && newFilter && onChange(newFilter);
    },
    [filter, onChange]
  );
  const moveInterval = useCallback(
    (duration: DurationLike) => {
      const newFilter = getNewFilter(
        filter,
        filter.from.plus(duration),
        filter.to.plus(duration)
      );
      onChange && newFilter && onChange(newFilter);
    },
    [filter, onChange]
  );
  const handleNewDatePickerFrom = useCallback(
    (value: DateTime | null) =>
      value && value.isValid && setNewTimeInterval(value, undefined),
    [setNewTimeInterval]
  );
  const handleNewDatePickerTo = useCallback(
    (value: DateTime | null) =>
      value && value.isValid && setNewTimeInterval(undefined, value),
    [setNewTimeInterval]
  );
  const pickerViews = useMemo<CalendarOrClockPickerView[]>(
    () => ["day", "hours", "minutes"],
    []
  );

  return (
    <>
      <Grid container direction="row">
        <Grid item>
          <DateTimePicker
            value={filter.from}
            inputFormat={getDateFormat("minute")}
            ampmInClock={false}
            ampm={false}
            views={pickerViews}
            onChange={handleChangeDatePickerIgnored}
            onAccept={handleNewDatePickerFrom}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item>
          <DateTimePicker
            value={filter.to}
            inputFormat={getDateFormat("minute")}
            ampmInClock={false}
            ampm={false}
            views={pickerViews}
            onChange={handleChangeDatePickerIgnored}
            onAccept={handleNewDatePickerTo}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item alignContent={"center"}>
          <Box
            style={{
              display: "flex",
              alignContent: "center",
              height: "100%",
            }}
          >
            <Tooltip title={"Push the interval 1 hour into the future."}>
              <IconButton onClick={() => moveInterval({ hours: 1 })}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Push the interval 1 hour into the past."}>
              <IconButton onClick={() => moveInterval({ hours: -1 })}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Set the interval to [-1 hour, now]."}>
              <IconButton
                onClick={() =>
                  setNewTimeInterval(
                    DateTime.now().minus({ hours: 1 }).startOf("hour"),
                    DateTime.now()
                  )
                }
              >
                <ArrowDownwardIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item alignContent={"center"}>
          <Box
            style={{
              display: "flex",
              alignContent: "center",
              height: "100%",
            }}
          >
            <Tooltip title={"Push the interval 1 minute into the future."}>
              <IconButton onClick={() => moveInterval({ minutes: 1 })}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Push the interval 1 minute into the past."}>
              <IconButton onClick={() => moveInterval({ minutes: -1 })}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={"Set the interval to [-15 minutes, now]."}>
              <IconButton
                onClick={() =>
                  setNewTimeInterval(
                    DateTime.now().minus({ minutes: 15 }),
                    DateTime.now()
                  )
                }
              >
                <ArrowDownwardIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        {isDatapointsSelectionVisible && (
          <Grid item>
            <div
              style={{
                marginLeft: 10,
                display: "flex",
                alignContent: "center",
                height: "100%",
              }}
            >
              <DatapointSelectionComponent
                selection={datapointsSelection}
                onChange={handleDatapointSelection}
              />
            </div>
          </Grid>
        )}
      </Grid>
    </>
  );
};
