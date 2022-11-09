import { useEffect, useState } from "react";
import { SerializableDeviceType } from "jm-castle-ac-dc-types/dist/All.mjs";
import { defaultFetchOptions } from "./options/Utils";

export interface DeviceTypesQueryStatus {
  deviceTypes: SerializableDeviceType[] | undefined;
  error: string | undefined;
}
export const useDeviceTypes = (apiUrl: string) => {
  const [queryStatus, setQueryStatus] = useState<DeviceTypesQueryStatus>({
    deviceTypes: undefined,
    error: undefined,
  });
  useEffect(() => {
    const options = defaultFetchOptions();
    const url = `${apiUrl}/device-type`;
    fetch(url, options)
      .then((response) => {
        response.json().then((obj) => {
          const { response, error } = obj || {};
          const { type: deviceTypes } = response || {};
          setQueryStatus({
            error,
            deviceTypes,
          });
        });
      })
      .catch((error) => {
        console.error(error);
        setQueryStatus((previous) => ({
          error: error.toString(),
          deviceTypes: previous.deviceTypes,
        }));
      });
  }, [apiUrl]);
  return queryStatus;
};
