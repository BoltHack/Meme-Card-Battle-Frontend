import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import styles from './Card.MyCards.module.css';

import api from "../../api/api.ts";

import usePageRender from "../../tools/PageRender.ts";
import { LoadingPage } from "../LoadingPage/Loading.tsx";
import { DefaultLoading } from "../LoadingPage/DefaultLoading.tsx";
import { ErrorPage } from "../ErrorPage/Error.tsx";

import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";
import { Header } from "../../tools/PageTools/header_footer/Header.tsx";

interface TitleSettings {
    title: string;
}

interface RenderData {
    card_id: string;
    card_damage: number;
    card_protection: number;
    lvl_number: number;
    lvl_name: string;
    card_name: string;
    card_description: string;
    card_avatar: string;
    card_quantity: number;
    power_slot: number;
}

interface StatsData {
    lvl: number;
    money: number;
    coins: number;
}

interface PlayerData {
    id: string;
    name: string;
    role: string;
    renderData: RenderData[];
    stats: StatsData;
}

export const MyCardsPage = ({ title }: TitleSettings) => {

    const [cards, setCards] = useState<RenderData[]>([]);
    const [stats, setStats] = useState<StatsData>({} as StatsData);

    const [cardsCategory, setCardsCategory] = useState<string | "all">("all")

    const { data, loading, error } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/api/my-cards/${cardsCategory}`
    );

    useEffect(() => {
        if (!data || !data.id) return;

        setCards(data?.renderData);

        const stats = data?.stats;

        setStats(stats);

        console.log('data', data.renderData);

        console.log('reduce', cards?.reduce((acc, card) => acc + card.card_quantity, 0));
        console.log('power reduce', cards?.reduce((acc, card) => acc + card.power_slot, 0));

    }, [data, cards]);

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage error={error} />

    return (
        <div className={styles["body-wrapper"]}>

            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Header />

            <div className={styles["container"]}>

                <header className={styles["header-panel"]}>
                    <div className={styles["user-block"]}>
                        <div className={styles["user-main-info"]}>
                            <div className={styles["user-profile"]}>
                                <img src={`${api.API_BASE_URL}/uploads/UserCovers/${data?.id}/UserProfile.jpg`} className={styles["avatar"]} />
                                <div className={styles["username"]}>{data?.name}</div>
                            </div>

                            <div className={styles["user-level"]}>
                                <span className={styles["level-badge"]}>LVL {stats?.lvl}</span>
                                <div className={styles["level-bar-bg"]} title="Опыт до следующего уровня">
                                    {/*<div className={styles["level-bar-fill"]} style={{ width: "65%" }}></div>*/}
                                    <div className={styles["level-bar-fill"]} style={{ width: `${stats?.lvl}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className={styles["progress-container-row"]}>
                            <div className={styles["collection-progress-box"]}>
                                <div className={styles["progress-text"]}>Коллекция: <span>{cards?.reduce((acc, card) => acc + card.card_quantity, 0) || 0}</span> / 150</div>
                                <div className={styles["progress-bar-bg"]}>
                                    <div className={styles["progress-bar-fill"]} style={{ width: `${cards?.reduce((acc, card) => acc + card.card_quantity, 0) || 0}%`}}></div>
                                </div>
                            </div>

                            {/*<div className={styles["deck-slots-box"]}>*/}
                                {/*<div className={styles["progress-text"]}>Слоты силы: <span className={styles["slots-counter"]}>{cards?.reduce((acc, card) => acc + card.power_slot, 0) || 0}</span></div>*/}
                                {/*<div className={`${styles["progress-bar-bg"]} ${styles["slots-bg"]}`}>*/}
                                {/*    <div className={`${styles["progress-bar-fill"]} ${styles["slots-fill"]}`} style={{ width: "66.6%" }}></div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        </div>
                    </div>

                    <div className={styles["balance-container"]}>
                        <div className={`${styles["balance-item"]} ${styles["gold"]}`}>
                            <span className={styles["currency-icon"]}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1.5"/>
                                    <circle cx="12" cy="12" r="6" stroke="#eab308" strokeWidth="1" strokeDasharray="2 2"/>
                                    <path d="M12 7V17M12 7C11 7 9.5 7.5 9.5 9.5C9.5 11.5 14.5 11 14.5 13C14.5 15 12 15 12 15M12 15C10.5 15 9.5 14.5 9.5 14M12 7C13 7 14.5 7.5 14.5 8.5" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round"/>
                                    <defs>
                                        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#ca8a04" />
                                            <stop offset="50%" stopColor="#eab308" />
                                            <stop offset="100%" stopColor="#854d0e" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                            <span className={styles["currency-amount"]}>{stats?.money}</span>
                        </div>

                        <div className={`${styles["balance-item"]} ${styles["gems"]}`}>
                            <span className={styles["currency-icon"]}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 3L2 9L12 22L22 9L18 3H6Z" fill="url(#gemGrad)" stroke="#67e8f9" strokeWidth="1.5" strokeLinejoin="round"/>
                                    <path d="M6 3L12 9M18 3L12 9M2 9H22M6 3H18M12 9V22" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.6"/>
                                    <defs>
                                        <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#0891b2" />
                                            <stop offset="50%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#155e75" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                            <span className={styles["currency-amount"]}>{stats?.coins}</span>
                        </div>

                        <div className={`${styles["balance-item"]} ${styles["power"]}`}>
                            <span className={styles["currency-icon"]}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap-icon lucide-zap">
                                    <path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/>
                                </svg>
                            </span>
                            <span className={styles["currency-amount"]}>{cards?.reduce((acc, card) => acc + card.power_slot, 0) || 0}</span>
                        </div>
                    </div>
                </header>

                <div className={styles["filter-bar"]}>
                    <div className={styles["filter-main"]}>
                        <input type="text" className={styles["search-input"]} placeholder="Поиск карты..." />
                        <div className={styles["filter-buttons"]}>
                            <button className={`${styles["filter-btn"]} ${cardsCategory === "all" ? styles["active"] : null}`} onClick={() => setCardsCategory("all")}>Все</button>
                            <button className={`${styles["filter-btn"]} ${cardsCategory === "rare" ? styles["active"] : null}`} onClick={() => setCardsCategory("rare")}>Редкие</button>
                            <button className={`${styles["filter-btn"]} ${cardsCategory === "epic" ? styles["active"] : null}`} onClick={() => setCardsCategory("epic")}>Эпические</button>
                            <button className={`${styles["filter-btn"]} ${cardsCategory === "legendary" ? styles["active"] : null}`} onClick={() => setCardsCategory("legendary")}>Легендарные</button>
                        </div>
                    </div>
                </div>

                <main className={styles["cards-grid"]}>

                    {cards?.reduce((acc, card) => acc + card.card_quantity, 0) === undefined ? (
                        <p>У вас нет карт данной категории.</p>
                    ) : cards && cards.length > 0 ? (
                        cards.map(card => {
                            const lvlName = card.lvl_name.toLowerCase();
                            return (
                                <div key={card.card_id} className={styles["card-3d-wrapper"]}>
                                    <div className={styles["card-inner"]}>
                                        <div className={`${styles["game-card"]} ${styles[lvlName]} ${styles["front"]}`}>
                                            <div className={styles["card-shine"]}></div>
                                            <div className={styles["card-header"]}>
                                                <span className={styles["card-cost"]} title="Занимает 15 слотов силы">15</span>
                                                <span className={`${styles["card-rarity"]} ${styles[lvlName]}`}>{card.lvl_name}</span>
                                            </div>
                                            <div className={styles["card-artwork"]}>
                                                <img src={`${api.API_BASE_URL}/${card.card_avatar}`} alt="artwork" />
                                            </div>
                                            <div className={styles["card-body"]}>
                                                <div className={`${styles["card-title"]} ${styles[lvlName]}`}>{card.card_name}</div>
                                                <div className={styles["card-description"]}>
                                                    {card.card_description}
                                                </div>
                                            </div>
                                            <div className={styles["card-footer"]}>
                                                <div className={`${styles["stat-badge"]} ${styles["attack-badge"]}`}>
                                                    <span className={styles["stat-icon"]}>⚔️</span>
                                                    <span className={styles["stat-value"]}>{card.card_damage}</span>
                                                </div>
                                                <div className={`${styles["stat-badge"]} ${styles["protection-badge"]}`}>
                                                    <span className={styles["stat-icon"]}>🛡️</span>
                                                    <span className={styles["stat-value"]}>{card.card_protection}</span>
                                                </div>
                                            </div>
                                            <div className={styles["card-count"]}>x{card.card_quantity}</div>
                                        </div>
                                        <div className={styles["game-card-back"]}>
                                            <div className={styles["card-back-logo"]}>🔮</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <DefaultLoading />
                    )}

                    {/*<div className={styles["card-3d-wrapper"]}>*/}
                    {/*    <div className={styles["card-inner"]}>*/}
                    {/*        <div className={`${styles["game-card"]} ${styles["legendary"]} ${styles["front"]}`}>*/}
                    {/*            <div className={styles["card-shine"]}></div>*/}
                    {/*            <div className={styles["card-header"]}>*/}
                    {/*                <span className={styles["card-cost"]} title="Занимает 15 слотов силы">15</span>*/}
                    {/*                <span className={`${styles["card-rarity"]} ${styles["legendary"]}`}>Legendary</span>*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-artwork"]}>*/}
                    {/*                <img src="../../../src/assets/Default_Background.png" alt="artwork" />*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-body"]}>*/}
                    {/*                <div className={styles["card-title"]}>Кибер-Ассасин</div>*/}
                    {/*                <div className={styles["card-description"]}>*/}
                    {/*                    <strong>Крик души:</strong> Наносит 30 ед. урона случайному врагу при появлении.*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-footer"]}>*/}
                    {/*                <div className={`${styles["stat-badge"]} ${styles["attack-badge"]}`}>*/}
                    {/*                    <span className={styles["stat-icon"]}>⚔️</span>*/}
                    {/*                    <span className={styles["stat-value"]}>75</span>*/}
                    {/*                </div>*/}
                    {/*                <div className={`${styles["stat-badge"]} ${styles["protection-badge"]}`}>*/}
                    {/*                    <span className={styles["stat-icon"]}>🛡️</span>*/}
                    {/*                    <span className={styles["stat-value"]}>140</span>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-count"]}>x1</div>*/}
                    {/*        </div>*/}
                    {/*        <div className={styles["game-card-back"]}>*/}
                    {/*            <div className={styles["card-back-logo"]}>🔮</div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className={styles["card-3d-wrapper"]}>*/}
                    {/*    <div className={styles["card-inner"]}>*/}
                    {/*        <div className={`${styles["game-card"]} ${styles["epic"]} ${styles["front"]}`}>*/}
                    {/*            <div className={styles["card-shine"]}></div>*/}
                    {/*            <div className={styles["card-header"]}>*/}
                    {/*                <span className={styles["card-cost"]} title="Занимает 15 слотов силы">15</span>*/}
                    {/*                <span className={`${styles["card-rarity"]} ${styles["epic"]}`}>Epic</span>*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-artwork"]}>*/}
                    {/*                <img src="../../../src/assets/Default_Background.png" alt="artwork" />*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-body"]}>*/}
                    {/*                <div className={styles["card-title"]}>Кибер-Ассасин</div>*/}
                    {/*                <div className={styles["card-description"]}>*/}
                    {/*                    <strong>Крик души:</strong> Наносит 30 ед. урона случайному врагу при появлении.*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-footer"]}>*/}
                    {/*                <div className={`${styles["stat-badge"]} ${styles["attack-badge"]}`}>*/}
                    {/*                    <span className={styles["stat-icon"]}>⚔️</span>*/}
                    {/*                    <span className={styles["stat-value"]}>75</span>*/}
                    {/*                </div>*/}
                    {/*                <div className={`${styles["stat-badge"]} ${styles["protection-badge"]}`}>*/}
                    {/*                    <span className={styles["stat-icon"]}>🛡️</span>*/}
                    {/*                    <span className={styles["stat-value"]}>140</span>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-count"]}>x1</div>*/}
                    {/*        </div>*/}
                    {/*        <div className={styles["game-card-back"]}>*/}
                    {/*            <div className={styles["card-back-logo"]}>🔮</div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className={styles["card-3d-wrapper"]}>*/}
                    {/*    <div className={styles["card-inner"]}>*/}
                    {/*        <div className={`${styles["game-card"]} ${styles["front"]}`} style={{ borderColor: "rgba(255,255,255,0.15)" }}>*/}
                    {/*            <div className={styles["card-shine"]}></div>*/}
                    {/*            <div className={styles["card-header"]}>*/}
                    {/*                <span className={styles["card-cost"]} style={{ background: 'radial-gradient(circle, #94a3b8 0%, #475569 100%)", "box-shadow: 0 0 10px #475569' }} title="Занимает 5 слотов силы">5</span>*/}
                    {/*                <span className={styles["card-rarity"]} style={{ color: "#94a3b8" }}>Common</span>*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-artwork"]}>*/}
                    {/*                <img src="../../../src/assets/Default_Background.png" alt="artwork" />*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-body"]}>*/}
                    {/*                <div className={styles["card-title"]} style={{ color: "#cbd5e1" }}>Рядовой Дрон</div>*/}
                    {/*                <div className={styles["card-description"]}>*/}
                    {/*                    Обычный разведывательный юнит. Без особых умений.*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div className={styles["card-footer"]}>*/}
                    {/*                <div className={`${styles["stat-badge"]} ${styles["attack-badge"]}`}>*/}
                    {/*                    <span className={styles["stat-icon"]}>⚔️</span>*/}
                    {/*                    <span className={styles["stat-value"]}>15</span>*/}
                    {/*                </div>*/}
                    {/*                <div className={`${styles["stat-badge"]} ${styles["protection-badge"]}`}>*/}
                    {/*                    <span className={styles["stat-icon"]}>🛡️</span>*/}
                    {/*                    <span className={styles["stat-value"]}>30</span>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*            <div className={`${styles["card-count"]} ${styles["max-copies"]}`}>x3</div>*/}
                    {/*        </div>*/}
                    {/*        <div className={styles["game-card-back"]}>*/}
                    {/*            <div className={styles["card-back-logo"]}>🔮</div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </main>
            </div>

            <Footer/>
        </div>
        );
};