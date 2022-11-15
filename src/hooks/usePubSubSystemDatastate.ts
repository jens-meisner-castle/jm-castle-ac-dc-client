import { useEffect, useMemo, useState } from "react";
import { DatastateContent, msg_subscribe } from "jm-castle-ac-dc-types/build";
import { usePubSubWebsocket } from "./websocket/usePubSubWebsocket";

export interface SystemDatastatePubSubStatus {
  state: DatastateContent | undefined;
  error: string | undefined;
}

export const usePubSubSystemDatastate = (apiUrl: string) => {
  const [pubSubStatus, setPubSubStatus] = useState<SystemDatastatePubSubStatus>(
    {
      state: undefined,
      error: undefined,
    }
  );
  const subscribe = useMemo(() => msg_subscribe("/system/data-state"), []);
  const { data, error } = usePubSubWebsocket<DatastateContent>(
    apiUrl,
    subscribe
  );

  useEffect(() => {
    setPubSubStatus({ state: data, error });
  }, [data, error]);
  return pubSubStatus;
};
