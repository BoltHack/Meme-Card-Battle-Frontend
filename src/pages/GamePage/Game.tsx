import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { io, Socket } from "socket.io-client";
import axios from "axios";

import styles from "./Card.Game.module.css";

// import { Game_CardDesk } from "./Game_CardDesk.tsx";
import { Game_Menus } from "./Game_Menus.tsx";
import api from "../api/api.ts";
import {ErrorPage} from "../ErrorPage/Error.tsx";

const socket: Socket = io(api.API_BASE_URL, {
    autoConnect: false
});

axios.defaults.withCredentials = true;

interface PlayerData {
    name: string;
    id: string;
    game_key: string;
}

export const GamePage = ({ title }) => {
    const navigate = useNavigate();

    const [error, setError] = useState(false);

    const [bodyLoader, setBodyLoader] = useState(false);

    const { game_type, game_key } = useParams<{ type: string }>();
    const [data, setData] = useState<PlayerData | null>(null);
    const [loading, setLoading] = useState(true);

    const [playerCard, setPlayerCard] = useState([]);
    const [list, setList] = useState([]);

    const [handList, setHandList] = useState([]);

    useEffect(() => {
        const controller = new AbortController();

        axios.get<PlayerData>(`${api.API_BASE_URL}/api/game/${game_type}/${game_key}`, {
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
    }, [navigate]);

    useEffect(() => {

        if (!data || !data.id) return;

        socket.connect();

        const sendInitialData = () => {
            console.log('Отправка данных на бэк для ID:', data?.id);
            setTimeout(() => {
                socket.emit("get_user_cards", { player_id: data.id });
                socket.emit("check_battle_cards", { game_key: data.game_key, player_id: data.id });
            }, 500);
            if (game_type === "player_bot") {
                socket.emit('bot_activate');
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

            // const uniqueCards = card.filter((item, index, self) =>
            //     index === self.findIndex((c) => c._id === item._id)
            // );

            // const formattedCardsArray = uniqueCards.map(cards => ({
            //     menu_id: cards.menu_id,
            //     id: cards._id,
            //     name: cards.card_name,
            //     avatar: {
            //         img: `${api.API_BASE_URL}/${cards.card_avatar}`
            //     },
            //     lvl: cards.card_lvl_info?.lvl_number || 1,
            //     rarity: cards.card_lvl_info?.lvl_name || 'Default',
            //     damage: cards.card_stats?.card_damage || 0,
            //     protection: cards.card_stats?.card_protection || 0
            // }));

            console.log('Уникальные карты для рендера:', card);

            // setList(prevList => [...prevList, card])

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

        return () => {
            socket.off("connect");
            socket.off("bot_answer");
            socket.off("get_user_cards");
            socket.off("select_battle_card");
            socket.off("select_battle_card_list");
            socket.off("check_battle_cards");
            socket.disconnect();
            console.log('Сокет отключен, подписки сняты');
        }
    }, [data]);

    if (error) return <ErrorPage error="404" />
    if (loading) return <div>Загрузка...</div>;

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
                socket={socket} player_id={data.id} game_key={data.game_key}
                list={list} setList={setList}
                handList={handList} setHandList={setHandList}
                loading={loading}
                setBodyLoader={setBodyLoader}
            />
        </div>
    );
};