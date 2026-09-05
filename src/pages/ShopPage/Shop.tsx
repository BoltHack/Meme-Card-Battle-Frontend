// import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import styles from "./Card.Shop.module.css";

import api from "../../api/api.ts";
import usePageRender from "../../tools/PageRender.ts";
import { LoadingPage } from "../LoadingPage/Loading.tsx";
import { ErrorPage } from "../ErrorPage/Error.tsx";

import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";
import { Header } from "../../tools/PageTools/header_footer/Header.tsx";

interface TitleSettings {
  title: string;
}

export const ShopPage = ({ title }: TitleSettings) => {
  const { loading, error } = usePageRender(
    `${api.API_BASE_URL}/api/how-to-play`,
  );

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />

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
            <section
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
                    <div className={styles["card-pattern"]}></div>
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
                          <stop offset="0%" stop-color="#fcd34d" />
                          <stop offset="50%" stop-color="#fbbf24" />
                          <stop offset="100%" stop-color="#b45309" />
                        </linearGradient>
                        <linearGradient
                          id="symbolGrad"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stop-color="#ffffff" />
                          <stop offset="100%" stop-color="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="url(#coinGrad)"
                        stroke-width="2"
                        fill="rgba(21, 9, 49, 0.6)"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="7"
                        stroke="url(#coinGrad)"
                        stroke-width="1"
                        stroke-dasharray="2 1"
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
                    <span>Открыть</span>
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
                          <stop offset="0%" stop-color="#fcd34d" />
                          <stop offset="50%" stop-color="#fbbf24" />
                          <stop offset="100%" stop-color="#b45309" />
                        </linearGradient>
                        <linearGradient
                          id="symbolGrad"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stop-color="#ffffff" />
                          <stop offset="100%" stop-color="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="url(#coinGrad)"
                        stroke-width="2"
                        fill="rgba(21, 9, 49, 0.6)"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="7"
                        stroke="url(#coinGrad)"
                        stroke-width="1"
                        stroke-dasharray="2 1"
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
                    <span>Открыть</span>
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
                          <stop offset="0%" stop-color="#fcd34d" />
                          <stop offset="50%" stop-color="#fbbf24" />
                          <stop offset="100%" stop-color="#b45309" />
                        </linearGradient>
                        <linearGradient
                          id="symbolGrad"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stop-color="#ffffff" />
                          <stop offset="100%" stop-color="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="url(#coinGrad)"
                        stroke-width="2"
                        fill="rgba(21, 9, 49, 0.6)"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="7"
                        stroke="url(#coinGrad)"
                        stroke-width="1"
                        stroke-dasharray="2 1"
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
                    <span>Открыть</span>
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
                          <stop offset="0%" stop-color="#fcd34d" />
                          <stop offset="50%" stop-color="#fbbf24" />
                          <stop offset="100%" stop-color="#b45309" />
                        </linearGradient>
                        <linearGradient
                          id="symbolGrad"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stop-color="#ffffff" />
                          <stop offset="100%" stop-color="#f59e0b" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="url(#coinGrad)"
                        stroke-width="2"
                        fill="rgba(21, 9, 49, 0.6)"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="7"
                        stroke="url(#coinGrad)"
                        stroke-width="1"
                        stroke-dasharray="2 1"
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
                    <span>Открыть</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
