import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

import api from "../api/api.ts";

axios.defaults.withCredentials = true;

// const socket: Socket = io(api.API_BASE_URL, {
//   autoConnect: false,
// });

interface ErrorState {
  code: number;
  message: string;
}

export default function usePageRender<T extends Record<string, any>>(
  url: string,
  options: { enabled: boolean } = { enabled: true },
) {
  const navigate = useNavigate();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);

  const [trigger, setTrigger] = useState(0);

  const socket = useMemo(() => {
    return io(api.API_BASE_URL, { autoConnect: false });
  }, []);

  const refetch = () => {
    setTrigger((prev) => prev + 1);
  };

  const isEnabled = options.enabled;

  useEffect(() => {
    if (!isEnabled || !url) return;

    const active_session = sessionStorage.getItem("active_session");
    const active_session_cookies = Cookies.get("active_session");

    if (!active_session && !active_session_cookies) {
      // setLoading(true);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    axios
      .get<T>(url, {
        signal: controller.signal,
      })
      .then((response) => {
        setData(response.data);
        setError(null);
        if (window.location.pathname !== "/play") {
          sessionStorage.setItem("active_tab", "play:main");
        }
        setLoading(false);
        console.log("trigger", trigger);
      })
      .catch((err) => {
        // if (axios.isCancel(err) || err.name === "") {
        if (
          axios.isCancel(err) ||
          err.name === "CanceledError" ||
          err.name === "AbortError" ||
          err.name === ""
        ) {
          return;
        }

        setLoading(false);

        const errorMessage =
          err.response?.data?.error || err.message || "Unknown error";
        const status = err.response?.status;

        if (status === 401) {
          if (!window.location.pathname.startsWith("/admin/")) {
            navigate("/auth/sign-in");
          } else {
            setLoading(false);
            setError({ code: 404, message: "not found." });
          }
          return;
        }
        if (status === 403) {
          navigate("/");
          return;
        }
        if (status === 404) {
          setLoading(false);
          setError({ code: 404, message: errorMessage });
          if (trigger > 0) {
            navigate(0);
          }
          return;
        }
        if (status) {
          setLoading(false);
          setError({
            code: status,
            message: errorMessage,
          });
          return;
        }
        setError({ code: 505, message: errorMessage });
        console.error("Ошибка загрузки профиля:", err);
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [url, navigate, trigger, isEnabled]);

  useEffect(() => {
    const dataObj = data as Record<string, any> | null;
    if (!dataObj || !dataObj.id || window.location.pathname !== "/play") return;

    const sendInitialData = () => {
      if (dataObj.id) {
        console.log(
          "Автоматическая отправка данных на бэк для ID:",
          dataObj?.id,
        );
        socket.emit("user_register", { player_id: dataObj?.id });
      }
    };

    const handleError = (message: string) => {
      toast.error(message);
    };

    socket.on("connect", sendInitialData);
    socket.on("error_handler", handleError);

    if (socket.connected) {
      sendInitialData();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", sendInitialData);
      socket.off("error_handler");
      socket.disconnect();
      console.log("Сокет (PageRender) отключен, подписки сняты");
    };
  }, [data, socket]);

  return { data, loading, error, socket, url, refetch };
}
