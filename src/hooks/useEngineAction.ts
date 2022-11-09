import { useEffect, useState } from "react";
import { EngineControlResponse } from "jm-castle-ac-dc-types/dist/All.mjs";
import { defaultFetchOptions } from "./options/Utils";

export interface EngineControlsQueryStatus {
  engineKey: string | undefined;
  actionId: string | undefined;
  response: EngineControlResponse | undefined;
  status: "noAction" | "inProgress" | "finished";
  error: string | undefined;
}

export const useEngineAction = (
  apiUrl: string,
  engineKey: string | undefined,
  actionId: string | undefined
) => {
  const [queryStatus, setQueryStatus] = useState<EngineControlsQueryStatus>({
    engineKey: undefined,
    actionId: undefined,
    response: undefined,
    error: undefined,
    status: "noAction",
  });
  useEffect(() => {
    if (!engineKey || !actionId) {
      setQueryStatus({
        engineKey,
        actionId,
        response: undefined,
        error: undefined,
        status: "noAction",
      });
    } else {
      setQueryStatus({
        engineKey,
        actionId,
        response: undefined,
        error: undefined,
        status: "inProgress",
      });
      const options = defaultFetchOptions();
      const url = `${apiUrl}/engine/action?engineKey=${engineKey}&actionId=${actionId}`;
      fetch(url, options)
        .then((response) => {
          response.json().then((obj) => {
            const { response, error } = obj;
            setQueryStatus({
              actionId,
              engineKey,
              error,
              response,
              status: "finished",
            });
          });
        })
        .catch((error: Error) => {
          console.error(error);
          setQueryStatus({
            actionId,
            engineKey,
            error: error.toString(),
            response: undefined,
            status: "finished",
          });
        });
    }
  }, [apiUrl, actionId, engineKey]);
  return queryStatus;
};
