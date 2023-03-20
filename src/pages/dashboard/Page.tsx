import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { Grid, Paper, Tooltip, Typography } from "@mui/material";
import { AppAction, AppActions } from "jm-castle-components/build";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { backendApiUrl } from "../../configuration/Urls";
import {
  DatapointSelection,
  DatapointSelectionMenu,
} from "../../filter/DatapointSelectionMenu";
import { useDatastateDatapoints } from "../../hooks/useDatastateDatapoints";
import { useDeviceControlDatapoints } from "../../hooks/useDeviceControlDatapoints";
import {
  loadFilterForPage,
  loadOptionsForPage,
  storeFilterForPage,
  storeOptionsForPage,
} from "../../utils/LocalStorage";
import { ControlPanel } from "./parts/ControlPanel";
import { ControlsHistory } from "./parts/ControlsHistory";
import { DatastatePart } from "./parts/Datastate";
import { DevicesPart } from "./parts/Devices";
import { EnginesPart } from "./parts/Engines";
import { getNewOptions, PageOptions } from "./parts/OptionsComponent";
import { OptionsMenu } from "./parts/OptionsMenu";
import { UpdateFunction } from "./Types";

export const pageUrl = "/dashboard";

export const Page = () => {
  const [pageOptions, setPageOptions] = useState(
    getNewOptions(loadOptionsForPage(pageUrl) || {})
  );
  const {
    isDevicesVisible,
    isEnginesVisible,
    isControlHistoryVisible,
    isControlPanelVisible,
    isDatastateVisible,
  } = pageOptions;
  const handleNewOptions = useCallback((newOptions: Partial<PageOptions>) => {
    let mergedOptions: PageOptions | Partial<PageOptions> = {};
    setPageOptions((previous) => {
      mergedOptions = { ...previous, ...newOptions };
      return { ...previous, ...newOptions };
    });
    mergedOptions && storeOptionsForPage(mergedOptions, pageUrl);
  }, []);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const optionsSelectionRef = useRef<HTMLButtonElement | null>(null);

  const [isDatapointSelectionVisible, setIsDatapointSelectionVisible] =
    useState(false);
  const [isControlSelectionVisible, setIsControlSelectionVisible] =
    useState(false);
  const enginesUpdateRef = useRef<UpdateFunction | null>(null);
  const devicesUpdateRef = useRef<UpdateFunction | null>(null);
  const stateUpdateRef = useRef<UpdateFunction | null>(null);
  const datapointSelectionRef = useRef<HTMLButtonElement | null>(null);
  const controlSelectionRef = useRef<HTMLButtonElement | null>(null);
  const { error: errorStateDatapoints, datapoints } =
    useDatastateDatapoints(backendApiUrl);
  const { error: errorControlDatapoints, datapoints: controlDatapoints } =
    useDeviceControlDatapoints(backendApiUrl);
  const [datapointSelection, setDatapointSelection] = useState<
    DatapointSelection | undefined
  >(undefined);
  const handleDatapointSelection = useCallback(
    (selection: DatapointSelection) => {
      setDatapointSelection(selection);
      storeFilterForPage(
        {
          datapointId: selection
            .filter((sel) => sel.selected)
            .map((sel) => sel.datapoint.id),
        },
        pageUrl
      );
    },
    []
  );
  const [controlSelection, setControlSelection] = useState<
    DatapointSelection | undefined
  >(undefined);
  const handleControlSelection = useCallback(
    (selection: DatapointSelection) => {
      setControlSelection(selection);
      storeFilterForPage(
        {
          controlId: selection
            .filter((sel) => sel.selected)
            .map((sel) => sel.datapoint.id),
        },
        pageUrl
      );
    },
    []
  );
  useEffect(() => {
    if (datapoints && controlDatapoints) {
      const filter = loadFilterForPage(pageUrl);
      const { datapointId: datapointIds, controlId: controlIds } = filter || {};
      const newDatapointSelection: DatapointSelection = datapoints.map(
        (datapoint) => {
          const selected = datapointIds
            ? datapointIds.includes(datapoint.id)
            : true;
          return { datapoint, selected };
        }
      );
      setDatapointSelection(newDatapointSelection);
      const newControlSelection: DatapointSelection = controlDatapoints.map(
        (datapoint) => {
          const selected = controlIds
            ? controlIds.includes(datapoint.id)
            : true;
          return { datapoint, selected };
        }
      );
      setControlSelection(newControlSelection);
    }
  }, [datapoints, controlDatapoints]);
  const refreshStatus = useCallback(() => {
    stateUpdateRef.current && stateUpdateRef.current();
    enginesUpdateRef.current && enginesUpdateRef.current();
    devicesUpdateRef.current && devicesUpdateRef.current();
  }, []);
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
      label: <SettingsApplicationsIcon />,
      onClick: () => setIsOptionsVisible((previous) => !previous),
      elementRef: optionsSelectionRef,
    });
    newActions.push({
      label: "Datapoints",
      onClick: () => setIsDatapointSelectionVisible((previous) => !previous),
      elementRef: datapointSelectionRef,
    });
    newActions.push({
      label: "Control",
      onClick: () => setIsControlSelectionVisible((previous) => !previous),
      elementRef: controlSelectionRef,
    });
    return newActions;
  }, [refreshStatus]);

  return (
    <>
      {isOptionsVisible && (
        <OptionsMenu
          options={pageOptions}
          onChange={handleNewOptions}
          onClose={() => setIsOptionsVisible(false)}
          anchorEl={optionsSelectionRef.current}
        />
      )}
      {isDatapointSelectionVisible && (
        <DatapointSelectionMenu
          selection={datapointSelection}
          onChange={handleDatapointSelection}
          onClose={() => setIsDatapointSelectionVisible(false)}
          anchorEl={datapointSelectionRef.current}
        />
      )}
      {isControlSelectionVisible && (
        <DatapointSelectionMenu
          selection={controlSelection}
          onChange={handleControlSelection}
          onClose={() => setIsControlSelectionVisible(false)}
          anchorEl={controlSelectionRef.current}
        />
      )}
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h5">{"Dashboard"}</Typography>
        </Grid>
        <Grid item>
          <Paper style={{ padding: 5, marginBottom: 5 }}>
            <AppActions actions={actions} />
          </Paper>
        </Grid>
        {errorStateDatapoints && (
          <Grid item>
            <Typography>{`Datapoints from data state: ${errorStateDatapoints}`}</Typography>
          </Grid>
        )}
        {errorControlDatapoints && (
          <Grid item>
            <Typography>{`Control datapoints: ${errorControlDatapoints}`}</Typography>
          </Grid>
        )}
        {isDevicesVisible && (
          <Grid item>
            <DevicesPart leftColumnWidth={150} updateRef={devicesUpdateRef}>
              {({ component, error }) => {
                return error ? <Typography>{error}</Typography> : component;
              }}
            </DevicesPart>
          </Grid>
        )}
        {isEnginesVisible && (
          <Grid item>
            <EnginesPart leftColumnWidth={150} updateRef={enginesUpdateRef}>
              {({ component, error }) => {
                return error ? <Typography>{error}</Typography> : component;
              }}
            </EnginesPart>
          </Grid>
        )}
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <Grid container direction="column">
                {isControlPanelVisible && (
                  <Grid item>
                    <ControlPanel />
                  </Grid>
                )}
                {isControlHistoryVisible && (
                  <Grid item>
                    <ControlsHistory datapointSelection={controlSelection} />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item>
              {isDatastateVisible && (
                <DatastatePart datapointSelection={datapointSelection}>
                  {({ component, error }) => {
                    return error ? <Typography>{error}</Typography> : component;
                  }}
                </DatastatePart>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
