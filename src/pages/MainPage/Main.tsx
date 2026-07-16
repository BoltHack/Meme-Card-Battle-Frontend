import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

import styles from "./Card.Main.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";
import usePageRender from "../../tools/PageRender.ts";
import { LoadingPage } from "../LoadingPage/Loading.tsx";
import { ErrorPage } from "../ErrorPage/Error.tsx";

interface PlayerData {
    name: string;
    id: string;
}

export const MainPage = ({ title }) => {
    const navigate = useNavigate();

    const isAuth = Boolean(localStorage.getItem("token"));

    // const [data, setData] = useState<PlayerData | null>(null);
    // const [loading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // const timeoutRef = useRef<number | null>(null);
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    const [isGameFound, setIsGameFound] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data, loading, error, socket } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/api/`
    );

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

    const gameFoundTimerReset = useCallback(() => {
        if (timerId.current) {
            clearInterval(timerId.current);
            timerId.current = null;
        }
        setIsRunning(false);
        setSeconds(0);

        socket.emit("search_game", {
            type: false,
            player_id: data.id
        });
    }, [data]);

    const gameFoundTimerStart = useCallback(() => {
        if (isRunning) return;

        if (timerId.current) {
            gameFoundTimerReset();
        }

        setIsRunning(true);

        timerId.current = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
    }, [isRunning, gameFoundTimerReset]);

    const gameFountTimerFormat = (time) => {
        const totalSeconds = Number(time) || 0;
        if (totalSeconds <= 0) return "0 с";

        const getMinutes = Math.floor(totalSeconds / 60);
        const getSeconds = totalSeconds % 60;

        const minutesStr = getMinutes > 0 ? `${getMinutes} м ` : "";
        const secondsStr = getSeconds > 0 || getMinutes === 0 ? `${getSeconds} с` : " 0 с";

        return (minutesStr + secondsStr).trim();
    }

    const foundGame = (type) => {
        if (!isAuth) {
            navigate("/auth/sign-in");
            return;
        }
        if (type === "search") {
            setIsGameFound(true);
            setIsOpen(false);
            console.log('search game...', data.id);
            socket.emit("search_game", {
                type: true,
                player_id: data.id
            });
            gameFoundTimerStart();
        } else if (type === "cancel") {
            setIsGameFound(false);
            setIsOpen(false);
            gameFoundTimerReset();
        } else {
            setIsGameFound(false);
            setIsOpen(false);
            gameFoundTimerReset();
        }
    }

    (function() {
        const fpsDiv = document.createElement('div');

        fpsDiv.style.position = 'fixed';
        fpsDiv.style.top = '10px';
        fpsDiv.style.left = '10px';
        fpsDiv.style.zIndex = '999999';
        fpsDiv.style.background = 'rgba(0, 0, 0, 0.8)';
        fpsDiv.style.color = '#00ff00';
        fpsDiv.style.padding = '5px 10px';
        fpsDiv.style.fontFamily = 'monospace';
        fpsDiv.style.fontSize = '16px';
        fpsDiv.style.borderRadius = '5px';
        fpsDiv.innerText = 'FPS: ...';
        document.body.appendChild(fpsDiv);

        let lastTime = performance.now();
        let frames = 0;

        function calculateFps() {
            const now = performance.now();
            frames++;

            if (now >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (now - lastTime));
                fpsDiv.innerText = `FPS: ${fps}`;

                fpsDiv.style.color = fps < 45 ? '#ff0000' : '#00ff00';

                frames = 0;
                lastTime = now;
            }

            if (window.location.pathname !== "/") {
                document.body.removeChild(fpsDiv);
                return;
            }
            requestAnimationFrame(calculateFps);
        }

        requestAnimationFrame(calculateFps);
    })();

    const logout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const response = await axios.post(`${api.API_BASE_URL}/auth/logout`);

            const data = response.data;

            console.log('Успешный logout!');
            toast.dismiss();
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

    const getRandomCards = async () => {
        try {
            const response = await axios.post(`${api.API_BASE_URL}/admin/get-random-card`);

            const data = response.data;

            toast.dismiss();
            toast.success(data.success);

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Произошла ошибка при выходе';
            console.log('Ошибка:', errorMessage);
        }
    }

    useEffect(() => {
        if (!data || !data.id) return;

        const sendInitialData = () => {
            socket.emit("search_game", {
                type: false,
                player_id: data.id
            });
        }

        if (!socket.connected) {
            socket.connect();
        } else {
            sendInitialData();
        }

        socket.on("connect", sendInitialData);

        socket.on("found_game", (data) => {
            const { game_key } = data;
            console.log('data', data);

            toast.dismiss();
            toast.success("Противник найден! Удачной игры!");

            setTimeout(() => {
                navigate(`/game/player_player/${game_key}`);
            }, 1000);
        });

        socket.on("game_error_handler", (message) => {
            foundGame("cancel");

            toast.dismiss();
            toast.error(message);
        });

        return () => {
            // foundGame("cancel");
            socket.off("connect", sendInitialData);
            socket.off("search_game");
            socket.off("found_game");
            socket.disconnect();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (timerId.current) clearInterval(timerId.current);
            console.log('Сокет отключен, подписки сняты');
        }
    }, [data?.id]);

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage error={error} />

    return (
        <div className={styles['body-wrapper']}>

            <Helmet>
                <title>{title}</title>
            </Helmet>

            <div className={styles["parallax-body"]}></div>
            {/*<div className={styles["parallax-wrapper"]}>*/}

            {/*    <div className={styles["smoke-glow smoke-red"]}></div>*/}
            {/*    <div className={styles["smoke-glow smoke-blue"]}></div>*/}
            {/*    <div className={styles["smoke-glow smoke-purple"]}></div>*/}

            {/*    <div className={styles["halftone-overlay"]}></div>*/}

            {/*    <div className={styles["star-particles"]}></div>*/}

            {/*    <div className={styles["shard shard-1"]}></div>*/}
            {/*    <div className={styles["shard shard-2"]}></div>*/}

            {/*    <svg className={`${styles["lightning"]} ${styles["lightning-right"]}`} viewBox="0 0 24 24">*/}
            {/*        <path d="M19 9h-6l3-7L5 13h6l-3 9z"/>*/}
            {/*    </svg>*/}

            {/*    <div className={styles["card-layer"]}>*/}

            {/*        <div className={`${styles["premium-card"]} ${styles["card-king"]}`}>*/}
            {/*            <div></div>*/}
            {/*            <div className={styles["card-suit-center"]}>?</div>*/}
            {/*            <div className={styles["card-suit-bottom"]}></div>*/}
            {/*        </div>*/}

            {/*        <div className={`${styles["premium-card"]} ${styles["card-ace-spades"]}`}>*/}
            {/*            <div></div>*/}
            {/*            <div className={styles["card-suit-center"]}>?</div>*/}
            {/*            <div className={styles["card-suit-bottom"]}></div>*/}
            {/*        </div>*/}

            {/*        <div className={`${styles["premium-card"]} ${styles["card-ace-diamonds"]}`}>*/}
            {/*            <div></div>*/}
            {/*            <div className={styles["card-suit-center"]}>?</div>*/}
            {/*            <div className={styles["card-suit-bottom"]}></div>*/}
            {/*        </div>*/}

            {/*    </div>*/}

            {/*</div>*/}

            <div className={styles['buttons-container']}>

                <div className={styles["epic-title"]}>
                    <h1>MEME CARD BATTLE</h1>
                    {/*<p>Meme card battle</p>*/}
                </div>

                <br/>

                {!isGameFound ? (
                    <div className={styles["btn"]} onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play">
                            <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                        </svg>

                        <span>Начать играть</span>
                    </div>
                ) :
                    <div className={`${styles["btn"]} ${styles["btn-disable"]}`}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-off-icon lucide-play-off">
                            <path d="m10.215 4.56 9.79 5.71a2 2 0 0 1 .003 3.458l-.393.23"/><path d="m16.042 16.042-8.034 4.686A2 2 0 0 1 5 19V5"/><path d="m2 2 20 20"/>
                        </svg>

                        <span>Начать играть</span>
                    </div>
                }

                <div className={styles["btn"]} onClick={() => navigate("/")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid-icon lucide-layout-grid">
                        <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
                    </svg>
                    <span>Мои карты</span>
                </div>

                <div className={styles["btn"]} onClick={() => navigate("/how-to-play")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-question-mark-icon lucide-message-circle-question-mark">
                        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
                    </svg>
                    <span>Как играть</span>
                </div>

                <div className={styles["btn"]} onClick={() => navigate("/settings")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings">
                        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>Настройки</span>
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
                                <li>
                                    <Link to="/privacy-policy" className={styles["tools-menu-btn"]} onClick={() => navigate("/")}>
                                        <span>
                                            Политика конфиденциальности
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/terms-of-use" className={styles["tools-menu-btn"]}>
                                        <span>
                                            Условия использования
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/help-center" className={styles["tools-menu-btn"]}>
                                        <span>
                                            Справочный центр
                                        </span>
                                    </Link>
                                </li>

                                <div className={styles["menu-main-tools"]}>
                                    {data?.role === "Admin" && (
                                        <div>
                                            <li>
                                                <div className={styles["tools-menu-btn"]} onClick={() => navigate("/admin/create-cards")}>
                                                    <span>Админка</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className={styles["tools-menu-btn"]} onClick={() => getRandomCards()}>
                                                    <span>Получить случайную карту</span>
                                                </div>
                                            </li>
                                        </div>
                                    )}

                                    {!isAuth ? (
                                        <li>
                                            <div className={styles["tools-menu-btn"]} onClick={() => navigate("/auth/sign-in")}>
                                                <span>
                                                    Войти в аккаунт
                                                </span>
                                            </div>
                                        </li>
                                    ) : (
                                        <li>
                                            <div className={styles["tools-menu-btn"]} onClick={logout}>
                                                <span>
                                                    Выйти
                                                </span>
                                            </div>
                                        </li>
                                    )}
                                </div>
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

                            <div className={styles["menu-btn"]} onClick={() => foundGame("search")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-user-icon lucide-square-user"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="10" r="3"/>
                                    <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
                                </svg>

                                <span>Игрок против игрока</span>
                            </div>

                            <div className={styles["menu-btn"]} onClick={() => navigate("/bot-settings")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
                                </svg>
                                <span>Игрок против бота</span>
                            </div>

                        </div>
                    </div>
                </div>
                )}

            {isGameFound && (
                <div className={styles["game-search-container"]}>
                    <div className={styles["game-search-content"]}>
                        <div className={styles["game-search-info"]}>
                            <div className={styles["game-search-info-content"]}>

                                <div className={`${styles["game-search-info-text"]} ${styles["waiting-time"]}`}>
                                    <span className={styles["search-text"]}>Среднее время ожидания</span>
                                    <span className={styles["search-timer"]}>50 с</span>
                                </div>

                                <div className={`${styles["game-search-info-text"]} ${styles["current-waiting-time"]}`}>
                                    <span className={styles["search-text"]}>Текущее время ожидания</span>
                                    <span className={styles["search-timer"]}>{gameFountTimerFormat(seconds)}</span>
                                </div>

                            </div>

                        </div>
                        <div className={styles["game-search-actions"]}>
                            <button onClick={() => foundGame("cancel")}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};