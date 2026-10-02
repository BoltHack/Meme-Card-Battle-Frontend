import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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
  const navigate = useNavigate();
  const [contentData, setContentData] = useState<T | null>(null);
  const [contentLoading, setContentLoading] = useState<boolean>(
    options.enabled,
  );
  const [contentError, setContentError] = useState<ErrorState | null>(null);

  const [trigger, setTrigger] = useState(0);

   const refetch = () => {
     // lastFetchedUrl.current = null;
     setTrigger((prev) => prev + 1);
   };

  const isEnabled = options.enabled;

  useEffect(() => {
    if (!isEnabled || !url) {
      setContentLoading(false);
      return;
    }

    const active_session = sessionStorage.getItem("active_session");
    const active_session_cookies = Cookies.get("active_session");

    const controller = new AbortController();

    setContentLoading(true);
    setContentError(null);

    if (!active_session && !active_session_cookies) return;

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

        if (status === 401) {
          if (!window.location.pathname.startsWith("/admin/")) {
            navigate("/auth/sign-in");
          } else {
            setContentError({ code: 404, message: "not found." });
          }
          return;
          // if (localStorage.getItem("token")) localStorage.removeItem("token");
        }
        if (status === 403) {
          navigate("/");
          return;
        }
        if (status === 404) {
          setContentError({ code: 404, message: errorMessage });
          if (trigger > 0) {
            navigate(0);
          }
          return;
        }
        if (status) {
          setContentError({
            code: status,
            message: errorMessage,
          });
          return;
        }
        setContentError({ code: 505, message: errorMessage });
        console.error("Ошибка загрузки профиля:", err);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setContentLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [url, navigate, trigger, isEnabled]);

  return { contentData, contentLoading, contentError, url, refetch };
}
