import { useEffect, useState } from "react";
import { Device, DeviceDatapoint } from "jm-castle-ac-dc-types/dist/All.mjs";
import { defaultFetchOptions } from "./options/Utils";

export interface DevicesQueryStatus {
  devicesWithDatapoints:
    | { device: Device; datapoints: DeviceDatapoint[] }[]
    | undefined;
  error: string | undefined;
}
export const useDevices = (apiUrl: string) => {
  const [queryStatus, setQueryStatus] = useState<DevicesQueryStatus>({
    devicesWithDatapoints: undefined,
    error: undefined,
  });
  useEffect(() => {
    const options = defaultFetchOptions();
    const url = `${apiUrl}/device`;
    fetch(url, options)
      .then((response) => {
        response.json().then((obj) =>
          setQueryStatus({
            error: undefined,
            devicesWithDatapoints: obj?.response?.device,
          })
        );
      })
      .catch((error) => {
        console.error(error);
        setQueryStatus((previous) => ({
          error: error.toString(),
          devicesWithDatapoints: previous.devicesWithDatapoints,
        }));
      });
  }, [apiUrl]);
  return queryStatus;
};
