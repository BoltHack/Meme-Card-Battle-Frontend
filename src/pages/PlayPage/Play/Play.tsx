import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import toast from "react-hot-toast";

import styles from "./Card.Play.module.css";
import body_styles from "../../../tools/global_stylesheets/Card.Body_styles.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import usePageRender from "../../../tools/PageRender.ts";

import { Header } from "../Header/Header.tsx";

import { ErrorPage } from "../../ErrorPage/Error.tsx";
import { LoadingPage } from "../../LoadingPage/Loading.tsx";

import { ProfilePage } from "../ProfilePage/Profile.tsx";
import { MainPage } from "../MainPage/Main.tsx";
import { CasesPage } from "../CasesPage/Cases.tsx";
import { ShopPage } from "../ShopPage/Shop.tsx";
import { SettingsPage } from "../SettingsPage/SettingsPanel/SettingsPanel.tsx";
import { GamePage } from "../GamePage/Game.tsx";

interface TitleSettings {
  title: string;
}

let play_game_type = "";
let play_game_key = "";

const PlayNavigation = [
  "play:main",
  "play:profile",
  "play:cases",
  "play:shop",
  "play:settings",
  "play:game",
];

export const playFunctions = {
  handleChangeTab: (tab: string) => {
    console.log(tab);
  },
  foundGame: (type: string) => {
    console.log(type);
  },
  logout: (e: any) => {
    console.log(e);
  },
  updateUserInfo: (coins: number) => {
    console.log(coins);
  },
};

