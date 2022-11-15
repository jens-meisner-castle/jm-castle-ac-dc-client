import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { DatapointState, UniqueDatapoint } from "jm-castle-ac-dc-types/build";
import { DateTime } from "luxon";
import { CSSProperties } from "react";
import { getDateFormatter, getNumberFormatter } from "../utils/Format";

const numberFormatter = getNumberFormatter({ decimals: 2 });

const dateFormatter = getDateFormatter({ level: "second" });

export interface ControlExecutionTableProps {
  deviceId: string;
  data: { datapoint: UniqueDatapoint; datapointState: DatapointState }[];
  success: boolean;
  error?: string;
  cellSize?: "small" | "medium";
  containerStyle?: CSSProperties;
}

export default function ControlExecutionTable(
  props: ControlExecutionTableProps
) {
  const { deviceId, data, cellSize, containerStyle, success, error } = props;
  const cellStyle: CSSProperties | undefined =
    cellSize === "small" ? { padding: 2 } : undefined;
  const luxonNow = DateTime.now();

  return (
    <TableContainer style={containerStyle} component={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              style={cellStyle}
              size={cellSize}
              component="th"
              scope="row"
              colSpan={3}
            >
              {deviceId}
            </TableCell>
          </TableRow>
          {data.map((d) => {
            const { datapoint, datapointState } = d;
            const { valueType } = datapoint;
            const { valueNum, valueString, at } = datapointState;
            const valueDisplay = datapoint
              ? datapoint.valueType === "number"
                ? numberFormatter(valueNum)
                : valueString
              : valueString || valueNum;
            const atRounded = Math.floor(at / 1000) * 1000;
            const luxonAt = DateTime.fromMillis(atRounded);
            const changedAtDisplay =
              luxonNow.day === luxonAt.day && luxonNow.month === luxonAt.month
                ? luxonAt.toFormat("HH:mm:ss")
                : dateFormatter(new Date(at));
            return (
              <TableRow key={d.datapoint.id}>
                <TableCell
                  style={cellStyle}
                  size={cellSize}
                  component="th"
                  scope="row"
                >
                  {d.datapoint.name}
                </TableCell>
                <TableCell
                  style={cellStyle}
                  size={cellSize}
                  align={valueType === "string" ? "left" : "right"}
                >
                  {valueDisplay}
                </TableCell>
                <TableCell style={cellStyle} size={cellSize} align="right">
                  {changedAtDisplay}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell
              style={cellStyle}
              size={cellSize}
              component="th"
              scope="row"
            >
              {success ? "Success" : "Error"}
            </TableCell>
            <TableCell
              align="left"
              style={cellStyle}
              size={cellSize}
              component="th"
              scope="row"
              colSpan={2}
            >
              {success ? (
                <CheckIcon />
              ) : (
                <>
                  <HighlightOffIcon />
                  <Typography>{error}</Typography>
                </>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
