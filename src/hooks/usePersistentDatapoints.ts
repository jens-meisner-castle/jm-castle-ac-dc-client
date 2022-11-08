import { useEffect, useState } from "react";
import { PersistenceAreas, UniqueDatapoint } from "../api-types/Types";
import { defaultFetchOptions } from "./options/Utils";

export interface DatapointsQueryStatus {
  datapoints: UniqueDatapoint[] | undefined;
  error: string | undefined;
}

export const usePersistentDatapoints = (
  apiUrl: string,
  area: "all" | keyof typeof PersistenceAreas = "all"
) => {
  const [queryStatus, setQueryStatus] = useState<DatapointsQueryStatus>({
    datapoints: undefined,
    error: undefined,
  });

  useEffect(() => {
    const options = defaultFetchOptions();
    const url = `${apiUrl}/system/persistent-datapoint?area=${area}`;
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
  }, [apiUrl, area]);
  return queryStatus;
};
