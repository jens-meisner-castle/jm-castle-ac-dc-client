import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Divider, Grid, IconButton, Typography } from "@mui/material";
import { SerializableDeviceType } from "jm-castle-ac-dc-types/build";
import { TextareaComponent } from "jm-castle-components/build";
import { useMemo, useState } from "react";
import { DatapointComponent } from "./DatapointComponent";

export interface DeviceTypeComponentProps {
  deviceType: SerializableDeviceType;
}

export const DeviceTypeComponent = (props: DeviceTypeComponentProps) => {
  const { deviceType } = props;
  const { id, name, datapoints, examples, description } = deviceType;
  const [isDatapointsOpen, setIsDatapointsOpen] = useState(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const datapointsArr = useMemo(
    () =>
      datapoints
        ? Object.keys(datapoints)
            .sort()
            .map((k) => datapoints[k])
        : undefined,
    [datapoints]
  );
  const leftColumnWidth = 200;
  const canOpenDatapoints = !!datapointsArr?.length;
  const showDatapoints = canOpenDatapoints && isDatapointsOpen;
  const canOpenExamples = !!examples?.length;
  const showExamples = canOpenExamples && isExamplesOpen;

  return (
    <Grid container direction="column">
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Device type (id)"}</Typography>
          </Grid>
          <Grid item>
            <Typography>{id}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item style={{ width: leftColumnWidth }}>
            <Typography>{"Name"}</Typography>
          </Grid>
          <Grid item>
            <Typography>{name}</Typography>
          </Grid>
        </Grid>
      </Grid>
      {description && (
        <Grid item>
          <Grid container direction="row">
            <Grid item style={{ width: leftColumnWidth }}>
              <Typography>{"Beschreibung"}</Typography>
            </Grid>
            <Grid item flexGrow={1} flexShrink={1}>
              <Typography>{description}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Typography component="span">{"Datapoints"}</Typography>
        {canOpenDatapoints && (
          <IconButton
            onClick={() => setIsDatapointsOpen((previous) => !previous)}
          >
            <MoreHorizIcon />
          </IconButton>
        )}
      </Grid>
      {showDatapoints &&
        datapointsArr.map((datapoint) => (
          <Grid key={datapoint.id} item>
            <Divider />
            <DatapointComponent datapoint={datapoint} />
          </Grid>
        ))}
      <Grid item>
        <Typography component="span">{"Examples"}</Typography>
        {canOpenExamples && (
          <IconButton
            onClick={() => setIsExamplesOpen((previous) => !previous)}
          >
            <MoreHorizIcon />
          </IconButton>
        )}
      </Grid>
      {showExamples &&
        examples.map((device, i) => (
          <Grid key={i} item>
            <TextareaComponent
              value={device}
              formatObject
              maxRows={15}
              style={{
                width: "90%",
                resize: "none",
                marginRight: 30,
              }}
            />
          </Grid>
        ))}
    </Grid>
  );
};
