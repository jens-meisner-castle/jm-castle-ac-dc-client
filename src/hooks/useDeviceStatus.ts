import { useEffect, useState } from "react";
import { DeviceStatus } from "jm-castle-ac-dc-types/build";
import { defaultFetchOptions } from "./options/Utils";

export interface DeviceStatusQueryStatus {
  status: DeviceStatus | undefined;
  error: string | undefined;
}
export const useDeviceStatus = (
  apiUrl: string,
  deviceId: string,
  updateIndicator: number
) => {
  const [queryStatus, setQueryStatus] = useState<DeviceStatusQueryStatus>({
    status: undefined,
    error: undefined,
  });
  useEffect(() => {
    if (updateIndicator > 0) {
      setQueryStatus({ status: undefined, error: undefined });
      const options = defaultFetchOptions();
      const url = `${apiUrl}/device/status?deviceId=${deviceId}`;
      fetch(url, options)
        .then((response) => {
          response.json().then((obj) => {
            const { error, response } = obj || {};
            const { status: statusArr } = response || {};
            const status = statusArr.length ? statusArr[0] : undefined;
            setQueryStatus({
              error,
              status,
            });
          });
        })
        .catch((error: Error) => {
          console.error(error);
          setQueryStatus((previous) => ({
            error: error.toString(),
            status: previous.status,
          }));
        });
    }
  }, [apiUrl, deviceId, updateIndicator]);
  return queryStatus;
};
