import { useEffect, useState } from "react";
import { EngineStatus } from "jm-castle-ac-dc-types/dist/All.mjs";
import { defaultFetchOptions } from "./options/Utils";

export interface EngineStatusQueryStatus {
  status: EngineStatus | undefined;
  error: string | undefined;
}
export const useEngineStatus = (
  apiUrl: string,
  engineKey: string,
  updateIndicator: number
) => {
  const [queryStatus, setQueryStatus] = useState<EngineStatusQueryStatus>({
    status: undefined,
    error: undefined,
  });
  useEffect(() => {
    setQueryStatus({ status: undefined, error: undefined });
    const options = defaultFetchOptions();
    const url = `${apiUrl}/engine/status?engineKey=${engineKey}`;
    fetch(url, options)
      .then((response) => {
        response.json().then((obj) => {
          const { response, error } = obj || {};
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
  }, [apiUrl, engineKey, updateIndicator]);
  return queryStatus;
};
