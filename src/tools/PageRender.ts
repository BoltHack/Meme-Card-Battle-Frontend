import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

import api from "../api/api.ts";

const socket: Socket = io(api.API_BASE_URL, {
    autoConnect: false
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

    const refetch = () => setTrigger(prev => prev + 1);

    useEffect(() => {
        // if (!options.enabled) return;
        if (url === null) return;

        const controller = new AbortController();

        axios.get<T>(url, {
            signal: controller.signal
        })
            .then((response) => {
                setData(response.data);
                setLoading(false);
                console.log('trigger', trigger);
            })
            .catch((err) => {
                if (axios.isCancel(err) || err.name === "") return;
                const errorMessage = err.response.data.error;

                if (err.response?.status === 401) {
                    if (!window.location.pathname.startsWith("/admin/")) {
                        navigate("/auth/sign-in");
                    } else {
                        console.log('4fd65g465df4g654df6');
                        setLoading(false);
                        setError({ code: 404, message: "Not found." });
                    }
                    return;
                    // if (localStorage.getItem("token")) localStorage.removeItem("token");
                }
                if (err.response?.status === 404) {
                    setLoading(false);
                    setError({ code: 404, message: errorMessage });
                    if (trigger > 0) {
                        navigate(0);
                    }
                    return;
                }
                if (err.response?.status) {
                    console.log("err.response?.status", err.response?.status);
                    setLoading(false);
                    setError({
                        code: Number(err.response?.status),
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
        }
    }, [url, navigate, trigger]);

    useEffect(() => {

        if (!data || !data?.id) return;

        socket.connect();

        const sendInitialData = () => {
            console.log('Автоматическая отправка данных на бэк для ID:', data?.id);
            socket.emit("user_register", { player_id: data?.id });
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
            console.log('Сокет отключен, подписки сняты');
        }
    }, [data]);

    return { data, loading, error, socket, refetch };
}