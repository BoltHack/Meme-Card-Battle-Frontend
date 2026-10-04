import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import toast from "react-hot-toast";

import styles from "./Card.Play.module.css";
import invite_styles from "./Card.Invite_styles.module.css";
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

import { FriendListMenu } from "../FriendListMenu/Menu.tsx";

// interface FriendsPost {
//   id: string;
//   name: string;
//   lvl: number;
//   gameInfo: string;
//   isOnline: boolean;
// }

interface TitleSettings {
  title: string;
}

// import { SoundPlayer } from "../../../tools/global_scripts/SoundPlayer/SoundPlayer.ts";

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
  handleChangeHeaderState: (type: boolean) => {
    console.log(type);
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
  toggleFriendsMenu: (type: boolean) => {
    console.log(type);
  },
  inviteGame: (friendID: string) => {
    console.log(friendID);
  },
};

export const PlayPage = ({ title }: TitleSettings) => {
  const [activeTab, setActiveTab] = useState<string>(PlayNavigation[0]);
  const [headerState, setHeaderState] = useState<boolean | true>(true);

  const [friendsMenu, setFriendsMenu] = useState<boolean | false>(false);

  const { data, loading, error, socket } = usePageRender(
    `${api.API_BASE_URL}/play/play`,
  );

  useEffect(() => {
    playFunctions.handleChangeTab = (tab: string) => {
      if (tab !== "play:main") {
        playFunctions.handleChangeHeaderState(false);
      }
      // SoundPlayer("btn_move");
      setActiveTab((prevTab) => {
        console.log("Предыдущая вкладка:", prevTab);
        console.log("Новая вкладка:", tab);

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
    playFunctions.handleChangeHeaderState = (type: boolean) => {
      setHeaderState(type);
    };

    return () => {
      playFunctions.handleChangeHeaderState = () => {};
    };
  }, []);

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

  useEffect(() => {
    playFunctions.toggleFriendsMenu = (type: boolean) => {
      // handleChangeFriendsCategory("list");
      setFriendsMenu(type);
      // if (!type && data?.id) {
      //   socket.emit("user_register", { player_id: data?.id });
      // }
    };

    return () => {
      playFunctions.toggleFriendsMenu = () => {};
    };
  }, []);

  useEffect(() => {
    playFunctions.inviteGame = (friendID: string) => {
      socket.emit("invite_game_server", {
        type: "invite",
        action: "waiting",
        friendID: friendID,
      });
    };

    return () => {
      playFunctions.inviteGame = () => {};
    };
  }, []);

  const navigate = useNavigate();

  // const [isOpen, setIsOpen] = useState<boolean | false>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isGameFound, setIsGameFound] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inviteMenu, setInviteMenu] = useState<boolean | false>(false);

  const initialGameInviteState = {
    action: "",
    message: "",
    id: "",
    name: "",
    lvl: 0,
    avatar: "",
  };
  const [gameInvite, setGameInvite] = useState(initialGameInviteState);
  const gameInviteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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
  }, []);

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

  const toggleInviteMenu = (type: boolean) => {
    if (type) {
      setInviteMenu(true);
      setTimeout(() => setGameInvite(initialGameInviteState), 500);
    } else {
      setInviteMenu(false);
      setTimeout(() => setGameInvite(initialGameInviteState), 500);
    }
  };

  const handleInviteRequest = (type: string, action: string) => {
    socket.emit("invite_game_server", {
      type: type,
      action: action,
      friendID: gameInvite.id,
    });

    setInviteMenu(false);
    gameInviteTimeoutRef.current = setTimeout(
      () => setGameInvite(initialGameInviteState),
      500,
    );
    if (gameInviteTimeoutRef.current) {
      clearTimeout(gameInviteTimeoutRef.current);
    }
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

    socket.on("invite_game_client", (data: any) => {
      const { type, action, message, inviterData } = data;

      console.log("вам отправили запрос");

      if (type === "invite") {
        setGameInvite({
          action: action,
          message: message,
          id: inviterData.id,
          name: inviterData.name,
          lvl: inviterData.lvl,
          avatar: inviterData.avatar,
        });
        setInviteMenu(true);
      }

      if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
      notificationTimeoutRef.current = setTimeout(() => {
        if (!inviteMenu) return;
        toggleInviteMenu(false);
      }, 5000);

    });

    socket.on("game_error_handler", (message) => {
      playFunctions.foundGame("cancel");

      toast.dismiss();
      toast.error(message);
    });

    // setTimeout(() => SoundPlayer("background_music"), 500);

    return () => {
      sessionStorage.setItem("active_tab", "play:main");
      socket.off("connect", sendInitialData);
      socket.off("search_game");
      socket.off("found_game");
      socket.off("invite_game_client");
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

      {gameInvite.id && (
        <div
          className={`${invite_styles["game-notification"]} ${invite_styles[inviteMenu ? "show" : "hide"]}`}
        >
          <div className={invite_styles["avatar-container"]}>
            {gameInvite.avatar ? (
              <img
                src={`${api.API_BASE_URL}/${gameInvite.avatar}`}
                className={invite_styles["player-avatar"]}
              />
            ) : (
              <div className={invite_styles["player-avatar"]}></div>
            )}
            <span className={invite_styles["player-level"]}>
              {gameInvite.lvl} LVL
            </span>
          </div>

          <div className={invite_styles["notification-content"]}>
            <h4 className={invite_styles["player-name"]}>{gameInvite.name}</h4>
            <p className={invite_styles["notification-text"]}>
              {gameInvite.message}
            </p>
          </div>

          {gameInvite.action === "waiting" && (
            <div className={invite_styles["notification-actions"]}>
              <button
                className={`${invite_styles["btn"]} ${invite_styles["btn-accept"]}`}
                title="Принять"
                onClick={() => handleInviteRequest("game", "accept")}
              >
                ✔
              </button>
              <button
                className={`${invite_styles["btn"]} ${invite_styles["btn-decline"]}`}
                title="Отклонить"
                onClick={() => handleInviteRequest("invite", "reject")}
              >
                ✖
              </button>
            </div>
          )}
        </div>
      )}

      {friendsMenu && <FriendListMenu playerID={data?.id} />}

      <div className={body_styles["body-wrapper"]}>
        {headerState && <Header userInfo={userInfo} activeTab={activeTab} />}
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
