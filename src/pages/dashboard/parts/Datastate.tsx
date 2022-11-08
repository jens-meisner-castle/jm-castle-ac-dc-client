import { useMemo } from "react";
import { backendPubSubApiUrl } from "../../../configuration/Urls";
import { DatapointSelection } from "../../../filter/DatapointSelectionMenu";
import { usePubSubSystemDatastate } from "../../../hooks/usePubSubSystemDatastate";
import DatapointStateTable from "../../../components/DatapointStateTable";

export interface DatastateContent {
  component: JSX.Element;
  error?: string;
}

export interface DatastatePartProps {
  datapointSelection?: DatapointSelection;
  children: (content: DatastateContent) => JSX.Element;
}

export const DatastatePart = (props: DatastatePartProps) => {
  const { children, datapointSelection } = props;
  const { state, error } = usePubSubSystemDatastate(backendPubSubApiUrl);
  const { datapoints, datapointStates } = state || {};
  const dataArr = useMemo(
    () =>
      datapoints &&
      Object.keys(datapoints)
        .filter(
          (k) =>
            !datapointSelection ||
            datapointSelection.find(
              (sel) => sel.datapoint.id === k && sel.selected
            )
        )
        .map((k) => ({
          datapoint: datapoints[k],
          datapointState: datapointStates
            ? datapointStates[k] || { id: k, at: Date.now() }
            : { id: k, at: Date.now() },
        }))
        .sort((a, b) => a.datapoint.name.localeCompare(b.datapoint.name)),
    [datapointStates, datapoints, datapointSelection]
  );

  return children({
    error,
    component: (
      <>
        {dataArr && (
          <DatapointStateTable
            containerStyle={{ maxWidth: 800 }}
            cellSize="medium"
            data={dataArr}
          />
        )}
      </>
    ),
  });
};
