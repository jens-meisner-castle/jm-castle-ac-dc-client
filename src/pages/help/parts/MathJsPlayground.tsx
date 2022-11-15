import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import math, { all, create, isResultSet, Matrix } from "mathjs";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  AnyDataValue,
  DatapointState,
  SequenceState,
} from "jm-castle-ac-dc-types/build";
import { TextareaComponent } from "../../../components/TextareaComponent";
import { backendApiUrl } from "../../../configuration/Urls";
import { useSystemDatastate } from "../../../hooks/useSystemDatastate";

export const isDefined = (...values: Array<unknown>) =>
  values.every(
    (v) =>
      v !== null &&
      v !== undefined &&
      (typeof v !== "number" || !Number.isNaN(v))
  );

const getValueForRange = (
  value: number,
  rawLimits: number[],
  values: AnyDataValue[],
  ifNone: AnyDataValue
) => {
  if (rawLimits.length !== values.length) {
    throw new Error(
      `Limits and values must have the same length. limits: ${rawLimits}, values: ${values}`
    );
  }
  if (!value) {
    return ifNone;
  }
  const index = [...rawLimits]
    .sort((a, b) => a - b)
    .reverse()
    .findIndex((limit) => {
      return value >= limit;
    });
  const result = index > -1 ? values.reverse()[index] : ifNone;
  return result;
};

const getValueForMathJsRange = (
  value: number,
  limits: Matrix,
  values: Matrix,
  ifNone: AnyDataValue
) => {
  if (limits.size()[0] !== values.size()[0]) {
    throw new Error(
      `Limits and values must have the same length. limits: ${limits}, values: ${values}`
    );
  }
  if (!value) {
    return ifNone;
  }
  const size = limits.size()[0];
  const rawLimits: number[] = [];
  for (let i = 0; i < size; i++) {
    rawLimits.push(limits.get([i]));
  }
  const rawValues: AnyDataValue[] = [];
  for (let i = 0; i < size; i++) {
    rawValues.push(values.get([i]));
  }
  return getValueForRange(value, rawLimits, rawValues, ifNone);
};

export const extendMath = (imports: Record<string, unknown>) => {
  const importOptions: math.ImportOptions = {};
  const configOptions: math.ConfigOptions = {};
  const math = create(all, configOptions);
  math.import && math.import(imports, importOptions);
  return math;
};

interface PlaygroundState {
  source: {
    datapoints: Record<string, DatapointState>;
    sequences: Record<string, SequenceState>;
    tmp: Record<string, unknown>;
  };
  result: AnyDataValue;
  error?: string | null;
}

export interface MathJsPlaygroundProps {
  initialCode: string;
}

