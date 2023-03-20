import {
  ApiServiceResponse,
  SystemSetupStatus,
  UnknownErrorCode,
} from "jm-castle-types/build";
import { useEffect, useState } from "react";
import { defaultFetchOptions } from "./options/Utils";

export const useSystemSetupStatus = (
  apiUrl: string,
  updateIndicator: number
) => {
  const [queryStatus, setQueryStatus] = useState<
    ApiServiceResponse<SystemSetupStatus | undefined>
  >({
    response: undefined,
  });
  useEffect(() => {
    const options = defaultFetchOptions();
    const url = `${apiUrl}/system/setup-status`;
    fetch(url, options)
      .then((response) => {
        response.json().then((obj: ApiServiceResponse<SystemSetupStatus>) => {
          const { response, error, errorCode, errorDetails } = obj;
          if (error) {
            return setQueryStatus({ error, errorCode, errorDetails });
          }
          console.log(response);
          if (!response) {
            return setQueryStatus({
              errorCode: UnknownErrorCode,
              errorDetails,
              error: "Received no error and undefined response.",
            });
          }
          return setQueryStatus({
            response,
          });
        });
      })
      .catch((error: Error) => {
        console.error(error);
        return setQueryStatus({
          errorCode: UnknownErrorCode,
          error: error.toString(),
        });
      });
  }, [apiUrl, updateIndicator]);
  return queryStatus;
};
