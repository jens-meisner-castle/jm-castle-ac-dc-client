import { useEffect, useState } from "react";
import { EngineControlResponse } from "jm-castle-ac-dc-types/build";
import { defaultFetchOptions } from "./options/Utils";

export interface EngineControlsQueryStatus {
  action: ControlAction;
  response: EngineControlResponse | undefined;
  error: string | undefined;
}
export type ControlAction = "start" | "stop" | "none";

export const useEngineControls = (
  apiUrl: string,
  engineKey: string,
  action: ControlAction
) => {
  const [queryStatus, setQueryStatus] = useState<EngineControlsQueryStatus>({
    action: "none",
    response: undefined,
    error: undefined,
  });
  useEffect(() => {
    setQueryStatus({ action, response: undefined, error: undefined });
    if (action === "start" || action === "stop") {
      const options = defaultFetchOptions();
      const url = `${apiUrl}/engine/control/${action}?engineKey=${engineKey}`;
      fetch(url, options)
        .then((response) => {
          response.json().then((obj) => {
            const { response, error } = obj;
            setQueryStatus({ action, error, response });
          });
        })
        .catch((error: Error) => {
          console.error(error);
          setQueryStatus({
            action,
            error: error.toString(),
            response: undefined,
          });
        });
    }
  }, [apiUrl, action, engineKey]);
  return queryStatus;
};
