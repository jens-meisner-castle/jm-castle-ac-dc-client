import { Grid, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useCallback, useMemo, useState } from "react";
import { AppAction, AppActions } from "../../components/AppActions";
import { TextareaComponent } from "../../components/TextareaComponent";
import { TextComponent } from "../../components/TextComponent";
import { backendApiUrl } from "../../configuration/Urls";
import { useDatapointLogSelect } from "../../hooks/useDatapointLogSelect";

interface Filter {
  from: DateTime;
  to: DateTime;
}
const getNewFilter = (): Filter => ({
  from: DateTime.fromMillis(Date.now() - 3600 * 1000),
  to: DateTime.now(),
});

export const SelectFromDatapointLog = () => {
  const [indicatorSelect, setIndicatorSelect] = useState(0);
  const [filter, setFilter] = useState<Filter>(getNewFilter());
  const { error, result, errorDetails } = useDatapointLogSelect(
    backendApiUrl,
    filter.from,
    filter.to,
    indicatorSelect
  );
  const { rows, cmd } = result || {};
  const executeTest = useCallback(() => {
    setFilter(getNewFilter());
    setIndicatorSelect((previous) => (previous > 0 ? previous : previous + 1));
  }, []);
  const actions = useMemo(() => {
    const newActions: AppAction[] = [];
    newActions.push({
      label: "Execute",
      onClick: executeTest,
    });
    return newActions;
  }, [executeTest]);
  const leftColumnWidth = 200;

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5">
          {"Test: Select from datapoint_log"}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Controls"}</Typography>
          </Grid>
          <Grid item>
            <AppActions actions={actions} />
          </Grid>
        </Grid>
      </Grid>
      {error && (
        <Grid item>
          <TextComponent value={error} fullWidth multiline />
          {errorDetails && (
            <TextComponent value={errorDetails} fullWidth multiline />
          )}
        </Grid>
      )}
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Command"}</Typography>
          </Grid>
          <Grid item flexGrow={1}>
            <TextareaComponent
              value={cmd || ""}
              maxRows={10}
              style={{
                width: "90%",
                resize: "none",
                marginRight: 30,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Result (count of rows)"}</Typography>
          </Grid>
          <Grid item flexGrow={1}>
            <Typography>{rows ? rows.length : 0}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Result (rows)"}</Typography>
          </Grid>
          <Grid item flexGrow={1}>
            <TextareaComponent
              value={rows || ""}
              maxRows={10}
              style={{
                width: "90%",
                resize: "none",
                marginRight: 30,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