export const MathJsPlayground = (props: MathJsPlaygroundProps) => {
  const { initialCode } = props;
  const leftColumnWidth = 200;
  const [code, setCode] = useState(initialCode);
  const [debouncedCode] = useDebounce(code, 500);
  const { state } = useSystemDatastate(backendApiUrl, 1);
  const { datapointStates, sequenceStates, datapoints } = state || {};
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [playgroundState, setPlaygroundState] = useState<PlaygroundState>({
    result: undefined,
    source: { datapoints: {}, tmp: {}, sequences: {} },
  });
  useEffect(() => {
    if (datapointStates && sequenceStates) {
      setPlaygroundState((previous) => ({
        result: undefined,
        source: {
          datapoints: datapointStates,
          tmp: previous.source.tmp,
          sequences: sequenceStates,
        },
      }));
    }
  }, [datapointStates, sequenceStates]);
  const { source, result, error } = playgroundState;
  const resultDisplay = useMemo(
    () => JSON.stringify({ result, resultType: typeof result }),
    [result]
  );

  useEffect(() => {
    try {
      const getValue = (key: string) => {
        const state = source.datapoints[key];
        const point = datapoints ? datapoints[key] : undefined;
        return state && point
          ? point.valueType === "string"
            ? state.valueString
            : state.valueNum
          : undefined;
      };
      const math = extendMath({
        isDef: function (...value: unknown[]) {
          return isDefined(...value);
        },
        get: function (key: string) {
          return getValue(key);
        },
        valueForRange: function (
          value: number,
          limits: Matrix,
          values: Matrix,
          ifNone: AnyDataValue
        ) {
          return getValueForMathJsRange(value, limits, values, ifNone);
        },
      });
      if (!math.compile) {
        throw new Error(
          `Fatal error (math.compile is undefined): Unable to create evaluation function.`
        );
      }
      const evalFunction = math.compile(debouncedCode);
      const anyResult = evalFunction.evaluate(source);
      let newResult: AnyDataValue = undefined;
      if (isResultSet(anyResult)) {
        try {
          const resultArr: AnyDataValue[] = anyResult.valueOf();
          newResult = resultArr.length
            ? resultArr[resultArr.length - 1]
            : undefined;
          setPlaygroundState((previous) => ({
            source: previous.source,
            result: newResult,
            error: null,
          }));
        } catch (error) {
          console.error(
            `Unexpected result of evaluating math node: ${newResult}`
          );
        }
      } else {
        newResult = anyResult;
        setPlaygroundState((previous) => ({
          source: previous.source,
          result: newResult,
          error: null,
        }));
      }
    } catch (error: unknown) {
      setPlaygroundState((previous) => ({
        source: previous.source,
        result: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (error as any).toString(),
      }));
    }
  }, [debouncedCode, source, datapoints]);

  return (
    <Grid container direction="column">
      <Grid item>
        <Paper>
          <Typography component="span" variant="h6">
            {"Math.js playground"}
          </Typography>
          <IconButton onClick={() => setIsDetailsOpen((previous) => !previous)}>
            <MoreHorizIcon />
          </IconButton>
        </Paper>
      </Grid>
      {isDetailsOpen && (
        <>
          <Grid item>
            <Paper>
              <Grid container direction="row">
                <Grid item style={{ width: leftColumnWidth }}>
                  <Typography>{"Source datapoints"}</Typography>
                </Grid>
                <Grid item flexGrow={1}>
                  <TextareaComponent
                    value={source.datapoints}
                    style={{
                      width: "90%",
                      resize: "none",
                      marginRight: 30,
                    }}
                    formatObject
                    maxRows={20}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Grid container direction="row">
                <Grid item style={{ width: leftColumnWidth }}>
                  <Typography>{"Source sequences"}</Typography>
                </Grid>
                <Grid item flexGrow={1}>
                  <TextareaComponent
                    value={source.sequences}
                    style={{
                      width: "90%",
                      resize: "none",
                      marginRight: 30,
                    }}
                    formatObject
                    maxRows={20}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Paper style={{ padding: 10 }}>
              <Grid container direction="row">
                <Grid item style={{ width: leftColumnWidth }}>
                  <Typography>{"Code"}</Typography>
                </Grid>
                <Grid item flexGrow={1}>
                  <TextField
                    style={{ width: "90%" }}
                    variant="outlined"
                    label="Your code"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </>
      )}
      {isDetailsOpen && error && (
        <Grid item>
          <Paper>
            <Grid container direction="row">
              <Grid item style={{ width: leftColumnWidth }}>
                <Typography>{"Error"}</Typography>
              </Grid>
              <Grid item flexGrow={1}>
                <TextareaComponent
                  value={error}
                  style={{
                    width: "90%",
                    resize: "none",
                    marginRight: 30,
                  }}
                  formatObject
                  maxRows={2}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
      {isDetailsOpen && (
        <Grid item>
          <Paper>
            <Grid container direction="row">
              <Grid item style={{ width: leftColumnWidth }}>
                <Typography>{"Result"}</Typography>
              </Grid>
              <Grid item flexGrow={1}>
                <TextareaComponent
                  value={resultDisplay}
                  style={{
                    width: "90%",
                    resize: "none",
                    marginRight: 30,
                  }}
                  formatObject
                  maxRows={5}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};
