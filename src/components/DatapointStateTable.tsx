import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { DateTime } from "luxon";
import { CSSProperties } from "react";
import { DatapointState, UniqueDatapoint } from "jm-castle-ac-dc-types/build";
import { getDateFormatter, getNumberFormatter } from "../utils/Format";

const numberFormatter = getNumberFormatter({ decimals: 2 });

const dateFormatter = getDateFormatter({ level: "second" });

export interface DatapointStateTableProps {
  data: { datapoint: UniqueDatapoint; datapointState: DatapointState }[];
  cellSize?: "small" | "medium";
  containerStyle?: CSSProperties;
}

export default function DatapointStateTable(props: DatapointStateTableProps) {
  const { data, cellSize, containerStyle } = props;
  const cellStyle: CSSProperties | undefined =
    cellSize === "small"
      ? { padding: 2 }
      : cellSize === "medium"
      ? { padding: 6, paddingTop: 2, paddingBottom: 2 }
      : undefined;
  const luxonNow = DateTime.now();

  return (
    <TableContainer style={containerStyle} component={Paper}>
      <Table>
        <TableBody>
          {data.map((d) => {
            const { datapoint, datapointState } = d;
            const { valueType, valueUnit } = datapoint;
            const { valueNum, valueString, at } = datapointState;
            const valueDisplay = datapoint
              ? datapoint.valueType === "number"
                ? numberFormatter(valueNum)
                : valueString
              : valueString || valueNum;
            const atRounded = Math.floor(at / 1000) * 1000;
            const atMsOnly = at - atRounded;
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
                  {valueUnit || valueType}
                </TableCell>
                <TableCell style={cellStyle} size={cellSize} align="right">
                  {changedAtDisplay}
                </TableCell>
                <TableCell style={cellStyle} size={cellSize} align="right">
                  {"." + atMsOnly}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
