import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination, {
  TablePaginationProps,
} from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { UniqueDatapoint } from "jm-castle-ac-dc-types/build";
import { CSSProperties, useEffect, useState } from "react";
import { DatapointStateRow } from "../types/RowTypes";
import { getDateFormatter, getDateFormatWithoutYear } from "../utils/Format";
import { TablePaginationActions } from "./TablePaginationActions";

interface TableSettings {
  rowsPerPage: number;
}

export interface DatapointHistoryTableProps {
  datapoints: Record<string, UniqueDatapoint>;
  data: DatapointStateRow[];
  cellSize?: "small" | "medium";
  containerStyle?: CSSProperties;
}

export const DatapointHistoryTable = (props: DatapointHistoryTableProps) => {
  const { datapoints, data, cellSize, containerStyle } = props;
  const [tableSettings, setTableSettings] = useState<TableSettings>({
    rowsPerPage: 20,
  });
  const { rowsPerPage } = tableSettings;
  const maxPage = Math.max(0, Math.ceil(data.length / rowsPerPage) - 1);
  const [page, setPage] = useState(0);
  useEffect(() => {
    setPage((previous) => {
      return Math.min(previous, maxPage);
    });
  }, [maxPage, rowsPerPage]);
  const usedPage = Math.min(page, maxPage);
  const visibleRows = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handlePageChange: TablePaginationProps["onPageChange"] = (
    event,
    newPage
  ) => setPage(newPage);
  const handleRowsPerPageChange: TablePaginationProps["onRowsPerPageChange"] = (
    event
  ) =>
    setTableSettings((previous) => ({
      ...previous,
      rowsPerPage: parseInt(event.target.value),
    }));
  const cellStyle: CSSProperties | undefined =
    cellSize === "small" ? { padding: 2 } : undefined;
  const atFormat = getDateFormatWithoutYear("second");
  const atFormatFunction = getDateFormatter({ format: atFormat });

  return (
    <TableContainer style={containerStyle} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[
                10,
                20,
                30,
                40,
                50,
                { label: "All", value: -1 },
              ]}
              colSpan={4}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={usedPage}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
          <TableRow>
            <TableCell>{"Datapoint"}</TableCell>
            <TableCell>{"changed at"}</TableCell>
            <TableCell align="center">{"Value"}</TableCell>
            <TableCell align="right">{"Unit"}</TableCell>
            <TableCell align="center">{"Executed"}</TableCell>
            <TableCell align="center">{"Success"}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((d, i) => {
            const { datapointId, at, valueDisplay, success, executed } = d;
            const datapoint = datapoints[datapointId];

            return (
              <TableRow key={i}>
                <TableCell style={cellStyle} size={cellSize}>
                  {datapointId}
                </TableCell>
                <TableCell style={cellStyle} size={cellSize} align="right">
                  {atFormatFunction(at)}
                </TableCell>
                <TableCell
                  style={cellStyle}
                  size={cellSize}
                  align={datapoint?.valueType === "string" ? "left" : "right"}
                >
                  {valueDisplay}
                </TableCell>
                <TableCell style={cellStyle} size={cellSize} align="right">
                  {datapoint ? datapoint.valueUnit : "???"}
                </TableCell>
                <TableCell style={cellStyle} size={cellSize} align="center">
                  {typeof executed === "boolean" ? (
                    executed ? (
                      <CheckIcon />
                    ) : (
                      <HighlightOffIcon />
                    )
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell style={cellStyle} size={cellSize} align="center">
                  {typeof success === "boolean" ? (
                    success ? (
                      <CheckIcon />
                    ) : (
                      <HighlightOffIcon />
                    )
                  ) : (
                    ""
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
