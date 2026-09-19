import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

import api from "../api/api.ts";

const socket: Socket = io(api.API_BASE_URL, {
  autoConnect: false,
});

import axios from "axios";
axios.defaults.withCredentials = true;

interface ErrorState {
  code: number;
  message: string;
}

export default function usePageRender<T extends Record<string, any>>(
  url: string,
  // options: { enabled: boolean } = { enabled: true }
) {
  const navigate = useNavigate();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);

  const [trigger, setTrigger] = useState(0);

  //   const lastFetchedUrl = useRef<string | null>(null);

  // const socket = useMemo(() => {
  //   return io(api.API_BASE_URL, { autoConnect: false });
  // }, []);

  const refetch = () => {
    // lastFetchedUrl.current = null;
    setTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    // if (!options.enabled) return;
    if (!url) return;

    // const requestKey = url + `_trig_${trigger}`;

    // if (String(lastFetchedUrl.current) === String(requestKey)) {
    //   //   console.log("Запрос заблокирован (уже загружен ранее):", url);
    //   return;
    // }
    // lastFetchedUrl.current = requestKey;

    // console.log("requestKey", requestKey);
    // console.log("\nrequestKey\n", requestKey);

    const active_session = sessionStorage.getItem("active_session");
    const active_session_cookies = Cookies.get("active_session");
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
        if (!active_session && !active_session_cookies) {
          // setLoading(true);
          return;
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
          //   lastFetchedUrl.current = null;
          //   console.log("Запрос успешно отменен AbortController:\n", url);
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
          // if (localStorage.getItem("token")) localStorage.removeItem("token");
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
  }, [url, navigate, trigger]);

  useEffect(() => {
    // if (!data || !data.id) return;
    const dataObj = data as Record<string, any> | null;
    if (!dataObj || !dataObj.id) return;

    socket.connect();

    const sendInitialData = () => {
      console.log("Автоматическая отправка данных на бэк для ID:", data.id);
      socket.emit("user_register", { player_id: data.id });
    };

    socket.on("connect", sendInitialData);

    if (socket.connected) {
      sendInitialData();
    } else {
      socket.connect();
    }

    socket.on("error_handler", (message) => {
      toast.error(message);
    });

    return () => {
      socket.off("connect", sendInitialData);
      socket.off("user_register");
      socket.off("error_handler");
      socket.disconnect();
      console.log("Сокет PageRender отключен, подписки сняты");
    };
  }, [data]);

  return { data, loading, error, socket, url, refetch };
}
