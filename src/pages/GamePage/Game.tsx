import { useParams, useNavigate, useBlocker } from 'react-router-dom';
import {useEffect, useRef, useState} from "react";
import { Helmet } from 'react-helmet-async';
import { io, Socket } from "socket.io-client";

const socket: Socket = io(api.API_BASE_URL, {
    autoConnect: false
});

import { Game_Menus } from "./Game_Menus.tsx";
import { ErrorPage } from "../ErrorPage/Error.tsx";

import styles from "./Card.Game.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";
import toast from "react-hot-toast";
import { LoadingPage } from "../LoadingPage/Loading.tsx";
import usePageRender from "../../tools/PageRender.ts";

// interface PlayerData {
//     name: string;
//     id: string;
//     game_key: string;
//     my_nickname: string
//     enemy_nickname: string
// }

interface PlayerData {
    id: string | number;
    name: string;
    health: number;
    lvl: number;
    ult: number;
}

export const GamePage = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [bodyLoader, setBodyLoader] = useState(false);

    const { game_type, game_key } = useParams<{ type: string }>();

    const [playerCard, setPlayerCard] = useState([]);
    const [list, setList] = useState([]);

    const [handList, setHandList] = useState([]);
    const [enemyHandList, setEnemyHandList] = useState([0, 1, 2, 3, 4, 5, 6, 7]);

    // const [isEnemyCardSelected, setIsEnemyCardSelected] = useState(false);
    const [activePlayerCard, setActivePlayerCard] = useState<string | null>(null);
    const [activeEnemyCard, setActiveEnemyCard] = useState(false);

    // const [playersInfo, setPlayersInfo] = useState<PlayerData | null>(null);
    // const [playersInfo, setPlayersInfo] = useState([]);
    const [playersInfo, setPlayersInfo] = useState<any>(null);

    const useCardIdRef = useRef<string | undefined>(undefined);

    const [isBlock, setIsBlock] = useState(true);

    const { data, loading, error } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/api/game/${game_type}/${game_key}`
    );

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isBlock &&
            currentLocation.pathname !== nextLocation.pathname &&
            currentLocation.search === nextLocation.search
    );

    useEffect(() => {
        if (blocker.state === "blocked") {
            toast.dismiss();
            toast.error("Вы не можете покинуть игру, пока она активна.");
        }
    }, [blocker]);

    const leaveGame = () => {
        setIsBlock(false);
        setTimeout(() => navigate("/"), 500);
    }

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    useEffect(() => {

        if (!data || !data.id) return;

        const sendInitialData = () => {
            console.log('Приняты данные из бэка:', data);

            setTimeout(() => {
                socket.emit("join_game", { game_key: data.game_key, player_id: data.id });
                // socket.emit("get_players_info", { game_key: data.game_key });
            }, 500);
            setTimeout(() => {
                // if (!data.id) return;
                socket.emit("get_user_cards", { player_id: data.id });
                // socket.emit("check_battle_cards", { game_key: data.game_key, player_id: data.id });
                socket.emit("clear_game_cards", { game_key: data.game_key, player_id: data.id });
            }, 1000);
            // setInterval(() => {
            //     if (data.id) return;
            //     socket.emit("get_user_cards", { player_id: data.id });
            //     socket.emit("check_battle_cards", { game_key: data.game_key, player_id: data.id });
            //     console.log('test data');
            // }, 1000);
            if (game_type === "player_bot") {
                socket.emit('game_start', "player_bot");
            } else if (game_type === "player_player") {
                socket.emit('game_start', "player_player");
            }
        };

        if (!socket.connected) {
            socket.connect();
        } else {
            sendInitialData();
        }

        socket.on("connect", sendInitialData);

        const handlePlayerCards = (data) => {
            const { cards_data } = data;
            if (!cards_data) return;

            // const duplicatedCards = cards_data.flatMap(card => {
            //     const count = card.quantity || 1;
            //
            //     return Array.from({ length: count }, (_, index) => ({
            //         ...card,
            //         ui_key: `${card.card_id}_duplicate_${index}`
            //         // ui_key: `${crypto.randomUUID()}_duplicate_${index}`
            //         // ui_key: crypto.randomUUID()
            //     }));
            // });
            //
            // setPlayerCard(duplicatedCards);

            setPlayerCard(prevCards => {
                if (Array.isArray(cards_data)) {
                    const newUniqueCards = cards_data.filter(
                        newCard => !prevCards.some(pCard => pCard._id === newCard._id)
                    );
                    return [...prevCards, ...newUniqueCards];
                }

                const isDuplicate = prevCards.some(card => card._id === cards_data._id);
                if (isDuplicate) return prevCards;
                return [...prevCards, cards_data];
            });
        };

        const id= data?.id;

        socket.on("players_info", (data) => {
            const updatedPlayer = data.data;

            const playerInfo_index = data.data.findIndex(up => up.id === id);
            const enemyInfo_index = data.data.findIndex(up => up.id !== id);

            const player_info = updatedPlayer[playerInfo_index];
            const enemy_info = updatedPlayer[enemyInfo_index];

            const formattedPlayersInfo = {
                playerInfo: {
                    id: player_info.id,
                    name: player_info.name,
                    health: player_info.health,
                    lvl: player_info.lvl,
                    ult: player_info.ult,
                },
                enemyInfo: {
                    id: enemy_info.id,
                    name: enemy_info.name,
                    health: enemy_info.health,
                    lvl: enemy_info.lvl,
                    ult: enemy_info.ult,
                }
            }

            setPlayersInfo(formattedPlayersInfo);

            console.log('formattedPlayersInfo', formattedPlayersInfo.playerInfo);

            const title = formattedPlayersInfo.playerInfo.name + " против " + formattedPlayersInfo.enemyInfo.name;

            setTitle(title);
        });

        socket.on("get_player_cards", handlePlayerCards);
        socket.on("select_battle_card", (data) => {
            const { card, menu_id } = data;

            console.log('menu_id', menu_id);

            if (card.length < 1) return;

            const formattedCard = {
                menu_id: menu_id,
                id: card._id,
                name: card.card_name,
                description: card.card_description || "",
                avatar: card.card_avatar || "",
                lvl: card.card_lvl_info?.lvl_number || 1,
                rarity: card.card_lvl_info?.lvl_name || 'Default',
                damage: card.card_stats?.card_damage || 0,
                protection: card.card_stats?.card_protection || 0
            };

            console.log('Formatted card to save:', formattedCard);

            setList(prevList => [...prevList, formattedCard]);
            setHandList(prevHandList => [...prevHandList, formattedCard]);
            setBodyLoader(false);
        });

        // socket.on("select_battle_card_list", (data) => {
        //     const { card } = data;
        //
        //     if (!card || card.length < 1) return;
        //
        //     console.log('Уникальные карты для рендера:', card);
        //
        //     setList(prevList => {
        //         const combined = [...prevList, ...card];
        //
        //         return combined.filter((item, index, self) =>
        //             index === self.findIndex((c) => c.id === item.id)
        //         );
        //     });
        //     setHandList(prevList => {
        //         const combined = [...prevList, ...card];
        //
        //         return combined.filter((item, index, self) =>
        //             index === self.findIndex((c) => c.id === item.id)
        //         );
        //     });
        // });

        socket.on("error_handler", (message) => {
            toast.dismiss();
            toast.error(message);

            setBodyLoader(false);
        });
        socket.on("game_error", (type) => {
            if (type.toString() === "already_InGame") {
                leaveGame();

                toast.dismiss();
                toast.error("Вы уже находитесь в игре.");

                return;
            }
        });

        socket.on("enemy_card_selected", () => {
            setActiveEnemyCard(true);
            setEnemyHandList(enemyHandList.filter(num => num - 1))
        });

        socket.on("game_cards_selected", () => {
            toast.dismiss();
            toast.success("Игроки выбрали свои карты!");
        });

        socket.on("game_cards_selected_result", (data) => {
            const { type, gameData } = data;

            if (type === "timer") {
                if (gameData.timer === 0) {
                    console.log('Время вскрываться!');
                }
                return;
            }
            if (type === "result") {
                console.log("damage", gameData.damage);
                if (gameData.winnerId === data.id) {
                }
                return
            }
            if (type === "clear") {
                // setHandList(handList.filter(item => item.menu_id !== useCardIdRef));
                setActiveEnemyCard(false);
                setActivePlayerCard(null);
                return;
            }
        });

        return () => {
            socket.off("connect");
            socket.off("join_game");
            socket.off("get_user_cards");
            socket.off("select_battle_card");
            // socket.off("select_battle_card_list");
            // socket.off("check_battle_cards");
            socket.disconnect();
            console.log('Сокет отключен, подписки сняты');
        }
    }, [data]);

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

            if (!window.location.pathname.startsWith("/game")) {
                document.body.removeChild(fpsDiv);
                return;
            }
            requestAnimationFrame(calculateFps);
        }

        requestAnimationFrame(calculateFps);
    })();

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage error={error} />

    return (
        <div className={styles['body-wrapper']}>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {bodyLoader && (
                <div className={styles["loader-wrapper"]}>
                    <div className={styles["loader"]}></div>
                </div>
            )}
            {/*<Game_Tools />*/}
            <Game_Menus
                playerCard={playerCard} setPlayerCard={setPlayerCard}
                socket={socket}
                player_id={data.id} game_key={data.game_key}
                list={list} setList={setList}
                handList={handList} setHandList={setHandList}
                enemyHandList={enemyHandList} setEnemyHandList={setEnemyHandList}
                activePlayerCard={activePlayerCard} activeEnemyCard={activeEnemyCard} setActivePlayerCard={setActivePlayerCard}
                loading={loading}
                setBodyLoader={setBodyLoader}
                playersInfo={playersInfo}
                isBlock={isBlock} setIsBlock={setIsBlock}
                useCardIdRef={useCardIdRef}
            />
        </div>
    );
};