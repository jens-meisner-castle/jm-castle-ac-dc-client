import { Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { DatapointState, UniqueDatapoint } from "../../../api-types/Types";
import ControlExecutionTable from "../../../components/ControlExecutionTable";
import { backendPubSubApiUrl } from "../../../configuration/Urls";
import { DatapointSelection } from "../../../filter/DatapointSelectionMenu";
import { usePubSubSystemControlHistory } from "../../../hooks/usePubSubSystemControlHistory";

export interface ControlsHistoryProps {
  datapointSelection?: DatapointSelection;
}

export const ControlsHistory = (props: ControlsHistoryProps) => {
  const { datapointSelection } = props;
  const { state, error } = usePubSubSystemControlHistory(backendPubSubApiUrl);
  const dataPerEngine = useMemo(() => {
    const newPerEngine: Record<
      string,
      {
        executions: {
          states: {
            datapoint: UniqueDatapoint;
            datapointState: DatapointState;
          }[];
          deviceId: string;
          success: boolean;
          error?: string;
        }[];
      }
    > = {};
    if (state && datapointSelection) {
      const { controls } = state;
      Object.keys(controls).forEach((engineId) => {
        newPerEngine[engineId] = { executions: [] };
        const { context } = controls[engineId];
        const { executedRequests } = context;
        executedRequests.forEach((executed) => {
          const { request, success, deviceId, error } = executed;
          const execution: {
            states: {
              datapoint: UniqueDatapoint;
              datapointState: DatapointState;
            }[];
            deviceId: string;
            success: boolean;
            error?: string;
          } = { states: [], deviceId, success, error };
          Object.entries(request).forEach(([k, request]) => {
            const { state } = request;
            const publicDatapointId = `${state.id}@${deviceId}`;
            const selection = datapointSelection.find(
              (sel) =>
                sel.datapoint.id === publicDatapointId ||
                sel.datapoint.id === state.id
            );
            selection &&
              execution.states.push({
                datapoint: selection.datapoint,
                datapointState: state,
              });
          });
          newPerEngine[engineId].executions.push(execution);
        });
      });
    }
    return Object.entries(newPerEngine)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, perEngine]) => {
        return { engineId: k, ...perEngine };
      });
  }, [state, datapointSelection]);

  return (
    <>
      {dataPerEngine.map((perEngine) => (
        <Paper
          key={perEngine.engineId}
          style={{
            padding: 5,
            margin: 5,
            marginTop: 0,
            marginLeft: 0,
            maxWidth: 600,
            minWidth: 400,
          }}
        >
          <Typography>{perEngine.engineId}</Typography>
          {error && (
            <Typography>{"Error from control history: " + error}</Typography>
          )}
          {perEngine.executions.map((exec, i) => (
            <ControlExecutionTable
              key={i}
              deviceId={exec.deviceId}
              success={exec.success}
              error={exec.error}
              data={exec.states}
              containerStyle={{ maxWidth: 600 }}
              cellSize="small"
            />
          ))}
        </Paper>
      ))}
    </>
  );
};
