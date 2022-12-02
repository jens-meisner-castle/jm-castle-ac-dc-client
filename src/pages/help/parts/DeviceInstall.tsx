import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { Device } from "jm-castle-ac-dc-types/build";
import { useMemo, useState } from "react";
import { TextareaComponent } from "../../../components/TextareaComponent";

export const DeviceInstall = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const deviceConfig = useMemo(() => {
    const device: Device = {
      id: "shelly-plug-s-01",
      ipAddress: "192.168.178.30",
      webInterface: "http://192.168.178.30",
      api: "http://192.168.178.30",
      type: "shelly-1-pm",
    };
    return device;
  }, []);

  return (
    <Grid container direction="column">
      <Grid item>
        <Paper>
          <Typography component="span" variant="h6">
            {"Installing a new device"}
          </Typography>
          <IconButton onClick={() => setIsDetailsOpen((previous) => !previous)}>
            <MoreHorizIcon />
          </IconButton>
        </Paper>
      </Grid>
      {isDetailsOpen && (
        <>
          <Grid item>
            <Paper style={{ marginTop: 5 }}>
              <Typography>
                {
                  "Das Gerät muss zunächst im Netzwerk verfügbar sein. Ermitteln Sie die IP-Adresse des Geräts."
                }
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Paper style={{ marginTop: 5 }}>
              <Typography>
                {"Fügen Sie das Gerät nun in die Konfigurationsdatei ein."}
              </Typography>
            </Paper>
            <Grid item flexGrow={1}>
              <TextareaComponent
                style={{ width: "90%", resize: "none" }}
                value={deviceConfig}
                formatObject
              ></TextareaComponent>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};
