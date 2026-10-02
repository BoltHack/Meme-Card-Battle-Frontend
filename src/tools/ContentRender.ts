import { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
axios.defaults.withCredentials = true;

interface ErrorState {
  code: number;
  message: string;
}

export default function useContentRender<T extends Record<string, any>>(
  url: string,
  options: { enabled: boolean } = { enabled: true },
) {
  const [contentData, setContentData] = useState<T | null>(null);
  const [contentLoading, setContentLoading] = useState<boolean>(
    options.enabled,
  );
  const [contentError, setContentError] = useState<ErrorState | null>(null);

  const isEnabled = options.enabled;

  useEffect(() => {
    if (!isEnabled || !url) {
      setContentLoading(false);
      return;
    }

    const controller = new AbortController();

    setContentLoading(true);
    setContentError(null);

    axios
      .get<T>(url, {
        signal: controller.signal,
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData && responseData.renderData) {
          setContentData(responseData);
        }
      })
      .catch((err: AxiosError<any>) => {
        if (axios.isCancel(err)) return;

        const errorMessage =
          err.response?.data?.error || err.message || "Unknown error";
        const status = err.response?.status || 0;

        setContentError({ code: status, message: errorMessage });
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setContentLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [url, isEnabled]);

  return { contentData, contentLoading, contentError };
}