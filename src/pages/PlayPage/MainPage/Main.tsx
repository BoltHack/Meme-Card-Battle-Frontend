import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// import { Helmet } from "react-helmet-async";
// import toast from "react-hot-toast";

import styles from "./Card.Main.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

// import api from "../../../api/api.ts";
// import usePageRender from "../../../tools/PageRender.ts";
// import { LoadingPage } from "../../LoadingPage/Loading.tsx";
// import { ErrorPage } from "../../ErrorPage/Error.tsx";

// interface PlayerData {
//   name: string;
//   id: string;
//   role: string;
// }

// interface TitleSettings {
//   title: string;
// }

interface Props {
  isGameFound: boolean;
  actibeTab: string;
}

import { playFunctions } from "../Play/Play.tsx";

export const MainPage = ({ isGameFound }: Props) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const { loading, error } = usePageRender(
  //   `${api.API_BASE_URL}/play/`,
  // );

  const findGame = (type: string) => {
    playFunctions.foundGame(type);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsClosing(false);
    setIsOpen(true);
  };
  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsClosing(true);

    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    playFunctions.handleChangeHeaderState(true);
  }, []);

  // useEffect(() => {
  //   if (!data || !data.id) return;

  //   console.log("Data", data);
  // }, [data]);

  // if (loading) return <LoadingPage />;
  // if (error) return <ErrorPage error={error} />;

  return (
    <div className={styles["body-wrapper"]}>
      <div className={styles["parallax-body"]}></div>
      <div className={styles["parallax-wrapper"]}>
        <div className={styles["smoke-glow smoke-red"]}></div>
        <div className={styles["smoke-glow smoke-blue"]}></div>
        <div className={styles["smoke-glow smoke-purple"]}></div>

        <div className={styles["halftone-overlay"]}></div>

        <div className={styles["star-particles"]}></div>

        <div className={styles["shard shard-1"]}></div>
        <div className={styles["shard shard-2"]}></div>

        <svg
          className={`${styles["lightning"]} ${styles["lightning-right"]}`}
          viewBox="0 0 24 24"
        >
          <path d="M19 9h-6l3-7L5 13h6l-3 9z" />
        </svg>

        <div className={styles["card-layer"]}>
          <div className={`${styles["premium-card"]} ${styles["card-king"]}`}>
            <div></div>
            <div className={styles["card-suit-center"]}>?</div>
            <div className={styles["card-suit-bottom"]}></div>
          </div>

          <div
            className={`${styles["premium-card"]} ${styles["card-ace-spades"]}`}
          >
            <div></div>
            <div className={styles["card-suit-center"]}>?</div>
            <div className={styles["card-suit-bottom"]}></div>
          </div>

          <div
            className={`${styles["premium-card"]} ${styles["card-ace-diamonds"]}`}
          >
            <div></div>
            <div className={styles["card-suit-center"]}>?</div>
            <div className={styles["card-suit-bottom"]}></div>
          </div>
        </div>
      </div>

      <div className={styles["buttons-container"]}>
        <div className={styles["epic-title"]}>
          <h1>MEME CARD BATTLE</h1>
          {/*<p>Meme card battle</p>*/}
        </div>

        <br />

        {!isGameFound ? (
          <div className={styles["btn"]} onClick={toggleMenu}>
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
              className="lucide lucide-play-icon lucide-play"
            >
              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
            </svg>

            <span>Начать играть</span>
          </div>
        ) : (
          <div className={`${styles["btn"]} ${styles["btn-disable"]}`}>
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
              className="lucide lucide-play-off-icon lucide-play-off"
            >
              <path d="m10.215 4.56 9.79 5.71a2 2 0 0 1 .003 3.458l-.393.23" />
              <path d="m16.042 16.042-8.034 4.686A2 2 0 0 1 5 19V5" />
              <path d="m2 2 20 20" />
            </svg>

            <span>Начать играть</span>
          </div>
        )}

        <div
          className={styles["btn"]}
          onClick={() => playFunctions.handleChangeTab("play:profile")}
        >
          {/*<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid-icon lucide-layout-grid">*/}
          {/*    <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>*/}
          {/*</svg>*/}
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
            className="lucide lucide-playing-cards-fan-icon lucide-playing-cards-fan"
          >
            <path d="M12.65 7.65a2 2 0 012.629-1.046l5.51 2.374a2 2 0 011.046 2.628l-3.957 9.184a2 2 0 01-2.628 1.046l-5.51-2.374a2 2 0 01-1.046-2.628z" />
            <path d="M18 7.777V4a2 2 0 00-2-2h-6a2 2 0 00-2 2v10a2 2 0 001.137 1.805" />
            <path d="m8 4.389-4.364.809a2 2 0 00-1.602 2.33l1.822 9.833a2 2 0 002.331 1.602l2.542-.47" />
          </svg>
          <span>Коллекция</span>
        </div>

        <div
          className={styles["btn"]}
          onClick={() => playFunctions.handleChangeTab("play:cases")}
        >
          <svg
            xmlns="http://w3.org"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 10h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" />
            <path d="M21 10V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
            <path d="M3 10h18v3H3z" />
            <path d="M10 13h4v4h-4z" />
          </svg>
          <span>Кейсы</span>
        </div>

        <div
          className={styles["btn"]}
          onClick={() => playFunctions.handleChangeTab("play:shop")}
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
            className="lucide lucide-shopping-cart-icon lucide-shopping-cart"
          >
            <path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" />
            <path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" />
            <circle cx="18" cy="20" r="2" />
            <circle cx="8" cy="20" r="2" />
          </svg>
          <span>Магазин</span>
        </div>

        <div
          className={styles["btn"]}
          onClick={() => playFunctions.handleChangeTab("play:settings")}
          // onClick={() => SoundPlayer("btn_move")}
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
            className="lucide lucide-settings-icon lucide-settings"
          >
            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>Настройки</span>
        </div>

        {/* <div className={styles["btn"]} onClick={() => navigate("/how-to-play")}>
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
            className="lucide lucide-message-circle-question-mark-icon lucide-message-circle-question-mark"
          >
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          <span>Как играть</span>
        </div> */}
      </div>

      {/* <div className={styles["actions-menu"]}>
        <div className={styles["actions-menu-container"]}>
          <div className={styles["actions-menu-tool"]}>
            <div
              className={`${styles["actions-menu-icon"]} ${isActionOpen === "navigation" ? styles["active"] : null}`}
              onClick={() => toggleActionsMenu("navigation")}
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
                className="lucide lucide-text-align-justify-icon lucide-text-align-justify"
              >
                <path d="M3 5h18" />
                <path d="M3 12h18" />
                <path d="M3 19h18" />
              </svg>
            </div>

            {isActionOpen === "navigation" && (
              <div
                className={`${styles["actions-menu-top"]} ${isActionOpen === null ? styles["closing"] : ""}`}
              >
                <div className={styles["actions-menu-header"]}>
                  <span className={styles["actions-menu-title"]}>
                    Навигация
                  </span>
                  <div
                    className={styles["close-btn"]}
                    onClick={() => setIsActionOpen(null)}
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
                      className="lucide lucide-x-icon lucide-x"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </div>
                </div>

                <ul className={styles["actions-menu-list"]}>
                  <li>
                    <Link
                      to="/privacy-policy"
                      className={styles["actions-menu-btn"]}
                      onClick={() => navigate("/")}
                    >
                      <span>Политика конфиденциальности</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms-of-use"
                      className={styles["actions-menu-btn"]}
                    >
                      <span>Условия использования</span>
                    </Link>
                  </li>
                  <br />
                  <li>
                    <Link
                      to="/help-center"
                      className={styles["actions-menu-btn"]}
                      onClick={() => navigate("/")}
                    >
                      <span>Справочный центр</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/support" className={styles["actions-menu-btn"]}>
                      <span>Поддержка</span>
                    </Link>
                  </li>
                  <br />
                  <li>
                    <Link to="/blog" className={styles["actions-menu-btn"]}>
                      <span>Блог</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/news" className={styles["actions-menu-btn"]}>
                      <span>Новости</span>
                    </Link>
                  </li>
                  <br />
                  <li>
                    <Link to="/about-us" className={styles["actions-menu-btn"]}>
                      <span>О нас</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/company-information"
                      className={styles["actions-menu-btn"]}
                    >
                      <span>Информация о компании</span>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div> */}

      {/*<div className={styles["actions-menu-tool"]}>*/}

      {/*    <div className={`${styles["actions-menu-icon"]} ${isActionOpen === "other" ? styles["active"] : null }`}*/}
      {/*         onClick={() => toggleActionsMenu("other")}*/}
      {/*    >*/}
      {/*        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-menu-icon lucide-square-menu">*/}
      {/*            <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h10"/>*/}
      {/*        </svg>*/}
      {/*    </div>*/}

      {/*    {(isActionOpen === "other") && (*/}
      {/*        <div className={`${styles["actions-menu-top"]} ${!isActionOpen === null ? styles["closing"] : null}`}>*/}
      {/*            <div className={styles["actions-menu-header"]}>*/}
      {/*                <span className={styles["actions-menu-title"]}>Другое</span>*/}
      {/*                <div className={styles["close-btn"]} onClick={() => setIsActionOpen(null)}>*/}
      {/*                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x">*/}
      {/*                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>*/}
      {/*                    </svg>*/}
      {/*                </div>*/}
      {/*            </div>*/}

      {/*            <ul className={styles["actions-menu-list"]}>*/}
      {/*                <li>*/}
      {/*                    <Link to="/blog" className={styles["actions-menu-btn"]}>*/}
      {/*                        <span>Блог</span>*/}
      {/*                    </Link>*/}
      {/*                </li>*/}
      {/*            </ul>*/}
      {/*        </div>*/}
      {/*    )}*/}

      {/*</div>*/}

      {/* <div className={styles["actions-menu-tool"]}>
            <div
              className={`${styles["actions-menu-icon"]} ${isActionOpen === "player" ? styles["active"] : null}`}
              onClick={() => toggleActionsMenu("player")}
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
                className="lucide lucide-square-user-icon lucide-square-user"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
              </svg>
            </div>

            {isActionOpen === "player" && (
              <div
                className={`${styles["actions-menu-top"]} ${isActionOpen === null ? styles["closing"] : ""}`}
              >
                <div className={styles["actions-menu-header"]}>
                  <span className={styles["actions-menu-title"]}>Аккаунт</span>
                  <div
                    className={styles["close-btn"]}
                    onClick={() => setIsActionOpen(null)}
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
                      className="lucide lucide-x-icon lucide-x"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </div>
                </div> */}

      {/* <ul className={styles["actions-menu-list"]}>
                  {data?.role === "Admin" && (
                    <>
                      <li>
                        <div
                          className={styles["actions-menu-btn"]}
                          onClick={() => navigate("/admin/panel")}
                        >
                          <span>Админка</span>
                        </div>
                      </li>
                      <li>
                        <div
                          className={styles["actions-menu-btn"]}
                          onClick={() => getRandomCards()}
                        >
                          <span>Получить случайную карту</span>
                        </div>
                      </li>
                      <br />
                    </>
                  )}
                  <li>
                    <div
                      className={styles["actions-menu-btn"]}
                      onClick={() => navigate("/how-to-play")}
                    >
                      <span>Как играть</span>
                    </div>
                  </li>
                  {!data?.id ? (
                    <li>
                      <div
                        className={styles["actions-menu-btn"]}
                        onClick={() => navigate("/auth/sign-in")}
                      >
                        <span>Войти в аккаунт</span>
                      </div>
                    </li>
                  ) : (
                    <li>
                      <div
                        className={styles["actions-menu-btn"]}
                        onClick={playFunctions.logout}
                      >
                        <span>Выйти</span>
                      </div>
                    </li>
                  )}
                </ul> */}
      {/* </div>
            )}
          </div>
        </div>
      </div> */}

      {isOpen && (
        <div className={styles["menu-wrapper"]}>
          <div className={styles["bg-glow"]}></div>
          <div
            className={`${styles["menu-card"]} ${isClosing ? styles["closing"] : ""}`}
          >
            <span className={styles["close-menu-btn"]} onClick={closeMenu}>
              <div className={styles["close-menu-svg"]}>
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
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
            </span>
            <h2>Выберите режим</h2>
            <div className={styles["options"]}>
              <div
                className={styles["menu-btn"]}
                onClick={() => findGame("search")}
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
                  className="lucide lucide-square-user-icon lucide-square-user"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                </svg>

                <span>Игрок против игрока</span>
              </div>

              <div
                className={styles["menu-btn"]}
                onClick={() => navigate("/bot-settings")}
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
                >
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
                <span>Игрок против бота</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
