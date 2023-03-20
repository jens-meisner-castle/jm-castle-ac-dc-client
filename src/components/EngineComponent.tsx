import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { SerializableEngine } from "jm-castle-ac-dc-types/build";
import {
  AppAction,
  AppActions,
  TextareaComponent,
} from "jm-castle-components/build";
import { DateTime } from "luxon";
import { useCallback, useMemo, useState } from "react";
import { backendApiUrl } from "../configuration/Urls";
import { ControlAction, useEngineControls } from "../hooks/useEngineControls";
import { useEngineStatus } from "../hooks/useEngineStatus";
import { getDateFormat } from "../utils/Format";

export interface EngineComponentProps {
  engine: SerializableEngine;
}

export const EngineComponent = (props: EngineComponentProps) => {
  const { engine } = props;
  const { key, settings, actions: engineActions } = engine;
  const { lapDuration } = settings;
  const [updateIndicator, setUpdateIndicator] = useState(1);
  const [action, setAction] = useState<ControlAction>("none");
  const {
    action: actionInProgress,
    error: actionError,
    response: actionResponse,
  } = useEngineControls(backendApiUrl, key, action);
  const isWaitingForActionResponse =
    actionInProgress !== action ||
    (action !== "none" && !actionError && !actionResponse);
  const startEngine = useCallback(() => {
    setAction("start");
  }, []);
  const stopEngine = useCallback(() => {
    setAction("stop");
  }, []);
  const refreshStatus = useCallback(
    () => setUpdateIndicator((previous) => previous + 1),
    []
  );
  const engineActionsDisplay = useMemo(() => {
    const actionKeys = Object.keys(engineActions);
    if (!actionKeys.length) {
      return undefined;
    }
    return actionKeys.join(", ");
  }, [engineActions]);
  const { error: statusError, status } = useEngineStatus(
    backendApiUrl,
    key,
    updateIndicator
  );
  const {
    running,
    lastStartedAt,
    lastLapEndAt,
    duration,
    errors: errorsPerLap,
  } = status || {};
  const [isErrorDetailsOpen, setIsErrorDetailsOpen] = useState(false);
  const lastErrorAtLap =
    errorsPerLap && errorsPerLap.length
      ? errorsPerLap[errorsPerLap.length - 1].lap
      : undefined;
  const { consumed, laps } = duration || {};
  const actions = useMemo(() => {
    const newActions: AppAction[] = [];
    newActions.push({
      label: (
        <Tooltip title="Daten aktualisieren">
          <RefreshIcon />
        </Tooltip>
      ),
      onClick: refreshStatus,
    });
    newActions.push({
      label: "Start",
      onClick: startEngine,
      disabled: isWaitingForActionResponse,
    });
    newActions.push({
      label: "Stop",
      onClick: stopEngine,
      disabled: isWaitingForActionResponse,
    });
    return newActions;
  }, [refreshStatus, startEngine, stopEngine, isWaitingForActionResponse]);
  const currentActionFeedback = isWaitingForActionResponse
    ? `waiting for response to ${actionInProgress}`
    : actionInProgress !== "none"
    ? `response for ${actionInProgress} was ${
        actionResponse?.error || actionResponse?.success
      }`
    : "no action in progress";
  const leftColumnWidth = 250;

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Engine (key)"}</Typography>
          </Grid>
          <Grid item>
            <Typography>{key}</Typography>
          </Grid>
        </Grid>
      </Grid>
      {engineActionsDisplay && (
        <Grid item>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{"Actions"}</Typography>
            </Grid>
            <Grid item>
              <Typography>{engineActionsDisplay}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
      {lapDuration > 0 && (
        <Grid item>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{"Lap duration"}</Typography>
            </Grid>
            <Grid item>
              <Typography>
                {typeof lapDuration === "number"
                  ? `${lapDuration.toString()} (${Math.floor(
                      lapDuration / 1000
                    )} seconds)`
                  : "unknown"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Controls"}</Typography>
          </Grid>
          <Grid item>
            <AppActions actions={actions} />
            <Typography>{currentActionFeedback}</Typography>
          </Grid>
        </Grid>
      </Grid>
      {statusError && (
        <Grid item>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{"Current status error"}</Typography>
            </Grid>
            <Grid item style={{ maxWidth: 800 }}>
              <Typography>{statusError}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Last error at lap"}</Typography>
            {errorsPerLap && Object.keys(errorsPerLap).length ? (
              <IconButton
                onClick={() => setIsErrorDetailsOpen((previous) => !previous)}
              >
                <MoreHorizIcon />
              </IconButton>
            ) : null}
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            <Typography>{lastErrorAtLap || "never"}</Typography>
          </Grid>
        </Grid>
      </Grid>
      {isErrorDetailsOpen && errorsPerLap && (
        <Grid item>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{"Error"}</Typography>
            </Grid>
            <Grid item flexGrow={1}>
              <TextareaComponent
                value={errorsPerLap}
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
        </Grid>
      )}
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Run state"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            {running ? <CheckIcon /> : <HighlightOffIcon />}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Last start at"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            <Typography>
              {lastStartedAt
                ? DateTime.fromMillis(lastStartedAt).toFormat(
                    getDateFormat("second")
                  )
                : "never"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Count of laps"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            <Typography>{laps ? laps.toLocaleString() : "0"}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Last lap at"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            <Typography>
              {lastLapEndAt
                ? DateTime.fromMillis(lastLapEndAt).toFormat(
                    getDateFormat("second")
                  )
                : "never"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Average ms per lap (total)"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            <Typography>
              {laps && consumed?.total
                ? `${Math.round(consumed.total / laps).toLocaleString()} (${
                    consumed.total
                  })`
                : "0"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Average ms per lapEnd (total)"}</Typography>
          </Grid>
          <Grid item style={{ maxWidth: 800 }}>
            <Typography>
              {laps && consumed?.lapEnd
                ? `${Math.round(consumed.lapEnd / laps).toLocaleString()} (${
                    consumed.lapEnd
                  })`
                : "0"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
