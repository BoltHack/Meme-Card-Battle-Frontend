import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

import styles from "./Card.Main.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../api/api.ts";
import {ErrorPage} from "../ErrorPage/Error.tsx";

interface PlayerData {
    name: string;
    id: string;
}

export const MainPage = ({ title }) => {
    const navigate = useNavigate();

    const isAuth = Boolean(localStorage.getItem("token"));

    const [data, setData] = useState<PlayerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        axios.get<PlayerData>(`${api.API_BASE_URL}/api/`, {
            signal: controller.signal
        })
            .then((response) => {
                setData(response.data);
                setLoading(false);
                console.log('data', response.data);
                if (!response.data.id) {
                    localStorage.removeItem("token");
                }
            })
            .catch((err) => {
                if (axios.isCancel(err) || err.name === "" || err.name === "CanceledError") return;

                if (err.response?.status === 401) {
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

    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // const timeoutRef = useRef<number | null>(null);
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    const toggleMenu = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsClosing(false);
        setIsOpen(true);
    }
    const closeMenu = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setIsClosing(true);

        timeoutRef.current = window.setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 200);
    }

    const toggleToolsMenu = () => {
        setIsToolsOpen(!isToolsOpen);
    }

    const logout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const response = await axios.post(`${api.API_BASE_URL}/auth/logout`);

            const data = response.data;

            console.log('Успешный logout!');
            toast.success(data.success || 'Вы вышли из системы');

            localStorage.removeItem("token");

            timeoutRef.current = window.setTimeout(() => {
                navigate("/auth/sign-in");
            }, 200);

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Произошла ошибка при выходе';
            console.log('Ошибка logout:', errorMessage);
        }
    }

    // console.log('data', data.id);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div className={styles['body-wrapper']}>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <div className={styles['buttons-container']}>
                <h1>MEME CARD BATTLE</h1>
                <div>
                    <div className={styles["btn"]} onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play">
                            <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                        </svg>
                        <span>Начать играть</span>
                    </div>
                </div>

                <div>
                    <Link to="/how-to-play" className={styles["btn"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-question-mark-icon lucide-message-circle-question-mark">
                            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
                        </svg>
                        <span>Как играть</span>
                    </Link>
                </div>

            </div>

            <div className={styles["tools-menu"]}>
                <div className={styles["tools-menu-container"]}>
                    <div className={styles["tools-menu-content"]}>
                        <div className={`${styles["bottom-menu"]} ${isToolsOpen ? styles["active"] : '' }`}>
                            <div className={styles["menu-header"]} onClick={toggleToolsMenu}>
                                <span className={styles["menu-title"]}>Навигация</span>
                                {/*<button className={styles["close-btn"]} onClick={toggleToolsMenu}>&times;</button>*/}
                                <div className={`${styles["close-btn"]} ${isToolsOpen ? styles["active"] : '' }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-chevron-up-icon lucide-circle-chevron-up"><circle cx="12" cy="12" r="10"/>
                                        <path d="m8 14 4-4 4 4"/>
                                    </svg>
                                </div>
                            </div>
                            <ul className={styles["menu-list"]}>
                                {data?.role === "Admin" && (
                                    <li>
                                        <div className={styles["tools-menu-btn"]} onClick={() => navigate("/admin/create-cards")}>
                                            <span>Админка</span>
                                        </div>
                                    </li>
                                )}

                                {!isAuth ? (
                                    <li>
                                        <div className={styles["tools-menu-btn"]}>
                                            <span onClick={() => navigate("/auth/sign-in")}>
                                                Войти в аккаунт
                                            </span>
                                        </div>
                                    </li>
                                ) : (
                                    <li>
                                        <div className={styles["tools-menu-btn"]}>
                                            <span onClick={logout}>
                                                Выйти
                                            </span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className={styles["menu-wrapper"]}>
                    <div className={styles["bg-glow"]}></div>
                    <div className={`${styles["menu-card"]} ${isClosing ? styles["closing"] : ''}`}>
                        <span className={styles["close-menu-btn"]} onClick={closeMenu}>
                            <div className={styles["close-menu-svg"]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x">
                                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                                </svg>
                            </div>
                        </span>
                        <h2>Выберите режим</h2>
                        <div className={styles["options"]}>

                            <Link to="/" className={styles["menu-btn"]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-user-icon lucide-square-user"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="10" r="3"/>
                                    <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
                                </svg>

                                <span>Игрок против игрока</span>
                            </Link>

                            <Link to="/bot-settings" className={styles["menu-btn"]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
                                </svg>
                                <span>Игрок против бота</span>
                            </Link>

                        </div>
                    </div>
                </div>
                )}
        </div>
    );
};