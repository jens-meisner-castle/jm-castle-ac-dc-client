import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { EngineControlResponse, SerializableEngine } from "../api-types/Types";
import { backendApiUrl } from "../configuration/Urls";
import { useEngineAction } from "../hooks/useEngineAction";

export interface EngineActionControlProps {
  engine: SerializableEngine;
}

export const EngineActionControl = (props: EngineActionControlProps) => {
  const { engine } = props;
  const { actions, key } = engine;
  const actionParts = useMemo(() => {
    const newParts = Object.entries(actions).map(([k, spec]) => {
      const { name } = spec;
      return { type: "button", name, id: k };
    });
    return newParts;
  }, [actions]);
  const [actionId, setActionId] = useState<string | undefined>(undefined);
  const [latestResponse, setLatestResponse] = useState<
    EngineControlResponse | undefined
  >(undefined);
  const { status, response, error } = useEngineAction(
    backendApiUrl,
    engine.key,
    actionId
  );
  useEffect(() => {
    if (status === "finished") {
      setLatestResponse(
        response || {
          success: false,
          error:
            error ||
            "Fatal: useEngineAction must return a response or an error.",
        }
      );
      setActionId(undefined);
    }
  }, [status, response, error]);
  const executeAction = (actionId: string) => {
    setLatestResponse(undefined);
    setActionId(actionId);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography>{key}</Typography>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          {actionParts.map((part) => (
            <Grid key={part.id} item>
              <Button
                variant="contained"
                onClick={() => executeAction(part.id)}
                disabled={status === "inProgress"}
              >
                {part.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {latestResponse && (
        <Grid item>
          {latestResponse.success ? <CheckIcon /> : <HighlightOffIcon />}
          {latestResponse.error && (
            <Typography>{latestResponse.error}</Typography>
          )}
        </Grid>
      )}
    </Grid>
  );
};
