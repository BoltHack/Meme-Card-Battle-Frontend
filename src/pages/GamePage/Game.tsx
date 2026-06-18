import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
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

interface PlayerData {
    name: string;
    id: string;
    game_key: string;
    my_nickname: string
    enemy_nickname: string
}

export const GamePage = ({ title }) => {
    const [bodyLoader, setBodyLoader] = useState(false);

    const { game_type, game_key } = useParams<{ type: string }>();

    const [playerCard, setPlayerCard] = useState([]);
    const [list, setList] = useState([]);

    const [handList, setHandList] = useState([]);

    const [playersInfo, setPlayersInfo] = useState([]);

    const { data, loading, error } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/api/game/${game_type}/${game_key}`
    );

    useEffect(() => {

        if (!data || !data.id) return;

        // socket.connect();

        const sendInitialData = () => {
            console.log('Приняты данные из бэка:', data);

            const formattedPlayersInfo = {
                playerInfo: {
                    name: data.player_info.name,
                    lvl: data.player_info.lvl,
                    health: data.player_info.health,
                    ult: data.player_info.ult
                },
                enemyInfo: {
                    name: data.enemy_info.name,
                    lvl: data.enemy_info.lvl,
                    health: data.enemy_info.health,
                    ult: data.enemy_info.ult
                }
            }
            console.log('formattedPlayerInfo', formattedPlayersInfo);
            setPlayersInfo(prevData => [...prevData, formattedPlayersInfo]);

            setTimeout(() => {
                socket.emit("join_game", { game_key: data.game_key, player_id: data.id });
            }, 500);
            setTimeout(() => {
                // if (!data.id) return;
                socket.emit("get_user_cards", { player_id: data.id });
                socket.emit("check_battle_cards", { game_key: data.game_key, player_id: data.id });
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
        }

        if (socket.connected) {
            sendInitialData();
        }

        socket.on("connect", sendInitialData);

        const handlePlayerCards = (data) => {
            const { cards_data } = data;
            console.log('cards_data', cards_data);
            if (!cards_data) return;

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

        socket.on("get_player_cards", handlePlayerCards);
        socket.on("select_battle_card", (data) => {
            const { card, menu_id } = data;

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

        socket.on("select_battle_card_list", (data) => {
            const { card } = data;

            if (!card || card.length < 1) return;

            console.log('Уникальные карты для рендера:', card);

            setList(prevList => {
                const combined = [...prevList, ...card];

                return combined.filter((item, index, self) =>
                    index === self.findIndex((c) => c.id === item.id)
                );
            });
            setHandList(prevList => {
                const combined = [...prevList, ...card];

                return combined.filter((item, index, self) =>
                    index === self.findIndex((c) => c.id === item.id)
                );
            });
        });

        socket.on("error_handler", (message) => {
            toast.error(message);
        });

        return () => {
            socket.off("connect");
            socket.off("join_game");
            socket.off("get_user_cards");
            socket.off("select_battle_card");
            socket.off("select_battle_card_list");
            socket.off("check_battle_cards");
            socket.disconnect();
            console.log('Сокет отключен, подписки сняты');
        }
    }, [data]);

    if (error) return <ErrorPage error="404" />
    if (loading || !data || !data.id) return <LoadingPage />

    return (
        <div className={styles['body-wrapper']}>
            <Helmet>
                <title>{title}</title>
                {/*    <script type="text/javascript">*/}
                {/*        {`*/}
                {/*  const id = '${data?.id || ""}';*/}
                {/*`}*/}
                {/*    </script>*/}
            </Helmet>
            {bodyLoader && (
                <div className={styles["loader-wrapper"]}>
                    <div className={styles["loader"]}></div>
                </div>
            )}
            <Game_Menus
                playerCard={playerCard} setPlayerCard={setPlayerCard}
                socket={socket}
                player_id={data.id} game_key={data.game_key}
                list={list} setList={setList}
                handList={handList} setHandList={setHandList}
                loading={loading}
                setBodyLoader={setBodyLoader}
                playersInfo={playersInfo}
            />
        </div>
    );
};