import {useEffect, useState} from "react";

import styles from './Card.CardList.module.css';
import card_styles from '../../../MyCardsPage/Card.MyCards.module.css';
import admin_styles from '../../AdminPanel/Card.AdminPanel.module.css';

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";

import usePageRender from "../../../../tools/PageRender.ts";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import { DefaultLoading } from "../../../LoadingPage/DefaultLoading.tsx";
import toast from "react-hot-toast";

interface CardPost {
    card_id: string;
    card_name: string;
    card_avatar: string;
    card_description: string;
    card_damage: number;
    card_protection: string;
    lvl_number: number;
    lvl_name: string;
    power_slot: number;
}

interface CardResponse {
    id?: string;
    renderData: {
        card: CardPost[];
    }
}

export const CardListPage = () => {
    const [cards, setCards] = useState<CardPost[]>([]);
    const [editCardData, setEditCardData] = useState<CardPost[]>([]);

    const [cardsCategory, setCardsCategory] = useState<string | "all">("all");

    const { data, loading, error } = usePageRender<CardResponse>(
        `${api.API_BASE_URL}/admin/card/list/${cardsCategory}`
    );

    const cardEditMenu = (data: CardPost) => {
        console.log('data', data);
        setEditCardData(prevState => [...prevState, data]);
    }

    const handleRemoveCard = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${api.API_BASE_URL}/admin/card/${id}/delete`, {
                withCredentials: true
            });

            console.log('Карта успешно удалена:', response.data);

            const updatedBlogList = cards.filter(item => item.card_id !== id);
            setCards(updatedBlogList);
            setEditCardData([]);

            toast.success(response.data.success);
            return response.data;
        } catch (error) {
            console.log('error', error);
        }
    }

    useEffect(() => {
        if (!data || !Array.isArray(data.renderData.card)) {
            console.log('Данные еще не загрузились или структура не совпадает:', data);
            return;
        }

        setCards(data.renderData.card);

    }, [data]);

    if (loading) return <DefaultLoading />;
    if (error) return <ErrorPage error={error} />;

    return (
        <div id="card-list-page" className={`${admin_styles["page"]} ${admin_styles["active"]}`}>
            <header className={admin_styles["header"]}>
                <h1>Список игровых карт</h1>
                <p>Просматривайте, редактируйте и удаляйте карты.</p>
            </header>

            <main className={styles["discord-card-container"]}>
                <div className={styles["card-categories"]}>
                    <button onClick={() => setCardsCategory("all")} className={`${styles["card-categories-btn"]} ${cardsCategory === "all" ? styles["active"] : null}`}>
                        Все
                    </button>
                    <button onClick={() => setCardsCategory("default")} className={`${styles["card-categories-btn"]} ${cardsCategory === "default" ? styles["active"] : null}`}>
                        Обычные
                    </button>
                    <button onClick={() => setCardsCategory("rare")} className={`${styles["card-categories-btn"]} ${cardsCategory === "rare" ? styles["active"] : null}`}>
                        Редкие
                    </button>
                    <button onClick={() => setCardsCategory("epic")} className={`${styles["card-categories-btn"]} ${cardsCategory === "epic" ? styles["active"] : null}`}>
                        Эпические
                    </button>
                    <button onClick={() => setCardsCategory("legendary")} className={`${styles["card-categories-btn"]} ${cardsCategory === "legendary" ? styles["active"] : null}`}>
                        Легендарные
                    </button>
                </div>

                <div className={card_styles["cards-grid"]}>
                    {cards && cards.length > 0 ? (
                        cards.map(card => {
                            const lvlName = card?.lvl_name.toLowerCase();
                            return (
                                <div key={card.card_id} className={card_styles["card-3d-wrapper"]}
                                     onClick={() => cardEditMenu({
                                         card_id: card.card_id,
                                         card_name: card.card_name,
                                         card_avatar: card.card_avatar,
                                         card_description: card.card_description,
                                         card_damage: card.card_damage,
                                         card_protection: card.card_protection,
                                         lvl_number: card.lvl_number,
                                         lvl_name: card.lvl_name,
                                         power_slot: card.power_slot,
                                     })}
                                >
                                    <div className={card_styles["card-inner"]}>
                                        <div className={`${card_styles["game-card"]} ${card_styles[lvlName.toLowerCase()]} ${card_styles[lvlName.toLowerCase()]}`} style={{ width: "220px" }}>
                                            <div className={card_styles["card-shine"]}></div>
                                            <div className={card_styles["card-header"]}>
                                                <span className={card_styles["card-cost"]} title="Занимает 15 слотов силы">{card.power_slot}</span>
                                                <span className={`${card_styles["card-rarity"]} ${card_styles[lvlName.toLowerCase()]}`}>{card.lvl_name}</span>
                                            </div>
                                            <div className={card_styles["card-artwork"]}>
                                                <img src={`${api.API_BASE_URL}/${card.card_avatar}`} alt="artwork" />
                                            </div>
                                            <div className={card_styles["card-body"]}>
                                                <div className={`${card_styles["card-title"]} ${card_styles[lvlName.toLowerCase()]}`}>{card.card_name}</div>
                                                <div className={card_styles["card-description"]}>
                                                    {card.card_description}
                                                </div>
                                            </div>
                                            <div className={card_styles["card-footer"]}>
                                                <div className={`${card_styles["stat-badge"]} ${card_styles["attack-badge"]}`}>
                                                    <span className={card_styles["stat-icon"]}>⚔️</span>
                                                    <span className={card_styles["stat-value"]}>{card.card_damage}</span>
                                                </div>
                                                <div className={`${card_styles["stat-badge"]} ${card_styles["protection-badge"]}`}>
                                                    <span className={card_styles["stat-icon"]}>🛡️</span>
                                                    <span className={card_styles["stat-value"]}>{card.card_protection}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={card_styles["game-card-back"]}>
                                            <div className={card_styles["card-back-logo"]}>🔮</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ): null}
                </div>

            </main>

            {editCardData && editCardData.length > 0 ? (
                editCardData.map((card, index) => {
                    const lvlName = card?.lvl_name.toLowerCase();
                    return (
                        <div key={index} className={styles["menu-wrapper"]}>
                            <div className={styles["action-menu"]}>
                                <h2>Удалить карту</h2>
                                <div className={styles["action-options"]}>
                                    <div key={index} className={card_styles["card-3d-wrapper"]}>
                                        <div className={card_styles["card-inner"]}>
                                            <div className={`${card_styles["game-card"]} ${card_styles[lvlName.toLowerCase()]} ${card_styles[lvlName.toLowerCase()]}`}>
                                                <div className={card_styles["card-shine"]}></div>
                                                <div className={card_styles["card-header"]}>
                                                    <span className={card_styles["card-cost"]} title="Занимает 15 слотов силы">{card.power_slot}</span>
                                                    <span className={`${card_styles["card-rarity"]} ${card_styles[lvlName.toLowerCase()]}`}>{card.lvl_name}</span>
                                                </div>
                                                <div className={card_styles["card-artwork"]}>
                                                    <img src={`${api.API_BASE_URL}/${card.card_avatar}`} alt="artwork" />
                                                </div>
                                                <div className={card_styles["card-body"]}>
                                                    <div className={`${card_styles["card-title"]} ${card_styles[lvlName.toLowerCase()]}`}>{card.card_name}</div>
                                                    <div className={card_styles["card-description"]}>
                                                        {card.card_description}
                                                    </div>
                                                </div>
                                                <div className={card_styles["card-footer"]}>
                                                    <div className={`${card_styles["stat-badge"]} ${card_styles["attack-badge"]}`}>
                                                        <span className={card_styles["stat-icon"]}>⚔️</span>
                                                        <span className={card_styles["stat-value"]}>{card.card_damage}</span>
                                                    </div>
                                                    <div className={`${card_styles["stat-badge"]} ${card_styles["protection-badge"]}`}>
                                                        <span className={card_styles["stat-icon"]}>🛡️</span>
                                                        <span className={card_styles["stat-value"]}>{card.card_protection}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={card_styles["game-card-back"]}>
                                                <div className={card_styles["card-back-logo"]}>🔮</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                                <br/>
                                <div className={styles["action-menu-btn"]}>
                                    <button onClick={(e) => handleRemoveCard(card.card_id, e)}>
                                        <span>Удалить</span>
                                    </button>
                                    <button onClick={() => setEditCardData([])}>
                                        <span>Отмена</span>
                                    </button>
                                </div>
                                <br/>
                            </div>
                        </div>
                    )
                })
            ): null}

        </div>
    );
};