export const PlayPage = ({ title }: TitleSettings) => {
  const [activeTab, setActiveTab] = useState<string>(PlayNavigation[0]);

  const { data, loading, error, socket } = usePageRender(
    `${api.API_BASE_URL}/api/play`,
  );

  useEffect(() => {
    // const active_tab_state = JSON.parse(
    //   sessionStorage.getItem("active_tab_state") || "{}",
    // );

    playFunctions.handleChangeTab = (tab: string) => {
      // console.log("edit_id 1", edit_id);
      setActiveTab((prevTab) => {
        console.log("Предыдущая вкладка:", prevTab);
        console.log("Новая вкладка:", tab);
        // let setTab = "";

        // const regex = /play:game:type_([^/]+)\/key_(.+)/;
        // const match = tab.match(regex);

        // if (match) {
        //   console.log("yes");

        //   const gameType = match[1];
        //   const gameKey = match[2];

        //   game_type = gameType;
        //   game_key = gameKey;
        //   setTab = "play:game";
        // } else {
        //   console.log("no");
        //   setTab = tab;
        // }

        // const updatedState = {
        //   ...active_tab_state,
        //   previousTab: prevTab,
        //   currentTab: tab,
        // };
        // sessionStorage.setItem(
        //   "active_tab_state",
        //   JSON.stringify(updatedState),
        // );
        sessionStorage.setItem("active_tab", tab);
        return tab;
      });
    };

    return () => {
      playFunctions.handleChangeTab = () => {};
      play_game_type = "";
      play_game_key = "";
    };
  }, [activeTab]);

  useEffect(() => {
    playFunctions.foundGame = (type: string) => {
      if (!data?.id) {
        navigate("/auth/sign-in");
        return;
      }
      if (type === "search") {
        setIsGameFound(true);
        console.log("search game...", data?.id);
        socket.emit("search_game", {
          type: true,
          player_id: data?.id,
        });
        gameFoundTimerStart();
      } else if (type === "cancel") {
        setIsGameFound(false);
        gameFoundTimerReset();
        socket.emit("search_game", {
          type: false,
          player_id: data?.id,
        });
      } else {
        setIsGameFound(false);
        gameFoundTimerReset();
        socket.emit("search_game", {
          type: false,
          player_id: data?.id,
        });
      }
    };

    return () => {
      playFunctions.foundGame = () => {};
    };
  }, [data]);

  useEffect(() => {
    playFunctions.logout = async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const response = await axios.post(`${api.API_BASE_URL}/auth/logout`);

        const data = response.data;

        console.log("Успешный logout!");
        toast.dismiss();
        toast.success(data.success || "Вы вышли из системы");

        localStorage.removeItem("token");

        timeoutRef.current = window.setTimeout(() => {
          navigate("/auth/sign-in");
        }, 200);

        return response.data;
      } catch (error: any) {
        const errorMessage =
          error?.response?.data.error || "Произошла ошибка при выходе";
        console.log("Ошибка logout:", errorMessage);
      }
    };

    return () => {
      playFunctions.logout = () => {};
    };
  }, []);
  useEffect(() => {
    playFunctions.updateUserInfo = (coins: number) => {
      setUserInfo((prev) => ({
        ...prev,
        coins: coins,
      }));
    };

    return () => {
      playFunctions.updateUserInfo = () => {};
    };
  }, []);

  const navigate = useNavigate();

  // const [isOpen, setIsOpen] = useState<boolean | false>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isGameFound, setIsGameFound] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [userInfo, setUserInfo] = useState({
    name: "",
    money: 0,
    coins: 0,
    lvl: 0,
  });

  const gameFoundTimerReset = useCallback(() => {
    if (timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    setIsRunning(false);
    setSeconds(0);

    socket.emit("search_game", {
      type: false,
      player_id: data?.id,
    });
  }, [data?.id]);

  const gameFoundTimerStart = useCallback(() => {
    if (isRunning) return;

    if (timerId.current) {
      gameFoundTimerReset();
    }

    setIsRunning(true);

    timerId.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }, [isRunning, gameFoundTimerReset]);

  const gameFountTimerFormat = (time: number) => {
    const totalSeconds = Number(time) || 0;
    if (totalSeconds <= 0) return "0 с";

    const getMinutes = Math.floor(totalSeconds / 60);
    const getSeconds = totalSeconds % 60;

    const minutesStr = getMinutes > 0 ? `${getMinutes} м ` : "";
    const secondsStr =
      getSeconds > 0 || getMinutes === 0 ? `${getSeconds} с` : " 0 с";

    return (minutesStr + secondsStr).trim();
  };

  useEffect(() => {
    if (!data || !data.renderData) return;

    setUserInfo({
      name: data.renderData.name,
      money: data.renderData.money,
      coins: data.renderData.coins,
      lvl: data.renderData.lvl,
    });
  }, [data]);

  useEffect(() => {
    if (!data || !data.id) return;

    const active_tab = sessionStorage.getItem("active_tab");
    if (active_tab) {
      setActiveTab(active_tab);
    }

    const sendInitialData = () => {
      socket.emit("search_game", {
        type: false,
        player_id: data.id,
      });
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      sendInitialData();
    }

    socket.on("connect", sendInitialData);

    socket.on("found_game", (data) => {
      const { game_type, game_key } = data;

      toast.dismiss();
      toast.success("Противник найден! Удачной игры!");

      setTimeout(() => {
        playFunctions.foundGame("cancel");
        playFunctions.handleChangeTab("play:game");
      }, 1000);
      play_game_type = game_type;
      play_game_key = game_key;
    });

    socket.on("game_error_handler", (message) => {
      playFunctions.foundGame("cancel");

      toast.dismiss();
      toast.error(message);
    });

    return () => {
      sessionStorage.setItem("active_tab", "play:main");
      socket.off("connect", sendInitialData);
      socket.off("search_game");
      socket.off("found_game");
      socket.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (timerId.current) clearInterval(timerId.current);
      console.log("Сокет (play) отключен, подписки сняты");
    };
  }, [data, socket]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  if (activeTab === PlayNavigation[5])
    return <GamePage game_type={play_game_type} game_key={play_game_key} />;

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {/* <Header /> */}

      {isGameFound && (
        <div className={styles["game-search-container"]}>
          <div className={styles["game-search-content"]}>
            <div className={styles["game-search-info"]}>
              <div className={styles["game-search-info-content"]}>
                <div className={styles["game-search-search-type"]}>
                  <span className={styles["text"]}>Поиск игроков</span>
                </div>

                <div
                  className={`${styles["game-search-info-text"]} ${styles["waiting-time"]}`}
                >
                  <span className={styles["search-text"]}>
                    Среднее время ожидания
                  </span>
                  <span className={styles["search-timer"]}>50 с</span>
                </div>

                <div
                  className={`${styles["game-search-info-text"]} ${styles["current-waiting-time"]}`}
                >
                  <span className={styles["search-text"]}>
                    Текущее время ожидания
                  </span>
                  <span className={styles["search-timer"]}>
                    {gameFountTimerFormat(seconds)}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles["game-search-actions"]}>
              <button onClick={() => playFunctions.foundGame("cancel")}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={body_styles["body-wrapper"]}>
        <Header userInfo={userInfo} activeTab={activeTab} />
        {activeTab === PlayNavigation[0] && (
          <MainPage isGameFound={isGameFound} />
        )}
        {activeTab === PlayNavigation[1] && <ProfilePage />}
        {activeTab === PlayNavigation[2] && <CasesPage />}
        {activeTab === PlayNavigation[3] && <ShopPage />}
        {activeTab === PlayNavigation[4] && <SettingsPage />}
      </div>
    </>
  );
};
