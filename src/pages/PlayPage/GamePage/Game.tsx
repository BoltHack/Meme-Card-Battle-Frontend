import { useBlocker } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { io, Socket } from "socket.io-client";

import styles from "./Card.Game.module.css";
import CardsDesign_styles from "../../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";
import laser_styles from "./Card.Laser_styles.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import toast from "react-hot-toast";

import { Game_Menus } from "./Game_Menus.tsx";
import { Game_CardDesk } from "./Game_CardDesk.tsx";

import usePageRender from "../../../tools/PageRender.ts";
import { ErrorPage } from "../../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../../components/LoadingPage/Loading.tsx";

// const socket: Socket = io(api.API_SOCKET_URL, {
//   autoConnect: false,
//   transports: ["websocket"],
// });

const socket = io("/", {
  autoConnect: false,
  transports: ["polling", "websocket"],
});

interface PlayerData {
  id: string | number;
  name: string;
  avatar: string;
  health: number;
  lvl: number;
  ult: number;

  game_key: string;
}

interface PlayersInfoResponse {
  data: PlayerData[];
}

interface CardData {
  menu_id: string;
  id: string;
  name: string;
  description: string;
  avatar: string;
  lvl: number;
  rarity: string;
  damage: number;
  protection: number;
  power_slot: number;

  _id: string;
}

// interface CardsPost {
//   id: string;
//   name: string;
//   description: string;
//   avatar: string;
//   lvl: number;
//   rarity: string;
//   damage: number;
//   protection: number;
//   power_slot: number;
// }

interface PlayerCardsResponse {
  cards_data?: CardData | CardData[];
}

interface Props {
  game_type: string;
  game_key: string;
}

import { playFunctions } from "../Play/Play.tsx";

import { SoundsPlayer } from "../../../tools/global_scripts/SoundsPlayer";
import { SoundFunctions } from "../../../tools/global_scripts/SoundsPlayer.tsx";

export const GameFunctions = {
  leaveGame_menu: (type: boolean) => {
    console.log(type);
  },
  gameCards_menu: (type: boolean) => {
    console.log(type);
  },
  useCard_menuq: (
    type: "open" | "close" | "useCard",
    data: CardData | undefined,
  ) => {
    console.log(type);
    console.log(data);
  },
};

