import { Grid, Paper, Typography } from "@mui/material";
import { EngineComponent } from "../../components/EngineComponent";
import { TextComponent } from "../../components/TextComponent";
import { backendApiUrl } from "../../configuration/Urls";
import { useEngines } from "../../hooks/useEngines";

export const Page = () => {
  const { engines, error } = useEngines(backendApiUrl);

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5">{"All engines"}</Typography>
      </Grid>
      {error && (
        <Grid item>
          <TextComponent value={error} />
        </Grid>
      )}
      {engines &&
        engines.map((engine, i) => (
          <Grid key={engine.key} item>
            <Paper style={{ marginTop: i > 0 ? 5 : 0 }}>
              <EngineComponent engine={engine} />
            </Paper>
          </Grid>
        ))}
    </Grid>
  );
};
