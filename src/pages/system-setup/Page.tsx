import { Grid, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExecuteSetupResponse } from "jm-castle-ac-dc-types/build/index";
import { AppAction, AppActions } from "../../components/AppActions";
import { SystemSetupResultComponent } from "../../components/SystemSetupResultComponent";
import { SystemSetupStatusComponent } from "../../components/SystemSetupStatusComponent";
import { TextComponent } from "../../components/TextComponent";
import { backendApiUrl } from "../../configuration/Urls";
import {
  ExecuteState,
  useExecuteSystemSetup,
} from "../../hooks/useExecuteSystemSetup";
import { useSystemSetupStatus } from "../../hooks/useSystemSetupStatus";

export const Page = () => {
  const [updateIndicator, setUpdateIndicator] = useState(1);
  const { status, error: statusError } = useSystemSetupStatus(
    backendApiUrl,
    updateIndicator
  );
  const [execution, setExecution] = useState<{
    setupResult: ExecuteSetupResponse["setup"] | undefined;
    state: ExecuteState;
  }>({ setupResult: undefined, state: "not started" });

  const { setup: hookResult, error: setupError } = useExecuteSystemSetup(
    backendApiUrl,
    execution.state
  );

  useEffect(() => {
    setExecution({ setupResult: hookResult, state: "not started" });
  }, [hookResult]);

  const startSetup = useCallback(() => {
    setExecution({ setupResult: undefined, state: "start" });
  }, []);
  const refreshStatus = useCallback(() => {
    setUpdateIndicator((previous) => previous + 1);
  }, []);

  const actions = useMemo(() => {
    const newActions: AppAction[] = [];
    newActions.push({ label: "Refresh", onClick: refreshStatus });
    newActions.push({ label: "SETUP", onClick: startSetup });
    return newActions;
  }, [refreshStatus, startSetup]);

  const leftColumnWidth = 200;
  const { setupResult } = execution;

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5">{"System (setup) status"}</Typography>
      </Grid>
      <Grid item>
        <Paper>
          <AppActions actions={actions} />
        </Paper>
      </Grid>
      {setupError && (
        <Grid item>
          <Paper>
            <Grid container direction="row">
              <Grid item style={{ width: leftColumnWidth }}>
                <Typography>{"Setup error"}</Typography>
              </Grid>
              <Grid item>
                <TextComponent value={setupError} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
      {statusError && (
        <Grid item>
          <Paper>
            <Grid container direction="row">
              <Grid item style={{ width: leftColumnWidth }}>
                <Typography>{"Status error"}</Typography>
              </Grid>
              <Grid item>
                <TextComponent value={statusError} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
      {setupResult && (
        <Grid item>
          <Paper>
            <SystemSetupResultComponent setupResult={setupResult} />
          </Paper>
        </Grid>
      )}
      <Grid item>
        <Paper>
          <SystemSetupStatusComponent status={status} />
        </Paper>
      </Grid>
    </Grid>
  );
};
