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

export default function usePageRender<T>(url: string) {
    const navigate = useNavigate();

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const controller = new AbortController();

        axios.get<T>(url, {
            signal: controller.signal
        })
            .then((response) => {
                setData(response.data);
                setLoading(false);
                console.log('data', response.data);
            })
            .catch((err) => {
                if (axios.isCancel(err) || err.name === "") return;

                if (err.response && err.response.status === 401) {
                    navigate("/auth/sign-in");
                    return;
                }
                if (err.response?.status === 404) {
                    setError(true);
                    console.log('404');
                    // <ErrorPage error="page is not found" />
                    return;
                }

                console.error("Ошибка загрузки профиля:", err);
                setLoading(false);
            });

        return () => {
            controller.abort();
        }
    }, [url, navigate]);

    useEffect(() => {

        if (!data || !data.id) return;

        socket.connect();

        const sendInitialData = () => {
            console.log('Автоматическая отправка данных на бэк для ID:', data?.id);
            socket.emit("user_register", { player_id: data?.id });
        };

        if (!socket.connected) {
            socket.connect();
        }

        if (socket.connected) {
            sendInitialData();
        }

        socket.on("connect", sendInitialData);

        socket.on("error_handler", (message) => {
            toast.error(message);
        });

        return () => {
            socket.off("connect");
            socket.off("user_register");
            socket.off("error_handler");
            socket.disconnect();
            console.log('Сокет отключен, подписки сняты');
        }
    }, [data]);

    return { data, loading, error, socket };
}