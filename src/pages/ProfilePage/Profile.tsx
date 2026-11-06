import { Helmet } from "react-helmet-async";
import { useOutletContext, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from "./Card.Profile.module.css";

import usePageRender from "../../tools/PageRender.ts";
import { LoadingPage } from "../../components/LoadingPage/Loading.tsx";
import { ErrorPage } from "../../components/ErrorPage/Error.tsx";

import { Footer } from "../../components/Footer/Footer.tsx";
import { Header } from "../../components/Header/Header.tsx";

interface FooterLinksContext {
  footerLinks?: any;
}

interface Params {
  user_name: string;
}

export const ProfilePage = () => {
  const { footerLinks } = useOutletContext<FooterLinksContext>() ?? {
    footerLinks: [],
  };

  const { user_name } = useParams<{ type: string }>() as Params;

  const [stats, setStats] = useState({
    name: "",
    avatar: "",
    coins: 0,
    money: 0,
    wins: 0,
    fires: 0,
    lvl: 0,
    xp: 0,
    gamesCount: 0,
    rating: 0,
  });

  const maxXP =
    stats.lvl < 100 ? Math.round(Math.pow(stats.lvl, 1.5) * 2500) : 0;

  const { data, loading, error, socket } = usePageRender(
    `/api/profile/${user_name}`,
  );

  const formattedCurrency = (count: number): string => {
    const formattedCount = new Intl.NumberFormat("fr-FR", {
      notation: "standard",
      maximumFractionDigits: 1,
    }).format(count);

    return formattedCount.toLowerCase();
  };

  useEffect(() => {
    if (!data || !data.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
    }

    const getStats = data?.renderData;

    const formattedStats = {
      name: getStats?.name || "",
      avatar: getStats?.avatar || "",
      coins: getStats?.coins || 0,
      money: getStats?.money || 0,
      wins: getStats?.wins || 0,
      fires: getStats?.fires || 0,
      lvl: getStats?.lvl || 0,
      xp: getStats?.xp || 0,
      gamesCount: getStats?.gamesCount || 0,
      rating: getStats?.rating || 0,
    };

    setStats(formattedStats);
  }, [data]);

  useEffect(() => {
    const socketDisconnect = () => {
      if (socket.connected) socket.disconnect();
    };

    const timerId = setTimeout(socketDisconnect, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [socket]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>Профиль {stats.name}</title>
      </Helmet>

      <Header />

      <div className={styles["profile-container"]}>
        <Link to="/ratings" className={styles["back-btn"]}>
          Рейтинги
        </Link>
        <header
          className={`${styles["profile-card"]} ${styles["profile-header"]}`}
        >
          <div className={styles["user-info"]}>
            <div className={styles["avatar-wrapper"]}>
              {stats.avatar && (
                <img
                  className={styles["avatar-img"]}
                  src={`/${stats.avatar}`}
                  alt="Avatar"
                />
              )}
            </div>
            <div className={styles["user-meta"]}>
              <h1 className={styles["nickname"]}>{stats.name}</h1>
              <div className={styles["xp-container"]}>
                <div className={styles["xp-bar-bg"]}>
                  <div
                    className={styles["xp-bar-fill"]}
                    style={{
                      width: `${stats.lvl < 100 ? Math.min(Math.max((stats.xp / maxXP) * 100, 0), 100) : 100}%`,
                    }}
                  ></div>
                </div>
                <span className={styles["xp-text"]}>
                  {/* {formattedCurrency(stats.xp)} / 4,000 XP */}
                  <span>XP </span>
                  <span>
                    {formattedCurrency(stats.xp)}{" "}
                    {stats.lvl < 100 ? "/ " + formattedCurrency(maxXP) : ""}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className={styles["level-badge"]}>LVL {stats.lvl}</div>
        </header>

        <div className={styles["profile-grid"]}>
          <section className={styles["profile-card"]}>
            <h2 className={styles["section-title"]}>Игровая статистика</h2>
            <div className={styles["stats-container"]}>
              <div className={styles["stat-box"]}>
                <span className={styles["stat-value"]}>{stats.gamesCount}</span>
                <span className={styles["stat-label"]}>Всего игр</span>
              </div>

              <div className={styles["stat-box"]}>
                <span
                  className={`${styles["stat-value"]} ${styles["text-win"]}`}
                >
                  {stats.wins}
                </span>
                <span className={styles["stat-label"]}>Победы</span>
              </div>

              <div className={styles["stat-box"]}>
                <span
                  className={`${styles["stat-value"]} ${styles["text-loss"]}`}
                >
                  {stats.fires}
                </span>
                <span className={styles["stat-label"]}>Поражения</span>
              </div>

              <div className={styles["stat-box"]}>
                <span
                  className={`${styles["stat-value"]} ${styles["text-rating"]}`}
                >
                  {stats.rating}
                </span>
                <span className={styles["stat-label"]}>Рейтинг MMR</span>
              </div>
            </div>
          </section>

          <section className={styles["profile-card"]}>
            <h2 className={styles["section-title"]}>Баланс</h2>
            <div className={styles["wallet-container"]}>
              <div className={styles["currency-item"]}>
                <div className={styles["currency-icon"]}>
                  <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="none"
                    xmlns="http://w3.org"
                    // style={{ filter: "drop-shadow(0 0 6px #ffcc00)" }}
                    style={{ filter: "drop-shadow(0 0 6px #ffffff)" }}
                  >
                    <defs>
                      <linearGradient
                        id="gem-grad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        {/* <stop offset="0%" stopColor="#fff066" /> */}
                        <stop offset="0%" stopColor="#ffffff" />
                        {/* <stop offset="100%" stopColor="#ff9900" /> */}
                        <stop offset="100%" stopColor="#6ab9db" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 2L3 9L12 22L21 9L12 2Z"
                      stroke="url(#gem-grad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 9H21"
                      stroke="url(#gem-grad)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 2L7 9L12 22L17 9L12 2Z"
                      stroke="url(#gem-grad)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className={styles["currency-info"]}>
                  <span
                    className={styles["currency-amount"]}
                    // style={{ color: "#ffcc00" }}
                    style={{ color: "#6ab9db" }}
                  >
                    {formattedCurrency(stats.money)}
                  </span>
                  <span className={styles["currency-name"]}>Кристаллы</span>
                </div>
              </div>

              <div className={styles["currency-item"]}>
                <div className={styles["currency-icon"]}>
                  <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="none"
                    xmlns="http://w3.org"
                    style={{ filter: "drop-shadow(0 0 6px #ff9900)" }}
                  >
                    <defs>
                      <linearGradient
                        id="coin-grad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#fcd34d" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="url(#coin-grad)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="6"
                      stroke="url(#coin-grad)"
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                    <path
                      d="M12 9V15M10 10.5H13.5C14 10.5 14.5 11 14.5 11.5C14.5 12 14 12.5 13.5 12.5H10.5C10 12.5 9.5 13 9.5 13.5C9.5 14 10 14.5 10.5 14.5H14"
                      stroke="url(#coin-grad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
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
                  </svg> */}
                </div>
                <div className={styles["currency-info"]}>
                  <span
                    className={styles["currency-amount"]}
                    style={{ color: "#fbbf24" }}
                  >
                    {formattedCurrency(stats.coins)}
                  </span>
                  <span className={styles["currency-name"]}>Коины</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer links={footerLinks} />
    </div>
  );
};
