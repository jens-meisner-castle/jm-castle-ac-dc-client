import { useEffect, useState } from "react";
import { DatastateContent } from "jm-castle-ac-dc-types/build";
import { defaultFetchOptions } from "./options/Utils";

export interface SystemDatastateQueryStatus {
  state: DatastateContent | undefined;
  error: string | undefined;
}
export const useSystemDatastate = (apiUrl: string, updateIndicator: number) => {
  const [queryStatus, setQueryStatus] = useState<SystemDatastateQueryStatus>({
    state: undefined,
    error: undefined,
  });
  useEffect(() => {
    if (updateIndicator > 0) {
      const options = defaultFetchOptions();
      const url = `${apiUrl}/system/data-state`;
      fetch(url, options)
        .then((response) => {
          response.json().then((obj) => {
            const { error, response } = obj || {};
            const { state } = response || {};
            setQueryStatus({
              error,
              state,
            });
          });
        })
        .catch((error) => {
          console.error(error);
          setQueryStatus((previous) => ({
            error: error.toString(),
            state: previous.state,
          }));
        });
    }
  }, [apiUrl, updateIndicator]);
  return queryStatus;
};
