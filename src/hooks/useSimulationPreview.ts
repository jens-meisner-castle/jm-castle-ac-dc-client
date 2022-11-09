import { useEffect, useState } from "react";
import {
  PreviewOptions,
  SimulationPreviewResponse,
} from "jm-castle-ac-dc-types/dist/All.mjs";
import { defaultFetchOptions } from "./options/Utils";

/**
 *
 * @param apiUrl backend api
 * @param logged_at_from Filter from (seconds of a date)
 * @param logged_at_to Filter to (seconds of a date)
 * @param updateIndicator change to re-select (0 => no fetch)
 * @returns
 */
export const useSimulationPreview = (
  apiUrl: string,
  deviceId: string | undefined,
  previewOptions: PreviewOptions
) => {
  const [queryStatus, setQueryStatus] = useState<
    | SimulationPreviewResponse
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
    if (deviceId) {
      const options = defaultFetchOptions();
      const { interval, precision } = previewOptions || {};
      const intervalPart = interval
        ? `from=${interval.from.toMillis()}&to=${interval.to.toMillis()}`
        : undefined;
      const precisionPart = precision
        ? `precision=${precision.toMillis()}`
        : undefined;
      const url = `${apiUrl}/simulation/preview?deviceId=${deviceId}${
        intervalPart ? "&" + intervalPart : ""
      }${precisionPart ? "&" + precisionPart : ""}`;
      fetch(url, options)
        .then((response) => {
          response.json().then((obj) => {
            const { response, error, errorDetails } = obj || {};
            const { preview } = response || {};
            setQueryStatus({
              error,
              result: preview,
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
  }, [apiUrl, deviceId, previewOptions]);
  return queryStatus;
};
