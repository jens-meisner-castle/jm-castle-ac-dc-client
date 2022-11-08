import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { DeviceTypeComponent } from "../../../components/DeviceTypeComponent";
import { backendApiUrl } from "../../../configuration/Urls";
import { useDeviceTypes } from "../../../hooks/useDeviceTypes";

export const DeviceTypes = () => {
  const { deviceTypes, error } = useDeviceTypes(backendApiUrl);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <Grid container direction="column">
      <Grid item>
        <Paper>
          <Typography component="span" variant="h6">
            {"Supported Device Types"}
          </Typography>
          <IconButton onClick={() => setIsDetailsOpen((previous) => !previous)}>
            <MoreHorizIcon />
          </IconButton>
        </Paper>
      </Grid>
      {error && (
        <Grid item>
          <Typography>{error}</Typography>
        </Grid>
      )}
      {isDetailsOpen && (
        <Grid item>
          <Grid container direction="column">
            {deviceTypes &&
              deviceTypes.map((type) => (
                <Grid key={type.id} item>
                  <Paper style={{ marginTop: 5 }}>
                    <DeviceTypeComponent deviceType={type} />
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
