import { useEffect, useState } from "react";
import { Datapoint } from "../api-types/Types";
import { defaultFetchOptions } from "./options/Utils";

export interface DatapointsQueryStatus {
  datapoints: Datapoint[] | undefined;
  error: string | undefined;
}

export const useDatastateDatapoints = (apiUrl: string) => {
  const [queryStatus, setQueryStatus] = useState<DatapointsQueryStatus>({
    datapoints: undefined,
    error: undefined,
  });

  useEffect(() => {
    const options = defaultFetchOptions();
    const url = `${apiUrl}/system/datastate-datapoint`;
    fetch(url, options)
      .then((response) => {
        response.json().then((obj) => {
          const { response, error } = obj || {};
          const { datapoint: datapoints } = response || {};
          setQueryStatus({
            error,
            datapoints,
          });
        });
      })
      .catch((error) => {
        console.error(error);
        setQueryStatus((previous) => ({
          error: error.toString(),
          datapoints: previous.datapoints,
        }));
      });
  }, [apiUrl]);
  return queryStatus;
};
