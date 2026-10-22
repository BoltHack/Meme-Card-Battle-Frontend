import { useEffect, useState } from "react";

import styles from "./Card.Header.module.css";

interface userInfo {
  name: string;
  money: number;
  coins: number;
  lvl: number;
  xp: number;
}

interface Props {
  activeTab: string;
  userInfo: userInfo;
}

import { playFunctions } from "../Play/Play";

export const Header = ({ activeTab, userInfo }: Props) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean | false>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();

        if (!document.fullscreenElement) {
          document.documentElement
            .requestFullscreen()
            .catch((err) => console.log("Ошибка перехода:", err));
        } else {
          document.exitFullscreen();
        }
      }
    };

    const handleResize = () => {
      const isNowFull = document.fullscreenElement !== null;
      if (isNowFull) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.addEventListener("fullscreenchange", handleResize);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Ошибка при попытке полноэкранного режима: ${err.message}`,
        );
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const formattedCurrency = (count: number): string => {
    const formattedCount = new Intl.NumberFormat("fr-FR", {
      notation: "standard",
      maximumFractionDigits: 1,
    }).format(count);

    return formattedCount.toLowerCase();
  };

  const maxXP =
    userInfo.lvl < 100 ? Math.round(Math.pow(userInfo.lvl, 1.5) * 2500) : 0;
  // const maxXP = Math.ceil(Math.pow(userInfo.lvl, 1.5) * 2500);

  return (
    <>
      <header className={styles["header-container"]}>
        <div className={styles["header-content"]}>
          <div className={styles["left-side-elements"]}>
            <div
              className={`${styles["header-btn"]} ${styles["btn-right-border"]}`}
              onClick={() =>
                activeTab === "play:main"
                  ? playFunctions.handleChangeTab("play:shop")
                  : playFunctions.handleChangeTab("play:main")
              }
            >
              {activeTab === "play:main" ? (
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
                  className="lucide lucide-shopping-cart-icon lucide-shopping-cart"
                >
                  <path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" />
                  <path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" />
                  <circle cx="18" cy="20" r="2" />
                  <circle cx="8" cy="20" r="2" />
                </svg>
              ) : (
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
                  className="lucide lucide-arrow-left"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              )}
            </div>
            <div
              className={`${styles["header-btn"]} ${styles["btn-right-border"]}`}
              onClick={() => playFunctions.toggleFriendsMenu(true)}
            >
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
                className="lucide lucide-users-round"
              >
                <path d="M18 21a8 8 0 0 0-16 0" />
                <circle cx="10" cy="8" r="5" />
                <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
              </svg>
            </div>
            {/* <div
              className={`${styles["header-btn"]} ${styles["btn-right-border"]}`}
            >
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
                className="lucide lucide-bell preview-icon"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
              </svg>
            </div> */}

            <div className={styles["lvl-info"]}>
              <div className={styles["lvl-info-badge"]}>
                <span>Уровень</span> <strong>{userInfo.lvl}</strong>
              </div>
            </div>
            <div className={styles["user-level"]}>
              <div className={styles["user-lvl-elements"]}>
                <span className={styles["user-name"]}>{userInfo.name}</span>
                <div
                  className={styles["level-bar-bg"]}
                  title="Опыт до следующего уровня"
                >
                  <div
                    className={styles["level-bar-fill"]}
                    style={{
                      width: `${userInfo.lvl < 100 ? Math.min(Math.max((userInfo.xp / maxXP) * 100, 0), 100) : 100}%`,
                    }}
                  ></div>
                </div>
                <span className={styles["level-badge"]}>
                  XP {formattedCurrency(userInfo.xp)}{" "}
                  {userInfo.lvl < 100 ? "/ " + formattedCurrency(maxXP) : ""}
                </span>
              </div>
            </div>
          </div>
          <div className={styles["right-side-elements"]}>
            <div className={styles["player-balance-info"]}>
              <div
                className={`${styles["balance-item"]} ${styles["coins"]}`}
                style={{ marginBottom: "auto" }}
              >
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
                  {formattedCurrency(userInfo.coins)}
                </span>
              </div>
              <div className={styles["balance-line"]}></div>
              <div
                className={`${styles["balance-item"]} ${styles["money"]}`}
                style={{ marginTop: "auto" }}
              >
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
                  {formattedCurrency(userInfo.money)}
                </span>
              </div>
            </div>
            <div
              className={`${styles["header-btn"]} ${styles["btn-left-border"]}`}
              onClick={toggleFullscreen}
            >
              <span className={styles["keydown-help"]}>F11</span>
              {isFullScreen ? (
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
                  className="lucide lucide-minimize-icon lucide-minimize"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              ) : (
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
                  className="lucide lucide-maximize-icon lucide-maximize"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              )}
            </div>
            <div
              className={`${styles["header-btn"]} ${styles["btn-left-border"]}`}
              onClick={
                activeTab === "play:main"
                  ? playFunctions.logout
                  : () => playFunctions.handleChangeTab("play:main")
              }
            >
              {activeTab === "play:main" ? (
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
                  className="lucide lucide-square-arrow-right-enter"
                >
                  <path d="m10 16 4-4-4-4" />
                  <path d="M3 12h11" />
                  <path d="M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
                </svg>
              ) : (
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
                  className="lucide lucide-house"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
