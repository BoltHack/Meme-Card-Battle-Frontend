import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../api/api.ts";

interface PlayerData {
    name: string;
}

export const HowToPlayPage = ({ title }) => {
    const navigate = useNavigate();

    const [data, setData] = useState<PlayerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        axios.get<PlayerData>(`${api.API_BASE_URL}/api/how-to-play`, {
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

                console.error("Ошибка загрузки профиля:", err);
                setLoading(false);
            });

        return () => {
            controller.abort();
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Link to="/">Home</Link>
        </>
    );
};
