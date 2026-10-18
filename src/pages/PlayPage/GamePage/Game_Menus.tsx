import { Dispatch, SetStateAction, useRef, WheelEvent } from "react";

import Menus_styles from "./Card.Menu_styles.module.css";
import CardDesk_styles from "./Card.Desk_styles.module.css";
import CardsDesign_styles from "../../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";

import toast from "react-hot-toast";

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

export interface ActionData {
  cardInfo: CardData;
}

interface TitleSettings {
  isGameStarted: boolean;

  playerCard: CardData[];

  selectCard: any;

  isOpenCardActionsMenu: boolean;

  isOpenLeaveMenu: boolean;

  isOpenGameCardsMenu: boolean;

  isClosingGameCardsMenu: boolean;

  socket: any;

  player_id: string | undefined;
  game_key: string | undefined;

  list: CardData[];
  setList: Dispatch<SetStateAction<CardData[]>>;

  setHandList: Dispatch<SetStateAction<CardData[]>>;

  loading: boolean | false;

  setBodyLoader: Dispatch<SetStateAction<boolean>>;

  playersInfo: any;

  setIsBlock: Dispatch<SetStateAction<boolean>>;
}

import { playFunctions } from "../Play/Play.tsx";
import { GameFunctions } from "./Game.tsx";

