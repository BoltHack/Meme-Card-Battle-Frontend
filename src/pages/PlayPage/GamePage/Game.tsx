import { useBlocker } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { io, Socket } from "socket.io-client";

import styles from "./Card.Game.module.css";
import laser_styles from "./Card.Laser_styles.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import toast from "react-hot-toast";

import { Game_Menus } from "./Game_Menus.tsx";
import { Game_CardDesk } from "./Game_CardDesk.tsx";

import { ErrorPage } from "../../ErrorPage/Error.tsx";
import { LoadingPage } from "../../LoadingPage/Loading.tsx";
import usePageRender from "../../../tools/PageRender.ts";

const socket: Socket = io(api.API_BASE_URL, {
  autoConnect: false,
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

// interface GameParams {
//   game_type: string;
//   game_key: string;
// }

interface CardData {
  // card_name: string;
  // card_avatar: string;
  // card_description: string;
  // card_damage: string;
  // card_protection: string;
  // lvl_number: string;
  // lvl_name: string;
  // _id: string;

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

interface PlayerCardsResponse {
  cards_data?: CardData | CardData[];
}

interface Props {
  game_type: string;
  game_key: string;
}

import { playFunctions } from "../Play/Play.tsx";

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

// export const GamePage = () => {
export const GamePage = ({ game_type, game_key }: Props) => {
  // const { game_type, game_key } = useParams();

  const { data, loading, error } = usePageRender<PlayerData>(
    `${api.API_BASE_URL}/play/game/${game_type}/${game_key}`,
  );

  const [isOpenLeaveMenu, setIsOpenLeaveMenu] = useState(false);

  const [isOpenGameCardsMenu, setIsOpenGameCardsMenu] = useState(true);
  const [isClosingGameCardsMenu, setIsClosingGameCardsMenu] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const [playersInfo, setPlayersInfo] = useState<any>(null);

  const gameKeyRef = useRef(game_key);
  const playersInfoRef = useRef(playersInfo);

  useEffect(() => {
    gameKeyRef.current = game_key;
  }, [game_key]);

  useEffect(() => {
    playersInfoRef.current = playersInfo;
  }, [playersInfo]);

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
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (type) {
        setIsClosingGameCardsMenu(false);
        setIsOpenGameCardsMenu(true);
      } else {
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
      console.log("type", type);
      if (type === "open") {
        const cardInfo = data?.cardInfo as CardData;
        if (!cardInfo) return;
        useCardIdRef.current = cardInfo?.id;

        console.log("useCardIdRef", useCardIdRef.current);

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
        // setSelectCard(cardInfo);

        setIsOpenCardActionsMenu(true);
      } else if (type === "useCard") {
        const useCardId = useCardIdRef.current;
        // console.log("useCardId 2", useCardId);
        if (activePlayerCard === useCardId || !useCardId) return;

        console.log("menu_id", useCardId);
        console.log("used cardId", useCardId);

        setIsOpenCardActionsMenu(false);

        // const updatedHandList = handList.filter(
        //   (item) => item.menu_id !== useCardId,
        // );

        // setHandList(updatedHandList);

        setHandList((prevHandList) =>
          prevHandList.filter((item) => item.menu_id !== useCardId),
        );

        setActivePlayerCard(useCardId);

        const currentPlayersInfo = playersInfoRef.current;
        // const currentGameKey = gameKeyRef.current;

        socket.emit("select_card", {
          game_key: game_key,
          player_id: currentPlayersInfo?.playerInfo?.id,
          // enemy_name: playersInfo[0].enemyInfo.name,
          enemy_id: currentPlayersInfo?.enemyInfo?.id,
          card_id: useCardId,
        });
        setSelectCard(initialCardState);

        console.log("activePlayerCard", activePlayerCard);

        // if (activePlayerCard !== null) return;
        //
        // const removeId = handList.filter(item => item.menu_id !== useCardId);
        //
        // setHandList(removeId);
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

  // const game_key = useParams();
  const [title, setTitle] = useState("");

  const [bodyLoader, setBodyLoader] = useState<boolean | false>(false);

  const [playerCard, setPlayerCard] = useState<CardData[]>([]);
  const [list, setList] = useState<CardData[]>([]);

  const [handList, setHandList] = useState<CardData[]>([]);
  const [enemyHandList, setEnemyHandList] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6, 7,
  ]);

  // const [isEnemyCardSelected, setIsEnemyCardSelected] = useState(false);
  const [activePlayerCard, setActivePlayerCard] = useState<string | null>(null);
  const [activeEnemyCard, setActiveEnemyCard] = useState<boolean | false>(
    false,
  );

  // const [playersInfo, setPlayersInfo] = useState<PlayerData | null>(null);
  // const [playersInfo, setPlayersInfo] = useState([]);

  const winnerIdRef = useRef<string | null>(null);

  const [isBlock, setIsBlock] = useState<boolean | true>(true);

  const [damageAnimation, setDamageAnimation] = useState<string | null>(null);

  const [activeScene, setActiveScene] = useState<boolean | false>(false);
  const [resultOverlay, setResultOverlay] = useState<boolean | false>(false);

  // CardDesk
  const [isCardSelectAnimationEnemy, setIsCardSelectAnimationEnemy] = useState<
    boolean | false
  >(false);
  // CardDesk

  const [winnerInfo, setWinnerInfo] = useState({
    name: "",
  });

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
    setTimeout(() => window.location.reload(), 100);
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

  // useEffect(() => {
  //   console.log("Статус сокета:", socket.connected, "Данные:", data);

  //   if (!data || !data.id) return;

  //   return () => {
  //     socket.off("connect", sendInitialData);
  //     // socket.disconnect();
  //     clearTimeout(joinTimer);
  //     clearTimeout(cardsTimer);
  //   };
  // }, [data, socket.connected]);

  useEffect(() => {
    if (!data || !data.id) return;

    let joinTimer: number;
    let cardsTimer: number;

    const sendInitialData = () => {
      console.log("Приняты данные карт из бэка:", data);

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

      console.log("playersInfo", playersInfo);
      console.log("playersInfoRef", playersInfoRef.current);

      socket.emit("game_start", game_type);

      // if (
      //   game_type === "player_bot" ||
      //   game_type === "player_player"
      // ) {
      //   socket.emit("game_start", game_type);
      // }
    };

    // if (!socket.connected) {
    //   socket.connect();
    // } else {
    //   sendInitialData();
    // }

    if (socket.connected) {
      sendInitialData();
    }

    socket.on("connect", sendInitialData);

    const id = data?.id;

    socket.on("players_info", (data: PlayersInfoResponse) => {
      const updatedPlayer = data.data;

      console.log("updatedPlayer", updatedPlayer);

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

      console.log("formattedPlayersInfo", formattedPlayersInfo.playerInfo);

      const title =
        formattedPlayersInfo.playerInfo.name +
        " против " +
        formattedPlayersInfo.enemyInfo.name;

      setTitle(title);
    });

    socket.on("get_player_cards", handlePlayerCards);

    socket.on("select_battle_card", (data: any) => {
      const { card, menu_id } = data;

      console.log("menu_id", menu_id);

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

      console.log("Formatted card to save:", formattedCard);

      setList((prevState) => [...prevState, formattedCard]);
      setHandList((prevState) => [...prevState, formattedCard]);
      setBodyLoader(false);
    });

    // socket.on("select_battle_card_list", (data) => {
    //     const { card } = data;
    //
    //     if (!card || card.length < 1) return;
    //
    //     console.log('Уникальные карты для рендера:', card);
    //
    //     setList(prevList => {
    //         const combined = [...prevList, ...card];
    //
    //         return combined.filter((item, index, self) =>
    //             index === self.findIndex((c) => c.id === item.id)
    //         );
    //     });
    //     setHandList(prevList => {
    //         const combined = [...prevList, ...card];
    //
    //         return combined.filter((item, index, self) =>
    //             index === self.findIndex((c) => c.id === item.id)
    //         );
    //     });
    // });

    socket.on("error_handler", (message) => {
      toast.dismiss();
      toast.error(message);

      setBodyLoader(false);
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

        setEnemyHandList((prevList) => {
          const lastIndex = prevList.length - 1;

          if (lastIndex < 0) return prevList;

          const updatedList = prevList.filter(
            (_, index) => index !== lastIndex,
          );

          console.log("card_selected:", updatedList.length);

          return updatedList;
        });
        return;
      }
    });

    socket.on("game_cards_selected", () => {
      toast.dismiss();
      toast.success("Игроки выбрали свои карты!");
    });

    socket.on("game_cards_selected_result", (data) => {
      const { type, gameData } = data;

      console.log("game_cards_selected_result");

      if (type === "timer") {
        if (gameData.timer === 0) {
          console.log("Время вскрываться!");
          console.log("winnerIdRef", winnerIdRef.current);
          if (id === winnerIdRef.current) {
            console.log("дамаг нанес ты", gameData.winnerId);
            setDamageState("player_damage");
          } else {
            console.log("дамаг нанес враг", gameData.winnerId);
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
          });
          setTimeout(() => handleGameOver(), 12500);
        }
        if (res.status === "autowin") {
          setDamageState("player_damage");
          setWinnerInfo({
            name: winner,
          });
          setTimeout(() => handleGameOver(), 2000);
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

      {/* <button className={laser_styles["laser-btn"]} onClick={test}>
        ⚡ Запустить лазер
      </button> */}
      <button className={styles["ready-btn"]}>
        ГОТОВ К БОЮ
      </button>

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
                <div className={laser_styles["stat-label"]}>Победитель</div>
                <div
                  className={`${laser_styles["stat-value"]} ${laser_styles["text-pink"]}`}
                >
                  {winnerInfo.name}
                </div>
              </div>
              <div className={laser_styles["stat-divider"]}></div>
              <div className={laser_styles["result-stat"]}>
                <div className={laser_styles["stat-label"]}>Счет</div>
                <div
                  className={`${laser_styles["stat-value"]} ${laser_styles["text-white"]}`}
                >
                  9,850 очков
                </div>
              </div>
            </div>

            <button className={laser_styles["card-button"]} onClick={leaveGame}>
              Выход
            </button>
          </div>
        </div>
      )}

      {bodyLoader && (
        <div className={styles["loader-wrapper"]}>
          <div className={styles["loader"]}></div>
        </div>
      )}
      <Game_CardDesk
        // onToggleMenu={toggleMenu}
        // useCard={(
        //   type: "open" | "close" | "useCard",
        //   data?: ActionData | undefined,
        // ) => useCard(type, data)}
        // useCard={useCard}
        // onActionsMenu={actionsMenu}
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
        handList={handList}
        setHandList={setHandList}
        enemyHandList={enemyHandList}
        // setEnemyHandList={setEnemyHandList}
        activePlayerCard={activePlayerCard}
        activeEnemyCard={activeEnemyCard}
        setActivePlayerCard={setActivePlayerCard}
        loading={loading}
        setBodyLoader={setBodyLoader}
        playersInfo={playersInfo}
        setIsBlock={setIsBlock}
        damageAnimation={damageAnimation}
      />
    </div>
  );
};
