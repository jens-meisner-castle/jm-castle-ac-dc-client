import { Grid, Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import {
  DatapointState,
  LocalDatapoint,
  UniqueDatapoint,
} from "jm-castle-ac-dc-types/dist/All.mjs";
import { getNumberFormatter } from "../utils/Format";

const numberFormatter = getNumberFormatter({ decimals: 2 });

export interface DatapointStateComponentProps {
  datapoint?: UniqueDatapoint | LocalDatapoint;
  state: DatapointState | undefined;
  leftColumnWidth?: number;
  variant?: Variant;
}

export const DatapointStateComponent = (
  props: DatapointStateComponentProps
) => {
  const { datapoint, state, leftColumnWidth, variant } = props;
  const { valueType, valueUnit, id: datapointId } = datapoint || {};
  const { id: stateId, valueNum, valueString } = state || {};
  const usedLeftColumnWidth = leftColumnWidth || 200;
  const valueUnitDisplay = valueUnit
    ? ` (${valueUnit})`
    : valueType
    ? ` (${valueType})`
    : undefined;
  const valueDisplay = datapoint
    ? datapoint.valueType === "number"
      ? numberFormatter(valueNum)
      : valueString
    : valueString || valueNum;

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: usedLeftColumnWidth }}>
            <Typography variant={variant}>{`${datapointId || stateId}${
              valueUnitDisplay || ""
            }`}</Typography>
          </Grid>
          <Grid item>
            <Typography variant={variant}>{valueDisplay}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
