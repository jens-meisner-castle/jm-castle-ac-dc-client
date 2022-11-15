import { useEffect, useMemo, useState } from "react";
import {
  ControlstateContent,
  msg_subscribe,
} from "jm-castle-ac-dc-types/build";
import { usePubSubWebsocket } from "./websocket/usePubSubWebsocket";

export interface SystemControlPubSubStatus {
  state: ControlstateContent | undefined;
  error: string | undefined;
}

export const usePubSubSystemControlHistory = (apiUrl: string) => {
  const [pubSubStatus, setPubSubStatus] = useState<SystemControlPubSubStatus>({
    state: undefined,
    error: undefined,
  });
  const subscribe = useMemo(() => msg_subscribe("/system/control-history"), []);
  const { data, error } = usePubSubWebsocket<ControlstateContent>(
    apiUrl,
    subscribe
  );

  useEffect(() => {
    setPubSubStatus({ state: data, error });
  }, [data, error]);
  return pubSubStatus;
};
