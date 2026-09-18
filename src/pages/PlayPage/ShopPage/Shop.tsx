import { useEffect, useState } from "react";

import styles from "./Card.Shop.module.css";
// import CardsDesign_styles from "../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import usePageRender from "../../../tools/PageRender.ts";
import { LoadingPage } from "../../LoadingPage/Loading.tsx";
import { ErrorPage } from "../../ErrorPage/Error.tsx";

import toast from "react-hot-toast";
import { playFunctions } from "../Play/Play.tsx";

interface CaseFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  quantity: string;
  price: string;
  prioriry: string;
}

export const ShopPage = () => {
  const [cases, setCases] = useState<CaseFormat[]>([]);

  const initialShopDataState = {
    product: "",
    quantity: 0,
  };

  const [shopData, setShopData] = useState(initialShopDataState);

  // const [caseContent, setCaseContent] = useState<[]>([]);

  // const [isCaseMenuOpen, setIsCaseMenuOpen] = useState<boolean | false>(false);

  const [isCaseLoading, setIsCaseLoading] = useState<string | null>(null);

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/api/shop`,
  );

  const buyCase = async (case_id: string) => {
    setIsCaseLoading(case_id);

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/api/case/${case_id}/buy`,
        {
          withCredentials: true,
        },
      );
      if (response.data?.success) {
        toast.success(response.data?.success);
        setIsCaseLoading(null);
        setShopData({
          product: response.data.shopData.product,
          quantity: response.data.shopData.quantity,
        });
        playFunctions.updateUserInfo(response.data.coins);
      }
      return response.data;
    } catch (error) {
      console.log("error", error);
      setIsCaseLoading(null);
      const errorMessage = error?.response?.data.error;
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
    }
  };

  // const openCase = async (case_id: string) => {
  //   setIsCaseLoading(case_id);

  //   try {
  //     const response = await axios.post(
  //       `${api.API_BASE_URL}/api/case/${case_id}/content/get`,
  //       {
  //         withCredentials: true,
  //       },
  //     );

  //     if (response.data?.success) {
  //       setIsCaseLoading(null);
  //       setCaseContent(response.data.content);
  //       setIsCaseMenuOpen(true);
  //     }

  //     console.log("response", response.data);

  //     return response.data;
  //   } catch (error) {
  //     console.log("error", error);
  //     setIsCaseLoading(null);
  //   }
  // };

  useEffect(() => {
    if (!data || !Array.isArray(data.renderData)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setCases(data.renderData);
    console.log("data", data);
  }, [data]);

  if (loading || cases.length < 1) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className={styles["body"]}>
      <div className={styles["shop-container"]}>
        <header className={styles["shop-header"]}>
          <h1>Магазин</h1>
        </header>

        <main className={styles["grid-container"]}>
          <header>
            <h1>Кейсы</h1>
            <p>Испытай удачу и собери свою коллекцию редких карт</p>
          </header>

          <div className={styles["grid-content"]}>
            {cases && cases.length > 0
              ? cases
                  .sort((a, b) => a.priority.localeCompare(b.priority))
                  // .sort((a, b) => a.prioriry.localeCompare(b.prioriry))
                  .map((cs, index) => {
                    return (
                      <section
                        key={index}
                        className={`${styles["case-card"]} ${styles["case-" + cs.rarity.toLowerCase()]}`}
                      >
                        <div className={styles["case-visual"]}>
                          <div className={styles["glow-source"]}></div>
                          <div className={styles["card-pack-3d"]}>
                            <div
                              className={`${styles["layer"]} ${styles["layer-3"]}`}
                            ></div>
                            <div
                              className={`${styles["layer"]} ${styles["layer-2"]}`}
                            ></div>
                            <div
                              className={`${styles["layer"]} ${styles["layer-1"]}`}
                            >
                              <div
                                data-icon={cs.icon}
                                className={`${styles["card-pattern"]} after:content-[attr(data-icon)]`}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className={styles["case-info"]}>
                          <span className={styles["badge"]}>{cs.rarity}</span>
                          <h3>
                            {cs.name} {cs.quantity} шт.
                          </h3>
                          <p className={styles["case-desc"]}>
                            {cs.description}
                          </p>
                          <div className={styles["case-footer"]}>
                            <div className={styles["price-block"]}>
                              <svg
                                className={styles["currency-svg"]}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://w3.org"
                              >
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
                              <span className={styles["price"]}>
                                {cs.price}
                              </span>
                            </div>
                            <button
                              className={styles["buy-btn"]}
                              onClick={() => buyCase(cs.id)}
                            >
                              <span>
                                {isCaseLoading === cs.id
                                  ? "Загрузка..."
                                  : "Купить"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </section>
                    );
                  })
              : null}

            {/* <section
              className={`${styles["case-card"]} ${styles["case-default"]}`}
            >
              <div className={styles["case-visual"]}>
                <div className={styles["glow-source"]}></div>
                <div className={styles["card-pack-3d"]}>
                  <div
                    className={`${styles["layer"]} ${styles["layer-3"]}`}
                  ></div>
                  <div
                    className={`${styles["layer"]} ${styles["layer-2"]}`}
                  ></div>
                  <div className={`${styles["layer"]} ${styles["layer-1"]}`}>
                    <div
                      data-icon={iconFromDB}
                      className={`${styles["card-pattern"]} after:content-[attr(data-icon)]`}
                      // style={{ "--card-icon": `"${iconFromDB}"` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className={styles["case-info"]}>
                <span className={styles["badge"]}>Default</span>
                <h3>Обычный кейс</h3>
                <p className={styles["case-desc"]}>
                  Базовый набор карт для новичков. Шанс выпадения редких
                  предметов снижен.
                </p>
                <div className={styles["case-footer"]}>
                  <div className={styles["price-block"]}>
                    <svg
                      className={styles["currency-svg"]}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://w3.org"
                    >
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
                    <span className={styles["price"]}>150</span>
                  </div>
                  <button className={styles["buy-btn"]}>
                    <span>Купить</span>
                  </button>
                </div>
              </div>
            </section>

            <section
              className={`${styles["case-card"]} ${styles["case-rare"]}`}
            >
              <div className={styles["case-visual"]}>
                <div className={styles["glow-source"]}></div>
                <div className={styles["card-pack-3d"]}>
                  <div
                    className={`${styles["layer"]} ${styles["layer-3"]}`}
                  ></div>
                  <div
                    className={`${styles["layer"]} ${styles["layer-2"]}`}
                  ></div>
                  <div className={`${styles["layer"]} ${styles["layer-1"]}`}>
                    <div className={styles["card-pattern"]}></div>
                  </div>
                </div>
              </div>
              <div className={styles["case-info"]}>
                <span className={styles["badge"]}>Rare</span>
                <h3>Редкий кейс</h3>
                <p className={styles["case-desc"]}>
                  Популярный выбор. Содержит карты улучшенного качества со
                  спецэффектами.
                </p>
                <div className={styles["case-footer"]}>
                  <div className={styles["price-block"]}>
                    <svg
                      className={styles["currency-svg"]}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://w3.org"
                    >
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
                    <span className={styles["price"]}>450</span>
                  </div>
                  <button className={styles["buy-btn"]}>
                    <span>Купить</span>
                  </button>
                </div>
              </div>
            </section>

            <section
              className={`${styles["case-card"]} ${styles["case-epic"]}`}
            >
              <div className={styles["case-visual"]}>
                <div className={styles["glow-source"]}></div>
                <div className={styles["card-pack-3d"]}>
                  <div
                    className={`${styles["layer"]} ${styles["layer-3"]}`}
                  ></div>
                  <div
                    className={`${styles["layer"]} ${styles["layer-2"]}`}
                  ></div>
                  <div className={`${styles["layer"]} ${styles["layer-1"]}`}>
                    <div className={styles["card-pattern"]}></div>
                  </div>
                </div>
              </div>
              <div className={styles["case-info"]}>
                <span className={styles["badge"]}>Epic</span>
                <h3>Эпический кейс</h3>
                <p className={styles["case-desc"]}>
                  Максимальный шанс на выпадение ультра-редких и лимитированных
                  карт.
                </p>
                <div className={styles["case-footer"]}>
                  <div className={styles["price-block"]}>
                    <svg
                      className={styles["currency-svg"]}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://w3.org"
                    >
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
                    <span className={styles["price"]}>1,200</span>
                  </div>
                  <button className={styles["buy-btn"]}>
                    <span>Купить</span>
                  </button>
                </div>
              </div>
            </section>

            <section
              className={`${styles["case-card"]} ${styles["case-legendary"]}`}
            >
              <div className={styles["case-visual"]}>
                <div className={styles["glow-source"]}></div>
                <div className={styles["card-pack-3d"]}>
                  <div
                    className={`${styles["layer"]} ${styles["layer-3"]}`}
                  ></div>
                  <div
                    className={`${styles["layer"]} ${styles["layer-2"]}`}
                  ></div>
                  <div className={`${styles["layer"]} ${styles["layer-1"]}`}>
                    <div className={styles["card-pattern"]}></div>
                  </div>
                </div>
              </div>
              <div className={styles["case-info"]}>
                <span className={styles["badge"]}>Legendary</span>
                <h3>Легедарный кейс</h3>
                <p className={styles["case-desc"]}>
                  Шанс на выпадение легендарных и лимитированных карт.
                </p>
                <div className={styles["case-footer"]}>
                  <div className={styles["price-block"]}>
                    <svg
                      className={styles["currency-svg"]}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://w3.org"
                    >
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
                    <span className={styles["price"]}>2,500</span>
                  </div>
                  <button className={styles["buy-btn"]}>
                    <span>Купить</span>
                  </button>
                </div>
              </div>
            </section> */}
          </div>
        </main>
      </div>

      {/* {caseContent && caseContent.length > 0 ? (
        caseContent.map((ci) => {
          return (

          )
        })
      ): null} */}

      {/* {isCaseMenuOpen && (
        <div
          className={`${styles["modal-overlay"]} ${styles["active"]}`}
          id="caseModal"
        >
          <div className={styles["modal-window"]}>
            <button
              className={styles["modal-close-btn"]}
              id="closeModalBtn"
              onClick={() => setIsCaseMenuOpen(false)}
            >
              &times;
            </button>

            <div className={styles["modal-header"]}>
              <h2 id="modalCaseTitle">Открытие кейса</h2>
              <p>Испытай свою удачу!</p>
            </div>

            <div className={styles["roulette-wrapper"]}>
              <div className={styles["roulette-marker"]}></div>
              <div className={styles["roulette-tape"]} id="rouletteTape">
                {caseContent && caseContent.length > 0
                  ? caseContent.map((card, index) => {
                      return (
                        <div
                          key={index}
                          className={`${styles["card-3d-wrapper"]}`}
                        >
                          <div className={CardsDesign_styles["card-inner"]}>
                            <div
                              className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles["hand_card"]} ${CardsDesign_styles[card.rarity.toLowerCase()]} ${CardsDesign_styles[card.rarity.toLowerCase()]}`}
                            >
                              <div
                                className={CardsDesign_styles["card-shine"]}
                              ></div>
                              <div
                                className={CardsDesign_styles["card-header"]}
                              >
                                <span
                                  className={CardsDesign_styles["card-cost"]}
                                  title="Занимает 15 слотов силы"
                                >
                                  {card.power_slot}
                                </span>
                                <span
                                  className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[card.rarity.toLowerCase()]}`}
                                >
                                  {card.rarity}
                                </span>
                              </div>
                              <div
                                className={CardsDesign_styles["card-artwork"]}
                              >
                                <img
                                  src={`${api.API_BASE_URL}/${card.avatar}`}
                                  alt="artwork"
                                />
                              </div>
                              <div className={CardsDesign_styles["card-body"]}>
                                <div
                                  className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[card.rarity.toLowerCase()]}`}
                                >
                                  {card.name}
                                </div>
                                <div
                                  className={
                                    CardsDesign_styles["card-description"]
                                  }
                                >
                                  {card.description}
                                </div>
                              </div>
                              <div
                                className={CardsDesign_styles["card-footer"]}
                              >
                                <div
                                  className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["attack-badge"]}`}
                                >
                                  <span
                                    className={CardsDesign_styles["stat-icon"]}
                                  >
                                    ⚔️
                                  </span>
                                  <span
                                    className={CardsDesign_styles["stat-value"]}
                                  >
                                    {card.damage}
                                  </span>
                                </div>
                                <div
                                  className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                                >
                                  <span
                                    className={CardsDesign_styles["stat-icon"]}
                                  >
                                    🛡️
                                  </span>
                                  <span
                                    className={CardsDesign_styles["stat-value"]}
                                  >
                                    {card.protection}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>

            <div className={styles["modal-actions"]}>
              <button className={styles["spin-start-btn"]} id="spinStartBtn">
                Испытать удачу
              </button>
            </div>

            <div className={styles["win-screen"]} id="winScreen">
              <div
                className={styles["win-card-container"]}
                id="winCardContainer"
              ></div>
              <h3 id="winCardName">Поздравляем!</h3>
              <button className={styles["claim-btn"]} id="claimBtn">
                Забрать карту
              </button>
            </div>
          </div>
        </div>
      )} */}

      {shopData.product && (
        <div className={styles["menu-wrapper"]}>
          <div className={styles["shop-modal"]}>
            <div className={styles["shop-modal-aside"]}>
              <div className={styles["cart-icon-container"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shopping-cart"
                >
                  <path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" />
                  <path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" />
                  <circle cx="18" cy="20" r="2" />
                  <circle cx="8" cy="20" r="2" />
                </svg>
              </div>
            </div>

            <div className={styles["shop-modal-main"]}>
              <button
                className={styles["close-btn"]}
                onClick={() => setShopData(initialShopDataState)}
              >
                &times;
              </button>

              <h2 className={styles["shop-modal-title"]}>
                ПОКУПКА ПРОИЗВЕДЕНА УСПЕШНО
              </h2>

              <p className={styles["subtitle"]}>Вы приобрели:</p>

              <div className={styles["purchase-item"]}>
                <span className={styles["item-name"]}>{shopData.product}</span>
                <span className={styles["item-count"]}>
                  {shopData.quantity}
                </span>
              </div>

              <div className={styles["button-container"]}>
                <button
                  className={styles["shop-action-btn"]}
                  onClick={() => setShopData(initialShopDataState)}
                >
                  {/* <span className={styles["key-hin"]}>ENTER</span> */}
                  ЗАКРЫТЬ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
