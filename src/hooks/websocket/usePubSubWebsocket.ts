import { useCallback, useEffect, useState } from "react";
import { isWsMessage, WsMessage } from "jm-castle-ac-dc-types/build";

export interface PubSubResult<T> {
  data?: T;
  error?: string;
}

export const usePubSubWebsocket = <T>(apiUrl: string, subscribe: WsMessage) => {
  const [socketState, setSocketState] = useState<
    { socket: WebSocket; isReady: boolean } | undefined
  >(undefined);
  const [result, setResult] = useState<PubSubResult<T>>({
    data: undefined,
    error: undefined,
  });

  const onMessage = useCallback(async (evt: MessageEvent<Blob>) => {
    const { data } = evt;
    try {
      const str = await data.text();
      const msg = JSON.parse(str);
      if (isWsMessage(msg)) {
        const { method } = msg;
        switch (method) {
          case "welcome":
            break;
          case "publish": {
            const { params } = msg;
            const { data } = params || {};
            setResult({ data: data ? (data as T) : undefined });
            break;
          }
          default:
            console.log("Received unknown message:", msg);
        }
      }
    } catch (error) {
      setResult((previous) => ({
        data: previous.data,
        error: (error as Error).toString(),
      }));
    }
  }, []);

  useEffect(() => {
    let newSocket: WebSocket;
    let error: string | undefined = undefined;

    setSocketState((previous) => {
      if (previous?.socket) {
        return previous;
      }
      try {
        newSocket = new WebSocket(apiUrl);
        newSocket.onmessage = onMessage;
        newSocket.onopen = () =>
          setSocketState((previous) =>
            previous && previous.socket === newSocket
              ? { ...previous, isReady: true }
              : previous
          );
        return { socket: newSocket, isReady: false };
      } catch (err) {
        error = (err as Error).toString();
        return undefined;
      }
    });
    if (error) {
      setResult((previous) => ({
        data: previous.data,
        error: error,
      }));
    }
    return () => {
      newSocket && newSocket.close();
    };
  }, [apiUrl, onMessage]);

  useEffect(() => {
    const { socket, isReady } = socketState || {};
    socket && isReady && socket.send(JSON.stringify(subscribe));
  }, [socketState, subscribe]);

  return result;
};