export const Game_Menus = ({
  isGameStarted,
  playerCard,
  selectCard,
  isOpenCardActionsMenu,
  isOpenLeaveMenu,
  isOpenGameCardsMenu,
  isClosingGameCardsMenu,
  socket,
  player_id,
  game_key,
  list,
  setList,
  setHandList,
  setBodyLoader,
  loading,
  playersInfo,
  setIsBlock,
}: TitleSettings) => {
  const contentContainerRef = useRef(null);

  const leaveGame = () => {
    setIsBlock(false);
    playFunctions.handleChangeTab("play:main");
    setTimeout(() => {
      window.location.reload();
      sessionStorage.setItem("screen_click", "true");
    }, 100);
  };

  const checkBattleCard = (card_id: string, menu_id: string) => {
    if (isGameStarted) return;

    const cardsList = list.map((c) => c.menu_id);

    if ([...cardsList].includes(menu_id)) {
      toast.dismiss();
      toast.error("Вы уже выбрали эту карту.");
      return;
    }

    setBodyLoader(true);

    socket.emit("check_battle_card", {
      game_key: game_key,
      player_id: player_id,
      enemy_id: playersInfo?.enemyInfo.id,
      card_id: card_id,
      menu_id: menu_id,
    });
  };

  const removeCard = (idToRemove: string) => {
    if (isGameStarted) return;

    console.log("idToRemove", idToRemove);
    console.log("list", list);
    const removeId = list.filter((item) => item.menu_id !== idToRemove);
    if (!removeId) return;
    setList(removeId);
    setHandList(removeId);
    socket.emit("remove_battle_card", {
      game_key: game_key,
      // player_id: player_id,
      remove_id: idToRemove,
      enemy_id: playersInfo?.enemyInfo.id,
    });
  };

  const handleMouseScroll = (e: WheelEvent<HTMLDivElement>) => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <>
      {isOpenCardActionsMenu && (
        <div
          className={Menus_styles["menu-wrapper"]}
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div className={CardDesk_styles["bg-glow"]}></div>
          <div
            className={`${Menus_styles["actions-menu-card"]} ${isClosingGameCardsMenu ? Menus_styles["closing"] : ""}`}
          >
            <h2>Использовать карту?</h2>
            <div className={Menus_styles["actions-options"]}>
              <div className={Menus_styles["actions-card-info"]}>
                {selectCard.menu_id && (
                  <div
                    id={selectCard?.menu_id}
                    className={CardsDesign_styles["card-3d-wrapper"]}
                  >
                    <div className={CardsDesign_styles["card-inner"]}>
                      <div
                        className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles["hand_card"]} ${CardsDesign_styles[selectCard.rarity.toLowerCase()]} ${CardsDesign_styles[selectCard.rarity.toLowerCase()]}`}
                      >
                        <div className={CardsDesign_styles["card-shine"]}></div>
                        <div className={CardsDesign_styles["card-header"]}>
                          <span
                            className={CardsDesign_styles["card-cost"]}
                            title="Занимает 15 слотов силы"
                          >
                            {selectCard.power_slot}
                          </span>
                          <span
                            className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[selectCard.rarity.toLowerCase()]}`}
                          >
                            {selectCard.rarity}
                          </span>
                        </div>
                        <div className={CardsDesign_styles["card-artwork"]}>
                          <img src={`/${selectCard.avatar}`} alt="artwork" />
                        </div>
                        <div className={CardsDesign_styles["card-body"]}>
                          <div
                            className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[selectCard.rarity.toLowerCase()]}`}
                          >
                            {selectCard.name}
                          </div>
                          <div
                            className={CardsDesign_styles["card-description"]}
                          >
                            {selectCard.description}
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
                              {selectCard.damage}
                            </span>
                          </div>
                          <div
                            className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                          >
                            <span className={CardsDesign_styles["stat-icon"]}>
                              🛡️
                            </span>
                            <span className={CardsDesign_styles["stat-value"]}>
                              {selectCard.protection}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                ;
              </div>

              <div className={Menus_styles["actions-buttons"]}>
                <button
                  className={Menus_styles["menu-btn"]}
                  onClick={() => GameFunctions.useCard_menu("useCard")}
                >
                  <span>Использовать</span>
                </button>

                <button
                  className={Menus_styles["menu-btn"]}
                  onClick={() => GameFunctions.useCard_menu("close")}
                >
                  <span>Отмена</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpenGameCardsMenu && !loading && (
        <div className={Menus_styles["menu-wrapper"]}>
          <div className={CardDesk_styles["bg-glow"]}></div>
          <div
            className={`${Menus_styles["menu-card"]} ${isClosingGameCardsMenu ? Menus_styles["closing"] : ""}`}
          >
            <h2>Соберите свою колоду</h2>
            <div
              className={Menus_styles["options"]}
              ref={contentContainerRef}
              onWheel={handleMouseScroll}
            >
              <div className={`${Menus_styles["hand-container"]}`}>
                {list && list.length > 0 ? (
                  list.map((card) => {
                    const lvlName = card.rarity.toLowerCase();

                    return (
                      <div
                        onClick={() => removeCard(card.menu_id)}
                        key={card.menu_id}
                        id={card.menu_id}
                        className={CardsDesign_styles["card-3d-wrapper"]}
                      >
                        <div className={CardsDesign_styles["card-inner"]}>
                          <div
                            className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[lvlName.toLowerCase()]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                          >
                            <div
                              className={CardsDesign_styles["card-shine"]}
                            ></div>
                            <div className={CardsDesign_styles["card-header"]}>
                              <span
                                className={CardsDesign_styles["card-cost"]}
                                title="Занимает 15 слотов силы"
                              >
                                {card.power_slot}
                              </span>
                              <span
                                className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                              >
                                {lvlName}
                              </span>
                            </div>
                            <div className={CardsDesign_styles["card-artwork"]}>
                              <img src={`/${card.avatar}`} alt="artwork" />
                            </div>
                            <div className={CardsDesign_styles["card-body"]}>
                              <div
                                className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
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
                            <div className={CardsDesign_styles["card-footer"]}>
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
                ) : (
                  <p style={{ color: "#ffffff" }}>Тут пока пусто.</p>
                )}
              </div>
            </div>

            <div className={Menus_styles["btn-options"]}>
              <button
                className={Menus_styles["menu-btn"]}
                onClick={() => GameFunctions.gameCards_menu(false)}
              >
                {/*<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-check-big-icon lucide-square-check-big">*/}
                {/*    <path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344"/><path d="m9 11 3 3L22 4"/>*/}
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
                  className="lucide lucide-check-icon lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Сохранить колоду</span>
              </button>
            </div>
          </div>

          <div
            className={`${Menus_styles["player-cards-menu"]} ${isClosingGameCardsMenu ? Menus_styles["closing"] : ""}`}
          >
            <h2>Ваши карты</h2>
            <div className={Menus_styles["choosing-cards"]}>
              <div
                className={`${Menus_styles["hand-container"]} ${CardDesk_styles["player-hand"]}`}
              >
                {playerCard && playerCard.length > 0 ? (
                  playerCard.map((card) => {
                    const lvlName = card.rarity.toLowerCase();

                    return (
                      <div
                        onClick={() => checkBattleCard(card.id, card.menu_id)}
                        key={card.menu_id}
                        id={card.menu_id}
                        className={CardsDesign_styles["card-3d-wrapper"]}
                      >
                        <div className={CardsDesign_styles["card-inner"]}>
                          <div
                            className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[lvlName.toLowerCase()]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                          >
                            <div
                              className={CardsDesign_styles["card-shine"]}
                            ></div>
                            <div className={CardsDesign_styles["card-header"]}>
                              <span
                                className={CardsDesign_styles["card-cost"]}
                                title="Занимает 15 слотов силы"
                              >
                                {card.power_slot}
                              </span>
                              <span
                                className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                              >
                                {lvlName}
                              </span>
                            </div>
                            <div className={CardsDesign_styles["card-artwork"]}>
                              <img src={`/${card.avatar}`} alt="artwork" />
                            </div>
                            <div className={CardsDesign_styles["card-body"]}>
                              <div
                                className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
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
                            <div className={CardsDesign_styles["card-footer"]}>
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
                ) : (
                  <p style={{ color: "#ffffff" }}>Загрузка карт...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpenLeaveMenu && (
        <div
          className={Menus_styles["menu-wrapper"]}
          style={{
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div className={Menus_styles["player-actions-menu"]}>
            <h2>Покинуть игру?</h2>
            <div className={Menus_styles["btn-actions"]}>
              <button onClick={leaveGame}>
                <span>Выйти</span>
              </button>
              <button onClick={() => GameFunctions.leaveGame_menu(false)}>
                <span>Отмена</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
