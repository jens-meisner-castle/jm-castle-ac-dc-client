import { useEffect, useState } from "react";
import { SerializableEngine } from "jm-castle-ac-dc-types/dist/All.mjs";
import { defaultFetchOptions } from "./options/Utils";

export interface EnginesQueryStatus {
  engines: SerializableEngine[] | undefined;
  error: string | undefined;
}
export const useEngines = (apiUrl: string) => {
  const [queryStatus, setQueryStatus] = useState<EnginesQueryStatus>({
    engines: undefined,
    error: undefined,
  });
  useEffect(() => {
    const options = defaultFetchOptions();
    const url = `${apiUrl}/engine`;
    fetch(url, options)
      .then((response) => {
        response.json().then((obj) =>
          setQueryStatus({
            error: undefined,
            engines: obj?.response?.engine,
          })
        );
      })
      .catch((error) => {
        console.error(error);
        setQueryStatus((previous) => ({
          error: error.toString(),
          engines: previous.engines,
        }));
      });
  }, [apiUrl]);
  return queryStatus;
};
