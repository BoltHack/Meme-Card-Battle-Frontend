import { ChangeEvent, useRef, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import styles from "./Card.Profile.module.css";
import CardsDesign_styles from "../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";

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
  cards_count: number;
  renderData: RenderData[];
  stats: StatsData;
}

export const ProfilePage = ({ title }: TitleSettings) => {
  const [cards, setCards] = useState<RenderData[]>([]);
  const [stats, setStats] = useState<StatsData>({} as StatsData);

  const [cardsCategory, setCardsCategory] = useState<string | "all">("all");

  const [searchInput, setSearchInput] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const cardFount = useRef<boolean | false>(false);

  const profile_state = JSON.parse(sessionStorage.getItem('profile_state') || '{}');

  const { data, loading, error } = usePageRender<PlayerData>(
    `${api.API_BASE_URL}/api/my-cards/${cardsCategory}`,
  );

  let updatedState = {
    search_value: ""
  };

  const handleSearchCard = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setSearchInput(value);
  }

  const handleSearchCardKeyDown = (e: any, value: string) => {
    if ((e.key === "Enter" || e.keyCode === 13) && value.trim().length > 0) {
      searchCard(value);
      setSearchInput("");
    }
  }

  const clearSearchState = () => {
    updatedState = { ...profile_state, search_value: "" };
    sessionStorage.setItem("profile_state", JSON.stringify(updatedState));

    cardFount.current = false;
    setCurrentSearch("");

    const cards = document.querySelectorAll("#cardsGrid section") as NodeListOf<HTMLElement>;
    cards.forEach((card) => {
      card.style.display = "block";
    });
  }

  const searchCard = (value: string) => {
    if (value.length < 1) return;

    cardFount.current = false;
    const searchValue = value.toLowerCase().trim();

    updatedState = { ...profile_state, search_value: searchValue };
    sessionStorage.setItem("profile_state", JSON.stringify(updatedState));

    setCurrentSearch(searchValue);

    const searchCard = document.querySelectorAll("#cardsGrid section") as NodeListOf<HTMLElement>;

    Array.from(searchCard).forEach((card: HTMLElement) => {
      const titleElement = card.querySelector(`.${CardsDesign_styles["card-title"]}`);

      const searchTitle = titleElement?.textContent?.toLowerCase() ?? "";

      if (searchTitle.includes(searchValue)) {
        cardFount.current = true;
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  } 

  useEffect(() => {
    if (!data?.id) return;

    setCards(data.renderData || []);
    setStats(data.stats || ({} as StatsData));

    const searchTimer = setTimeout(() => {
      if (profile_state?.search_value?.length > 0) {
        searchCard(profile_state.search_value);
      }
    }, 100);

    return () => {
      clearTimeout(searchTimer);
      sessionStorage.removeItem("profile_state");
    }
  }, [data]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

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
                <img
                  src={`${api.API_BASE_URL}/uploads/UserCovers/${data?.id}/UserProfile.jpg`}
                  className={styles["avatar"]}
                />
                <div className={styles["username"]}>{data?.name}</div>
              </div>

              <div className={styles["user-level"]}>
                <span className={styles["level-badge"]}>LVL {stats?.lvl}</span>
                <div
                  className={styles["level-bar-bg"]}
                  title="Опыт до следующего уровня"
                >
                  {/*<div className={styles["level-bar-fill"]} style={{ width: "65%" }}></div>*/}
                  <div
                    className={styles["level-bar-fill"]}
                    style={{ width: `${stats?.lvl}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={styles["progress-container-row"]}>
              <div className={styles["collection-progress-box"]}>
                <div className={styles["progress-text"]}>
                  Коллекция: <span>{data?.cards_count}</span> / 250
                </div>
                <div className={styles["progress-bar-bg"]}>
                  {data?.cards_count && Number(data?.cards_count) > 120 ? (
                    <div
                      className={styles["progress-bar-fill"]}
                      style={{
                        width: `calc(${data?.cards_count || 0}px - 30px)`,
                      }}
                    ></div>
                  ) : (
                    <div
                      className={styles["progress-bar-fill"]}
                      style={{ width: `${data?.cards_count || 0}px` }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles["balance-container"]}>
            <div className={`${styles["balance-item"]} ${styles["gold"]}`}>
              <span className={styles["currency-icon"]}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="url(#goldGrad)"
                    stroke="#fef08a"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="6"
                    stroke="#eab308"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <path
                    d="M12 7V17M12 7C11 7 9.5 7.5 9.5 9.5C9.5 11.5 14.5 11 14.5 13C14.5 15 12 15 12 15M12 15C10.5 15 9.5 14.5 9.5 14M12 7C13 7 14.5 7.5 14.5 8.5"
                    stroke="#fef08a"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="goldGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 3L2 9L12 22L22 9L18 3H6Z"
                    fill="url(#gemGrad)"
                    stroke="#67e8f9"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 3L12 9M18 3L12 9M2 9H22M6 3H18M12 9V22"
                    stroke="#22d3ee"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  <defs>
                    <linearGradient
                      id="gemGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-zap-icon lucide-zap"
                >
                  <path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" />
                </svg>
              </span>
              <span className={styles["currency-amount"]}>
                {cards
                  ?.map((card) => card.power_slot * card.card_quantity)
                  .reduce((acc, card) => acc + card, 0) || 0}
              </span>
            </div>
          </div>
        </header>

        <div className={styles["filter-bar"]}>
          <div className={styles["filter-main"]}>
            <input
              type="search"
              className={styles["search-input"]}
              placeholder="Поиск карты..."
              onChange={handleSearchCard}
              value={searchInput}
              onKeyDown={(e) => handleSearchCardKeyDown(e, searchInput)}
            />
            <div className={styles["filter-buttons"]}>
              <button
                onClick={() => setCardsCategory("all")}
                className={`${styles["filter-btn"]} ${cardsCategory === "all" ? styles["active"] : null}`}
              >
                Все
                {cardsCategory === "all" && (
                  <span className={styles["filter-btn-cards-count"]}>
                    {cards?.reduce(
                      (acc, card) => acc + card.card_quantity,
                      0,
                    ) || 0}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCardsCategory("default")}
                className={`${styles["filter-btn"]} ${cardsCategory === "default" ? styles["active"] : null}`}
              >
                Обычные
                {cardsCategory === "default" && (
                  <span className={styles["filter-btn-cards-count"]}>
                    {cards?.reduce(
                      (acc, card) => acc + card.card_quantity,
                      0,
                    ) || 0}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCardsCategory("rare")}
                className={`${styles["filter-btn"]} ${cardsCategory === "rare" ? styles["active"] : null}`}
              >
                Редкие
                {cardsCategory === "rare" && (
                  <span className={styles["filter-btn-cards-count"]}>
                    {cards?.reduce(
                      (acc, card) => acc + card.card_quantity,
                      0,
                    ) || 0}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCardsCategory("epic")}
                className={`${styles["filter-btn"]} ${cardsCategory === "epic" ? styles["active"] : null}`}
              >
                Эпические
                {cardsCategory === "epic" && (
                  <span className={styles["filter-btn-cards-count"]}>
                    {cards?.reduce(
                      (acc, card) => acc + card.card_quantity,
                      0,
                    ) || 0}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCardsCategory("legendary")}
                className={`${styles["filter-btn"]} ${cardsCategory === "legendary" ? styles["active"] : null}`}
              >
                Легендарные
                {cardsCategory === "legendary" && (
                  <span className={styles["filter-btn-cards-count"]}>
                    {cards?.reduce(
                      (acc, card) => acc + card.card_quantity,
                      0,
                    ) || 0}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {currentSearch?.length > 0 && (
          <div className={styles["search-result-container"]}>
            <div className={styles["search-result-content"]}>
              <p
                className={styles["search-result-back"]}
                onClick={clearSearchState}
              >
                Назад
              </p>
              <div className={styles["search-result-slash"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    d="m9.216 7.619 4.204 4.204a.25.25 0 0 1 0 .354l-4.204 4.204a.75.75 0 0 0 1.06 1.061l4.205-4.204a1.75 1.75 0 0 0 0-2.475l-4.204-4.205a.75.75 0 0 0-1.061 1.06"
                  ></path>
                </svg>
              </div>
              <p className={styles["search-result"]}>
                {profile_state.search_value}
              </p>
            </div>

            {!cardFount.current && (
              <div className={styles["search-result-content"]}>
                <p className={styles["search-result"]}>Карта не найдена.</p>
              </div>
            )}
          </div>
        )}

        <main className={CardsDesign_styles["cards-grid"]} id="cardsGrid">
          {cards?.reduce((acc, card) => acc + card.card_quantity, 0) ===
          undefined ? (
            <p>У вас нет карт данной категории.</p>
          ) : cards && cards.length > 0 ? (
            cards.map((card) => {
              const lvlName = card.lvl_name.toLowerCase();
              return (
                <section
                  key={card.card_id}
                  className={CardsDesign_styles["card-3d-wrapper"]}
                >
                  <div className={CardsDesign_styles["card-inner"]}>
                    <div
                      className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[lvlName.toLowerCase()]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                    >
                      <div className={CardsDesign_styles["card-shine"]}></div>
                      <div className={CardsDesign_styles["card-header"]}>
                        <span
                          className={CardsDesign_styles["card-cost"]}
                          title={`Занимает ${card.power_slot} слотов силы`}
                        >
                          {card.power_slot}
                        </span>
                        <span
                          className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                        >
                          {card.lvl_name}
                        </span>
                      </div>
                      <div className={CardsDesign_styles["card-artwork"]}>
                        <img
                          src={`${api.API_BASE_URL}/${card.card_avatar}`}
                          alt="artwork"
                        />
                      </div>
                      <div className={CardsDesign_styles["card-body"]}>
                        <div
                          className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                        >
                          {card.card_name}
                        </div>
                        <div className={CardsDesign_styles["card-description"]}>
                          {card.card_description}
                        </div>
                      </div>
                      <div className={CardsDesign_styles["card-footer"]}>
                        <div
                          className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["attack-badge"]}`}
                        >
                          <span className={CardsDesign_styles["stat-icon"]}>
                            ⚔️
                          </span>
                          <span className={CardsDesign_styles["stat-value"]}>
                            {card.card_damage}
                          </span>
                        </div>
                        <div
                          className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                        >
                          <span className={CardsDesign_styles["stat-icon"]}>
                            🛡️
                          </span>
                          <span className={CardsDesign_styles["stat-value"]}>
                            {card.card_protection}
                          </span>
                        </div>
                      </div>
                      <div className={styles["card-count"]}>
                        x{card.card_quantity}
                      </div>
                    </div>
                    <div className={CardsDesign_styles["game-card-back"]}>
                      <div className={CardsDesign_styles["card-back-logo"]}>
                        🔮
                      </div>
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <DefaultLoading />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};
