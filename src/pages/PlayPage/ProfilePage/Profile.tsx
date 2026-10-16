import { ChangeEvent, useRef, useEffect, useState } from "react";

import styles from "./Card.Profile.module.css";
import CardsDesign_styles from "../../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";

import useContentRender from "../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../../components/LoadingPage/Loading.tsx";
import { ContentLoading } from "../../../components/LoadingPage/ContentLoading.tsx";

// import { Header } from "../Header/Header.tsx";

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

// interface StatsData {
//   lvl: number;
//   money: number;
//   coins: number;
// }

interface PlayerData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  cards_count: number;
  renderData: RenderData[];
  // stats: StatsData;
}

import { playFunctions } from "../Play/Play.tsx";

export const ProfilePage = () => {
  const [cards, setCards] = useState<RenderData[]>([]);
  const [cardsCount, setCardsCount] = useState<number>(0);

  // const [stats, setStats] = useState<StatsData>({} as StatsData);

  const [cardsCategory, setCardsCategory] = useState<string | "all">("all");

  const [searchInput, setSearchInput] = useState<string>("");
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const cardFount = useRef<boolean | false>(false);

  const profile_state = JSON.parse(
    sessionStorage.getItem("profile_state") || "{}",
  );

  const { contentData, contentLoading, contentError } =
    useContentRender<PlayerData>(`${api.API_BASE_URL}/play/profile`);

  // const formattedCurrency = (count: number): string => {
  //   const formattedCount = new Intl.NumberFormat("en-US", {
  //     notation: "compact",
  //     compactDisplay: "short",
  //     maximumFractionDigits: 1,
  //   }).format(count);

  //   return formattedCount.toLowerCase();
  // };

  let updatedState = {
    search_value: "",
  };

  const handleSearchCard = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  const handleSearchCardKeyDown = (e: any, value: string) => {
    if ((e.key === "Enter" || e.keyCode === 13) && value.trim().length > 0) {
      searchCard(value);
      setSearchInput("");
    }
  };

  const clearSearchState = () => {
    updatedState = { ...profile_state, search_value: "" };
    sessionStorage.setItem("profile_state", JSON.stringify(updatedState));

    cardFount.current = false;
    setCurrentSearch("");

    const cards = document.querySelectorAll(
      "#cardsGrid section",
    ) as NodeListOf<HTMLElement>;
    cards.forEach((card) => {
      card.style.display = "block";
    });
  };

  const searchCard = (value: string) => {
    if (value.length < 1) return;

    cardFount.current = false;
    const searchValue = value.toLowerCase().trim();

    updatedState = { ...profile_state, search_value: searchValue };
    sessionStorage.setItem("profile_state", JSON.stringify(updatedState));

    setCurrentSearch(searchValue);

    const searchCard = document.querySelectorAll(
      "#cardsGrid section",
    ) as NodeListOf<HTMLElement>;

    Array.from(searchCard).forEach((card: HTMLElement) => {
      const titleElement = card.querySelector(
        `.${CardsDesign_styles["card-title"]}`,
      );

      const searchTitle = titleElement?.textContent?.toLowerCase() ?? "";

      if (searchTitle.includes(searchValue)) {
        cardFount.current = true;
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  };

  const handleGetCards = async (cards_category: string) => {
    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/play/cards/get/${cards_category}`,
        {
          withCredentials: true,
        },
      );

      console.log("response", response.data);

      setCardsCount(response.data.cards_count);
      setCards(response.data.renderData);

      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleGetCards(cardsCategory);
  }, [cardsCategory]);

  useEffect(() => {
    if (!contentData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    playFunctions.handleChangeHeaderState(true);

    // handleGetCards("all");
    // setCards(data.renderData || []);
    // setStats(data.stats || ({} as StatsData));

    const searchTimer = setTimeout(() => {
      if (profile_state?.search_value?.length > 0) {
        searchCard(profile_state.search_value);
      }
    }, 100);

    console.log("contentData", contentData);

    return () => {
      clearTimeout(searchTimer);
      sessionStorage.removeItem("profile_state");
    };
  }, [contentData]);

  if (contentLoading || !contentData) return <LoadingPage />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div className={styles["play-container"]}>
      <div className={styles["container"]}>
        <header className={styles["header-panel"]}>
          <div className={styles["user-block"]}>
            {/* <div className={styles["user-main-info"]}> */}
            {/* <div className={styles["user-profile"]}>
                <img
                  src={`${api.API_BASE_URL}/${contentData.renderData.avatar}`}
                  className={styles["avatar"]}
                />
                <div className={styles["username"]}>
                  {contentData?.renderData.name}
                </div>
              </div> */}

            {/* <div className={styles["user-level"]}>
                <span className={styles["level-badge"]}>LVL {stats?.lvl}</span>
                <div
                  className={styles["level-bar-bg"]}
                  title="Опыт до следующего уровня"
                >
                  <div className={styles["level-bar-fill"]} style={{ width: "65%" }}></div>
                  <div
                    className={styles["level-bar-fill"]}
                    style={{ width: `${stats?.lvl}%` }}
                  ></div>
                </div>
              </div> */}
            {/* </div> */}

            <div className={styles["progress-container-row"]}>
              <div className={styles["collection-progress-box"]}>
                <div className={styles["progress-text"]}>
                  Коллекция: <span>{cardsCount}</span> / 250
                </div>
                <div className={styles["progress-bar-bg"]}>
                  {cardsCount && Number(cardsCount) > 120 ? (
                    <div
                      className={styles["progress-bar-fill"]}
                      style={{
                        width: `calc(${cardsCount || 0}px - 30px)`,
                      }}
                    ></div>
                  ) : (
                    <div
                      className={styles["progress-bar-fill"]}
                      style={{ width: `${cardsCount || 0}px` }}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles["balance-container"]}>
            {/* <div className={`${styles["balance-item"]} ${styles["coins"]}`}>
              <span className={styles["currency-icon"]}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org">
                  <defs>
                    <linearGradient
                      id="coinGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#fcd34d" />
                      <stop offset="50%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                    <linearGradient
                      id="symbolGrad"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="url(#coinGrad)"
                    strokeWidth="2"
                    fill="rgba(21, 9, 49, 0.6)"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="7"
                    stroke="url(#coinGrad)"
                    strokeWidth="1"
                    strokeDasharray="2 1"
                    fill="none"
                  />
                  <path
                    d="M12 6L15 12L12 18L9 12L12 6Z"
                    fill="url(#symbolGrad)"
                  />
                  <path
                    d="M12 8L14 12L12 16L10 12L12 8Z"
                    fill="#b45309"
                    opacity="0.5"
                  />
                </svg>
              </span>
              <span className={styles["currency-amount"]}>
                {formattedCurrency(stats?.coins)}
              </span>
            </div>

            <div className={`${styles["balance-item"]} ${styles["money"]}`}>
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
                  className="lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                  <path d="M12 18V6" />
                </svg>
              </span>
              <span className={styles["currency-amount"]}>
                {formattedCurrency(stats?.money)}
              </span>
            </div> */}

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
              <p className={styles["search-result"]}>{currentSearch}</p>
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
                  className={`${
                    CardsDesign_styles["card-3d-wrapper"]
                  } ${CardsDesign_styles["card-3d-wrapper-anim"]}`}
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
            <ContentLoading />
          )}
        </main>
      </div>
    </div>
  );
};