export const GamePage = ({ game_type, game_key }: Props) => {
  const { data, loading, error } = usePageRender<PlayerData>(
    `/play/game/${game_type}/${game_key}`,
  );

  const [isReady, setIsReady] = useState<boolean | false>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean | false>(false);
  const [readyStateLoading, setReadyStateLoading] = useState<boolean | false>(
    false,
  );
  const [gameStartedInfo, setGameStartedInfo] = useState<boolean | false>(
    false,
  );

  const [isOpenLeaveMenu, setIsOpenLeaveMenu] = useState(false);

  const [isOpenGameCardsMenu, setIsOpenGameCardsMenu] = useState(true);
  const [isClosingGameCardsMenu, setIsClosingGameCardsMenu] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const [playersInfo, setPlayersInfo] = useState<any>(null);

  const gameKeyRef = useRef(game_key);
  const playersInfoRef = useRef(playersInfo);

  const isGameStartedRef = useRef(isGameStarted);
  const isReadyRef = useRef(isReady);
  const gameStartedInfoRef = useRef(gameStartedInfo);

  useEffect(() => {
    gameKeyRef.current = game_key;
  }, [game_key]);
  useEffect(() => {
    playersInfoRef.current = playersInfo;
  }, [playersInfo]);
  useEffect(() => {
    isGameStartedRef.current = isGameStarted;
  }, [isGameStarted]);
  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);
  useEffect(() => {
    gameStartedInfoRef.current = gameStartedInfo;
  }, [gameStartedInfo]);

  const useCardIdRef = useRef<string | null>(null);
  const initialCardState = {
    menu_id: "",
    rarity: "",
    avatar: "",
    name: "",
    description: "",
    damage: 0,
    protection: 0,
    power_slot: 0,
  };
  const [selectCard, setSelectCard] = useState(initialCardState);
  const [isOpenCardActionsMenu, setIsOpenCardActionsMenu] = useState(false);

  useEffect(() => {
    GameFunctions.leaveGame_menu = (type: boolean) => {
      if (type) {
        setIsOpenLeaveMenu(true);
      } else {
        setIsOpenLeaveMenu(false);
      }
    };
    return () => {
      GameFunctions.leaveGame_menu = () => {};
    };
  }, []);

  useEffect(() => {
    GameFunctions.gameCards_menu = (type: boolean) => {
      if (isGameStartedRef.current || isReadyRef.current) return;

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (type) {
        SoundFunctions.fixedVolumeSound("play", "menu_open", 0.2);
        setIsClosingGameCardsMenu(false);
        setIsOpenGameCardsMenu(true);
      } else {
        SoundFunctions.fixedVolumeSound("play", "menu_close_v2", 0.4);
        setIsClosingGameCardsMenu(true);
        timeoutRef.current = window.setTimeout(() => {
          setIsOpenGameCardsMenu(false);
          setIsClosingGameCardsMenu(false);
        }, 200);
      }
    };

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      GameFunctions.gameCards_menu = () => {};
    };
  }, []);

  useEffect(() => {
    GameFunctions.useCard_menu = (
      type: "open" | "close" | "useCard",
      data?: CardData | undefined,
    ) => {
      if (!isGameStartedRef.current) return;

      if (type === "open") {
        const cardInfo = data?.cardInfo as CardData;
        if (!cardInfo) return;
        useCardIdRef.current = cardInfo?.id;

        setSelectCard({
          menu_id: cardInfo.id,
          rarity: cardInfo.rarity,
          avatar: cardInfo.avatar,
          name: cardInfo.name,
          description: cardInfo.description,
          damage: cardInfo.damage,
          protection: cardInfo.protection,
          power_slot: cardInfo.power_slot,
        });

        setIsOpenCardActionsMenu(true);
      } else if (type === "useCard") {
        const useCardId = useCardIdRef.current;
        if (activePlayerCard === useCardId || !useCardId) return;

        setIsOpenCardActionsMenu(false);

        setHandList((prevHandList) =>
          prevHandList.filter((item) => item.menu_id !== useCardId),
        );

        setActivePlayerCard(useCardId);

        const currentPlayersInfo = playersInfoRef.current;

        socket.emit("select_card", {
          game_key: game_key,
          player_id: currentPlayersInfo?.playerInfo?.id,
          enemy_id: currentPlayersInfo?.enemyInfo?.id,
          card_id: useCardId,
        });
        setSelectCard(initialCardState);
      } else if (type === "close") {
        setSelectCard(initialCardState);
        setIsOpenCardActionsMenu(false);
      } else {
        setSelectCard(initialCardState);
        setIsOpenCardActionsMenu(false);
      }
    };

    return () => {
      GameFunctions.useCard_menu = () => {};
    };
  }, []);

  const [title, setTitle] = useState("");

  const [bodyLoader, setBodyLoader] = useState<boolean | false>(false);

  const [playerCard, setPlayerCard] = useState<CardData[]>([]);
  const [list, setList] = useState<CardData[]>([]);

  const [handList, setHandList] = useState<CardData[]>([]);
  const [enemyHandList, setEnemyHandList] = useState<number>(0);

  const [activePlayerCard, setActivePlayerCard] = useState<string | null>(null);
  const [activeEnemyCard, setActiveEnemyCard] = useState<boolean | false>(
    false,
  );

  const winnerIdRef = useRef<string | null>(null);

  const [isBlock, setIsBlock] = useState<boolean | true>(true);

  const [damageAnimation, setDamageAnimation] = useState<string | null>(null);

  const [activeScene, setActiveScene] = useState<boolean | false>(false);
  const [resultOverlay, setResultOverlay] = useState<boolean | false>(false);

  const [isCardSelectAnimationEnemy, setIsCardSelectAnimationEnemy] = useState<
    boolean | false
  >(false);

  // const [versusCards, setVersusCards] = useState<CardsPost[]>([]);
  const [versusCards, setVersusCards] = useState<any>(null);
  const [isVersus, setIsVersus] = useState<boolean | false>(false);

  const [winnerInfo, setWinnerInfo] = useState({
    name: null,
    exp: 0,
  });

  const versusTimerRef = useRef(null);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isBlock &&
      currentLocation.pathname !== nextLocation.pathname &&
      currentLocation.search === nextLocation.search,
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      toast.dismiss();
      toast.error("Вы не можете покинуть игру, пока она активна.");
    }
  }, [blocker]);

  const leaveGame = () => {
    setIsBlock(false);
    playFunctions.handleChangeTab("play:main");
    setTimeout(() => {
      window.location.reload();
      sessionStorage.setItem("screen_click", "true");
    }, 100);
  };

  const setDamageState = (player: string) => {
    setDamageAnimation(player);
    setTimeout(() => {
      setDamageAnimation(null);
      winnerIdRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // event.returnValue = '';
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handlePlayerCards = (data: PlayerCardsResponse) => {
    const { cards_data } = data;
    if (!cards_data) return;

    setPlayerCard((prevCards: CardData[]) => {
      if (Array.isArray(cards_data)) {
        const newUniqueCards = cards_data.filter(
          (newCard) => !prevCards.some((pCard) => pCard._id === newCard._id),
        );
        return [...prevCards, ...newUniqueCards];
      }

      const singleCard = cards_data;

      const isDuplicate = prevCards.some((card) => card._id === singleCard._id);
      if (isDuplicate) return prevCards;
      return [...prevCards, singleCard];
    });
  };

  useEffect(() => {
    if (!data || !data.id) return;

    let joinTimer: number;
    let cardsTimer: number;

    const sendInitialData = () => {
      clearTimeout(joinTimer);
      clearTimeout(cardsTimer);

      joinTimer = setTimeout(() => {
        socket.emit("join_game", {
          game_key: game_key,
          player_id: data.id,
        });
      }, 500);

      cardsTimer = setTimeout(() => {
        socket.emit("get_user_cards", { player_id: data.id });
        socket.emit("clear_game_cards", {
          game_key: game_key,
          player_id: data.id,
        });
      }, 1000);

      socket.emit("game_start", game_type);

      // if (
      //   game_type === "player_bot" ||
      //   game_type === "player_player"
      // ) {
      //   socket.emit("game_start", game_type);
      // }
    };

    if (socket.connected) {
      sendInitialData();
    }

    socket.on("connect", sendInitialData);

    const id = data?.id;

    socket.on("players_info", (data: PlayersInfoResponse) => {
      const updatedPlayer = data.data;

      const playerInfo_index = data.data.findIndex((up) => up.id === id);
      const enemyInfo_index = data.data.findIndex((up) => up.id !== id);

      const player_info = updatedPlayer[playerInfo_index];
      const enemy_info = updatedPlayer[enemyInfo_index];

      const formattedPlayersInfo = {
        playerInfo: {
          id: player_info?.id,
          name: player_info?.name,
          avatar: player_info?.avatar,
          health: player_info?.health,
          lvl: player_info?.lvl,
          ult: player_info?.ult,
        },
        enemyInfo: {
          id: enemy_info?.id,
          name: enemy_info?.name,
          avatar: enemy_info?.avatar,
          health: enemy_info?.health,
          lvl: enemy_info?.lvl,
          ult: enemy_info?.ult,
        },
      };

      setPlayersInfo(formattedPlayersInfo);

      const title =
        formattedPlayersInfo.playerInfo.name +
        " против " +
        formattedPlayersInfo.enemyInfo.name;

      setTitle(title);
    });

    socket.on("get_player_cards", handlePlayerCards);

    socket.on("select_battle_card", (data: any) => {
      const { card, menu_id } = data;

      if (card?.length < 1) return;

      const formattedCard = {
        menu_id: menu_id || "",
        id: card?._id || "",
        _id: card?._id || "",
        name: card?.card_name || "",
        description: card?.card_description || "",
        avatar: card?.card_avatar || "",
        lvl: card?.card_lvl_info?.lvl_number || 1,
        rarity: card?.card_lvl_info?.lvl_name || "Default",
        damage: card?.card_stats?.card_damage || 0,
        protection: card?.card_stats?.card_protection || 0,
        power_slot: card?.power_slot || 0,
      };

      setList((prevState) => [...prevState, formattedCard]);
      setHandList((prevState) => [...prevState, formattedCard]);
      setBodyLoader(false);
    });

    socket.on("game_cards_selected", (data) => {
      const { cards } = data;

      const playerCard_index = cards.findIndex((c) => c.playerId === id);
      const enemyCard_index = cards.findIndex((c) => c.playerId !== id);

      const player_card = cards[playerCard_index];
      const enemy_card = cards[enemyCard_index];

      const formattedCardsInfo = {
        playerCard: {
          playerName: playersInfoRef.current.playerInfo.name,
          id: player_card.id,
          name: player_card.name,
          description: player_card.description,
          avatar: player_card.avatar,
          lvl: player_card.lvl,
          rarity: player_card.rarity.toLowerCase(),
          damage: player_card.damage,
          protection: player_card.protection,
          power_slot: player_card.power_slot,
        },
        enemyCard: {
          playerName: playersInfoRef.current.enemyInfo.name,
          id: enemy_card.id,
          name: enemy_card.name,
          description: enemy_card.description,
          avatar: enemy_card.avatar,
          lvl: enemy_card.lvl,
          rarity: enemy_card.rarity.toLowerCase(),
          damage: enemy_card.damage,
          protection: enemy_card.protection,
          power_slot: enemy_card.power_slot,
        },
      };

      setVersusCards(formattedCardsInfo);

      if (versusTimerRef.current) {
        clearTimeout(versusTimerRef.current);
      }

      versusTimerRef.current = setTimeout(() => {
        setIsVersus(true);
      }, 500);
      // setTimeout(() => setIsVersus(true), 500);

      console.log("formattedCardsInfo", formattedCardsInfo);

      // toast.dismiss();
      // toast.success("Игроки выбрали свои карты!");
    });

    socket.on("error_handler", (message) => {
      toast.dismiss();
      toast.error(message);
      SoundFunctions.fixedVolumeSound("game", "error_notification", 0.4);

      // if (bodyLoader) {
      setBodyLoader(false);
      // }
      // if (readyStateLoading) {
      setReadyStateLoading(false);
      // }
    });

    socket.on("game_error", (type) => {
      if (type.toString() === "already_InGame") {
        leaveGame();

        toast.dismiss();
        toast.error("Вы уже находитесь в игре.");
        return;
      }
    });

    socket.on("enemy_hand_list", (action: string) => {
      if (action === "card_selected") {
        setActiveEnemyCard(true);
        setEnemyHandList((prevCount) => prevCount - 1);

        // setEnemyHandList((prevList) => {
        //   const lastIndex = prevList.length - 1;

        //   if (lastIndex < 0) return prevList;

        //   const updatedList = prevList.filter(
        //     (_, index) => index !== lastIndex,
        //   );

        //   return updatedList;
        // });
      } else if (action === "battle_card_selected") {
        setEnemyHandList((prevCount) => prevCount + 1);
      }
      if (action === "battle_card_removed") {
        setEnemyHandList((prevCount) => prevCount - 1);
      }
    });

    socket.on("game_cards_selected_result", (data) => {
      const { type, gameData } = data;

      if (type === "timer") {
        if (gameData.timer === 5) {
          SoundFunctions.playGameSound("versus_zoom");
        }
        if (gameData.timer === 0) {
          setVersusCards(null);
          setIsVersus(false);
          if (id === winnerIdRef.current) {
            setDamageState("player_damage");
          } else {
            setDamageState("enemy_damage");
          }
        }

        return;
      }
      if (type === "result") {
        const res = gameData.result;
        const winnerPlayer = playersInfoRef.current;
        winnerIdRef.current = gameData.winnerId;

        const winner =
          res.winnerId === winnerPlayer.playerInfo.id
            ? winnerPlayer.playerInfo.name
            : winnerPlayer.enemyInfo.name;

        if (res.status === "win") {
          setWinnerInfo({
            name: winner,
            exp: gameData.exp,
          });
          setTimeout(() => handleGameOver(), 7000);
        }
        if (res.status === "autowin") {
          setDamageState("player_damage");
          setWinnerInfo({
            name: winner,
            exp: 500,
          });
          setTimeout(() => handleGameOver(), 2000);
        }
        if (res.status === "draw") {
          setWinnerInfo({
            name: null,
            exp: 500,
          });
          setTimeout(() => handleGameOver(), 7000);
        }
        return;
      }
      if (type === "clear") {
        // setHandList(handList.filter(item => item.menu_id !== useCardIdRef));
        setActiveEnemyCard(false);
        setActivePlayerCard(null);
        return;
      }
    });

    const handleReadyState = (type: string) => {
      if (type === "user_ready") {
        SoundFunctions.playSound("success_notification");
        toast.success("К гою готов!");
        setIsReady(true);
      } else if (type === "game_start") {
        setIsReady(true);

        setTimeout(() => {
          SoundFunctions.fixedVolumeSound("game", "game_start", 0.5);
        }, 750);
        setTimeout(() => {
          setGameStartedInfo(true);
        }, 1000);
        setTimeout(() => {
          setIsGameStarted(true);
          setGameStartedInfo(false);
        }, 3000);
      }
      setReadyStateLoading(false);
    };

    socket.on("check_user_ready_state_client", handleReadyState);

    return () => {
      socket.off("get_user_cards");
      socket.off("select_battle_card");
      socket.off("players_info");
      socket.off("get_player_cards", handlePlayerCards);
      socket.off("select_battle_card");
      socket.off("error_handler");
      socket.off("game_error");
      socket.off("enemy_hand_list");
      socket.off("game_cards_selected");
      socket.off("game_cards_selected_result");
      socket.off("check_user_ready_state_client", handleReadyState);
      socket.off("connect", sendInitialData);
      // socket.disconnect();
      clearTimeout(joinTimer);
      clearTimeout(cardsTimer);
      console.log("Сокет (game) отключен, подписки сняты.");
    };
  }, [data]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   if (!isGameStarted) return;

  //   setTimeout(() => SoundFunctions.GameBackgroundMusic(), 500);

  //   return () => {
  //     SoundFunctions.StopGameBackgroundMusic();
  //   };
  // }, [isGameStarted]);

  (function () {
    const fpsDiv = document.createElement("div");

    fpsDiv.style.position = "fixed";
    fpsDiv.style.top = "10px";
    fpsDiv.style.left = "10px";
    fpsDiv.style.zIndex = "999999";
    fpsDiv.style.background = "rgba(0, 0, 0, 0.8)";
    fpsDiv.style.color = "#00ff00";
    fpsDiv.style.padding = "5px 10px";
    fpsDiv.style.fontFamily = "monospace";
    fpsDiv.style.fontSize = "16px";
    fpsDiv.style.borderRadius = "5px";
    fpsDiv.innerText = "FPS: ...";
    document.body.appendChild(fpsDiv);

    let lastTime = performance.now();
    let frames = 0;

    function calculateFps() {
      const now = performance.now();
      frames++;

      if (now >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        fpsDiv.innerText = `FPS: ${fps}`;

        fpsDiv.style.color = fps < 45 ? "#ff0000" : "#00ff00";

        frames = 0;
        lastTime = now;
      }

      if (!window.location.pathname.startsWith("/game")) {
        document.body.removeChild(fpsDiv);
        return;
      }
      requestAnimationFrame(calculateFps);
    }

    requestAnimationFrame(calculateFps);
  })();

  const handleGameOver = () => {
    setActiveScene(true);
    setTimeout(() => {
      setResultOverlay(true);
    }, 4500);
    setTimeout(() => {
      setActiveScene(false);
    }, 10000);
  };

  const handleReadyForBattle = () => {
    SoundFunctions.playGameSound("ready_btn_click");
    setReadyStateLoading(true);
    socket.emit("check_user_ready_state_server", {
      player_id: data?.id,
      game_key: gameKeyRef.current,
    });
  };

  if (loading) return <LoadingPage />;
  if (error) {
    setIsBlock(false);
    return <ErrorPage error={error} />;
  }

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <SoundsPlayer />

      {/* <button className={laser_styles["laser-btn"]} onClick={test}>
        ⚡ Запустить лазер
      </button> */}
      {!isReady && (
        <button
          className={styles["ready-btn"]}
          onClick={handleReadyForBattle}
          disabled={readyStateLoading}
        >
          {readyStateLoading ? "Загрузка..." : "К гою готов!"}
        </button>
      )}

      {activeScene && (
        <div
          className={`${laser_styles["laser-scene"]} ${laser_styles["active"]}`}
        >
          <div className={laser_styles["sky-glow"]}></div>
          <div className={laser_styles["laser-beam"]}></div>
          <div className={laser_styles["impact-zone"]}>
            <div
              className={laser_styles["impact-flash"]}
              id="impactFlash"
            ></div>
            <div className={laser_styles["impact-wave"]}></div>
          </div>
        </div>
      )}

      {resultOverlay && (
        <div
          className={`${laser_styles["result-overlay"]} ${laser_styles["visible"]}`}
        >
          <div className={laser_styles["card-container"]} id="resultCard">
            <div className={laser_styles["card-icon"]}>🏆</div>
            <h2 className={laser_styles["card-title"]}>Раунд завершен!</h2>
            <p className={laser_styles["card-description"]}>
              Лазерный удар стер арену с лица земли.
            </p>
            <p className={laser_styles["card-description"]}>
              Итоговые результаты:
            </p>

            <div className={laser_styles["results-table"]}>
              <div className={laser_styles["result-stat"]}>
                <div className={laser_styles["stat-label"]}>
                  {winnerInfo.name !== null ? "Победитель" : "Ничья"}
                </div>
                <div
                  className={`${laser_styles["stat-value"]} ${laser_styles["text-pink"]}`}
                >
                  {winnerInfo.name !== null
                    ? winnerInfo.name
                    : "Победителей нет"}
                </div>
              </div>
              <div className={laser_styles["stat-divider"]}></div>
              <div className={laser_styles["result-stat"]}>
                <div className={laser_styles["stat-label"]}>Счет</div>
                <div
                  className={`${laser_styles["stat-value"]} ${laser_styles["text-white"]}`}
                >
                  {winnerInfo.name !== null
                    ? "+" + winnerInfo.exp + " опыта"
                    : "..."}
                </div>
              </div>
            </div>

            <button className={laser_styles["card-button"]} onClick={leaveGame}>
              Выход
            </button>
          </div>
        </div>
      )}

      {versusCards !== null ? (
        <div
          className={`${styles["battle-arena"]} ${styles[isVersus ? "battle-started" : ""]}`}
        >
          <div className={styles["bg-wrapper"]}>
            <div className={styles["parallax-wrapper"]}>
              <div
                className={`${styles["smoke-glow"]} ${styles["smoke-red"]}`}
              ></div>
              <div
                className={`${styles["smoke-glow"]} ${styles["smoke-blue"]}`}
              ></div>
              <div
                className={`${styles["smoke-glow"]} ${styles["smoke-purple"]}`}
              ></div>

              <div className={styles["halftone-overlay"]}></div>

              <div className={styles["star-particles"]}></div>
            </div>
          </div>

          <div className={styles["arena-vignette"]}></div>

          <div className={styles["vs-logo"]}>VS</div>

          <div className={`${styles["game-card"]} ${styles["player-left"]}`}>
            <div className={styles["card-title"]}>
              {versusCards.playerCard.playerName}
            </div>
            <br />
            <div className={CardsDesign_styles["card-3d-wrapper"]}>
              <div className={CardsDesign_styles["card-inner"]}>
                <div
                  className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[versusCards.playerCard.rarity]}`}
                >
                  <div className={CardsDesign_styles["card-shine"]}></div>
                  <div className={CardsDesign_styles["card-header"]}>
                    <span
                      className={CardsDesign_styles["card-cost"]}
                      title={`Занимает ${versusCards.playerCard.power_slot} слотов силы`}
                    >
                      {versusCards.playerCard.power_slot}
                    </span>
                    <span
                      className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[versusCards.playerCard.rarity]}`}
                    >
                      {versusCards.playerCard.rarity}
                    </span>
                  </div>
                  {/* <div className={CardsDesign_styles["card-artwork"]}>
                    {versusCards.playerCard.avatar ? (
                      <img
                        src={`/${versusCards.playerCard.avatar}`}
                        alt="artwork"
                      />
                    ) : (
                      <div className={CardsDesign_styles["card-artwork"]}></div>
                    )}
                  </div> */}
                  <div className={CardsDesign_styles["card-artwork"]}>
                    <div
                      className={CardsDesign_styles["card-artwork-img"]}
                      style={{
                        backgroundImage: `url("/${versusCards.playerCard.avatar}")`,
                      }}
                    ></div>
                  </div>
                  <div className={CardsDesign_styles["card-body"]}>
                    <div
                      className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[versusCards.playerCard.rarity]}`}
                    >
                      {versusCards.playerCard.name}
                    </div>
                    <div className={CardsDesign_styles["card-description"]}>
                      {versusCards.playerCard.description}
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
                        {versusCards.playerCard.damage}
                      </span>
                    </div>
                    <div
                      className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                    >
                      <span className={CardsDesign_styles["stat-icon"]}>
                        🛡️
                      </span>
                      <span className={CardsDesign_styles["stat-value"]}>
                        {versusCards.playerCard.protection}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles["game-card"]} ${styles["player-right"]}`}>
            <div className={styles["card-title"]}>
              {versusCards.enemyCard.playerName}
            </div>
            <br />
            <div className={CardsDesign_styles["card-3d-wrapper"]}>
              <div className={CardsDesign_styles["card-inner"]}>
                <div
                  className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[versusCards.enemyCard.rarity]}`}
                >
                  <div className={CardsDesign_styles["card-shine"]}></div>
                  <div className={CardsDesign_styles["card-header"]}>
                    <span
                      className={CardsDesign_styles["card-cost"]}
                      title={`Занимает ${versusCards.enemyCard.power_slot} слотов силы`}
                    >
                      {versusCards.enemyCard.power_slot}
                    </span>
                    <span
                      className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[versusCards.enemyCard.rarity]}`}
                    >
                      {versusCards.enemyCard.rarity}
                    </span>
                  </div>
                  {/* <div className={CardsDesign_styles["card-artwork"]}>
                    {versusCards.enemyCard.avatar ? (
                      <img
                        src={`/${versusCards.enemyCard.avatar}`}
                        alt="artwork"
                      />
                    ) : (
                      <div className={CardsDesign_styles["card-artwork"]}></div>
                    )}
                  </div> */}
                  <div className={CardsDesign_styles["card-artwork"]}>
                    <div
                      className={CardsDesign_styles["card-artwork-img"]}
                      style={{
                        backgroundImage: `url("/${versusCards.enemyCard.avatar}")`,
                      }}
                    ></div>
                  </div>
                  <div className={CardsDesign_styles["card-body"]}>
                    <div
                      className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[versusCards.enemyCard.rarity]}`}
                    >
                      {versusCards.enemyCard.name}
                    </div>
                    <div className={CardsDesign_styles["card-description"]}>
                      {versusCards.enemyCard.description}
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
                        {versusCards.enemyCard.damage}
                      </span>
                    </div>
                    <div
                      className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                    >
                      <span className={CardsDesign_styles["stat-icon"]}>
                        🛡️
                      </span>
                      <span className={CardsDesign_styles["stat-value"]}>
                        {versusCards.enemyCard.protection}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {bodyLoader && (
        <div className={styles["loader-wrapper"]}>
          <div className={styles["loader"]}></div>
        </div>
      )}

      <Game_CardDesk
        isGameStarted={isGameStarted}
        isReady={isReady}
        gameStartedInfo={gameStartedInfo}
        activePlayerCard={activePlayerCard}
        activeEnemyCard={activeEnemyCard}
        setActivePlayerCard={setActivePlayerCard}
        isCardSelectAnimationEnemy={isCardSelectAnimationEnemy}
        setIsCardSelectAnimationEnemy={setIsCardSelectAnimationEnemy}
        handList={handList}
        enemyHandList={enemyHandList}
        playersInfo={playersInfo}
        damageAnimation={damageAnimation}
      />
      <Game_Menus
        isGameStarted={isGameStarted}
        playerCard={playerCard}
        selectCard={selectCard}
        isOpenCardActionsMenu={isOpenCardActionsMenu}
        isOpenLeaveMenu={isOpenLeaveMenu}
        isOpenGameCardsMenu={isOpenGameCardsMenu}
        isClosingGameCardsMenu={isClosingGameCardsMenu}
        socket={socket}
        player_id={`${data?.id}`}
        game_key={game_key}
        list={list}
        setList={setList}
        setHandList={setHandList}
        loading={loading}
        setBodyLoader={setBodyLoader}
        playersInfo={playersInfo}
        setIsBlock={setIsBlock}
      />
    </div>
  );
};
