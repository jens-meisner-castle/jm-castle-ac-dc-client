import { useEffect, useState } from "react";
import { UniqueDatapoint } from "jm-castle-ac-dc-types/build";
import { defaultFetchOptions } from "./options/Utils";

export interface DatapointsQueryStatus {
  datapoints: UniqueDatapoint[] | undefined;
  error: string | undefined;
}

export const useDeviceControlDatapoints = (
  apiUrl: string,
  deviceId?: string
) => {
  const [queryStatus, setQueryStatus] = useState<DatapointsQueryStatus>({
    datapoints: undefined,
    error: undefined,
  });

  useEffect(() => {
    const options = defaultFetchOptions();
    const url = deviceId
      ? `${apiUrl}/system/device-control-datapoint?deviceId=${deviceId}`
      : `${apiUrl}/system/device-control-datapoint`;
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
  }, [apiUrl, deviceId]);
  return queryStatus;
};
