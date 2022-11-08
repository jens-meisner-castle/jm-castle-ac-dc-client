import { useEffect, useState } from "react";
import base64 from "base-64";

export const useInverterHtml = (url: string) => {
  const [text, setText] = useState<string | undefined>(undefined);
  useEffect(() => {
    const credentials = "YWRtaW46YWRtaW4="; // "admin:admin";
    console.log(base64.decode(credentials));
    console.log(base64.encode("admin:admin"));
    const options: RequestInit = {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit

      headers: {
        "Access-Control-Allow-Origin": "192.168.178.20",
        Authorization: `Basic ${credentials}`,
      },
      redirect: "follow", // manual, *follow, error
      referrer: "http://192.168.178.41/index_cn.html",
      referrerPolicy: "origin-when-cross-origin", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };
    fetch(url, options)
      .then((response) => {
        response.text().then((s) => setText(s));
      })
      .catch((error) => setText(error.toString()));
  }, [url]);
  return text;
};
