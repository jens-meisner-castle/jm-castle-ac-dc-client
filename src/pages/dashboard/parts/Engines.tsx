import { Grid, Paper } from "@mui/material";
import { MutableRefObject, useCallback, useState } from "react";
import { EngineMiniStatus } from "../../../components/EngineMiniStatus";
import { backendApiUrl } from "../../../configuration/Urls";
import { useEngines } from "../../../hooks/useEngines";
import { UpdateFunction } from "../Types";

export interface EnginesContent {
  component: JSX.Element;
  update: UpdateFunction;
  error?: string;
}

export interface EnginesPartProps {
  children: (content: EnginesContent) => JSX.Element;
  updateRef?: MutableRefObject<UpdateFunction | null>;
  leftColumnWidth: number;
}

export const EnginesPart = (props: EnginesPartProps) => {
  const { children, leftColumnWidth, updateRef } = props;
  const [updateIndicator, setUpdateIndicator] = useState(1);
  const refreshStatus = useCallback(
    () => setUpdateIndicator((previous) => previous + 1),
    []
  );
  updateRef && (updateRef.current = refreshStatus);
  const { engines, error } = useEngines(backendApiUrl);

  return children({
    error,
    update: refreshStatus,
    component: (
      <Grid container direction="row">
        {engines &&
          engines.map((engine) => (
            <Grid key={engine.key} item>
              <Paper
                style={{ padding: 5, margin: 5, marginTop: 0, marginLeft: 0 }}
              >
                <EngineMiniStatus
                  updateIndicator={updateIndicator}
                  leftColumnWidth={leftColumnWidth}
                  width={350}
                  engine={engine}
                />
              </Paper>
            </Grid>
          ))}
      </Grid>
    ),
  });
};
