import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
  Row_DatapointControlLog,
  SelectResponse,
} from "jm-castle-ac-dc-types/build";
import { defaultFetchOptions } from "./options/Utils";

/**
 *
 * @param apiUrl backend api
 * @param logged_at_from Filter from (seconds of a date)
 * @param logged_at_to Filter to (seconds of a date)
 * @param updateIndicator change to re-select (0 => no fetch)
 * @returns
 */
export const useDatapointControlLogSelect = (
  apiUrl: string,
  from: DateTime,
  to: DateTime,
  updateIndicator: number
) => {
  const [queryStatus, setQueryStatus] = useState<
    | SelectResponse<Row_DatapointControlLog>
    | {
        result: undefined;
        error: undefined;
        errorDetails?: Record<string, unknown>;
      }
  >({
    result: undefined,
    error: undefined,
  });

  useEffect(() => {
    if (updateIndicator) {
      const logged_at_from = Math.floor(from.toMillis() / 1000);
      const logged_at_to = Math.ceil(to.toMillis() / 1000);
      const options = defaultFetchOptions();
      const url = `${apiUrl}/datapoint-control-log/select?logged_at_from=${logged_at_from}&logged_at_to=${logged_at_to}`;
      fetch(url, options)
        .then((response) => {
          response.json().then((obj) => {
            const { response, error, errorDetails } = obj || {};
            const { result } = response || {};
            setQueryStatus({
              error,
              result,
              errorDetails,
            });
          });
        })
        .catch((error) => {
          console.error(error);
          setQueryStatus((previous) => ({
            error: error.toString(),
            result: previous.result,
          }));
        });
    }
  }, [apiUrl, updateIndicator, from, to]);
  return queryStatus;
};
