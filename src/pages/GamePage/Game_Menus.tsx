import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";

import { Game_CardDesk } from "./Game_CardDesk.tsx";

import Menus_styles from "./Card.Menu_styles.module.css";
import CardDesk_styles from "./Card.Desk_styles.module.css";
import CardsDesign_styles from "../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";

import api from "../../api/api.ts";
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

interface UseCardData {
  id: string;
  lvl?: number;
  rarity?: string;
  avatar?: string;
  name?: string;
  description?: string;
  damage?: number;
  protection?: number;
  power_slot?: number;
}

export interface ActionData {
  cardInfo: CardData;
}

interface TitleSettings {
  playerCard: CardData[];
  socket: any;

  player_id: string | undefined;
  game_key: string | undefined;

  list: CardData[];
  setList: Dispatch<SetStateAction<CardData[]>>;

  handList: CardData[];
  setHandList: Dispatch<SetStateAction<CardData[]>>;

  enemyHandList: any;

  activePlayerCard: string | null;
  setActivePlayerCard: Dispatch<SetStateAction<string | null>>;
  activeEnemyCard: boolean | false;

  loading: boolean | false;

  setBodyLoader: Dispatch<SetStateAction<boolean>>;

  playersInfo: any;

  setIsBlock: Dispatch<SetStateAction<boolean>>;

  damageAnimation: string | null;
}

export const Game_Menus = ({
  playerCard,
  socket,
  player_id,
  game_key,
  list,
  setList,
  handList,
  setHandList,
  enemyHandList,
  activePlayerCard,
  activeEnemyCard,
  setActivePlayerCard,
  // loading,
  setBodyLoader,
  loading,
  playersInfo,
  setIsBlock,
  damageAnimation,
}: TitleSettings) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const [isOpenCardActions, setIsOpenCardActions] = useState(false);
  const [selectCard, setSelectCard] = useState<UseCardData[]>([]);

  const [isOpenLeaveMenu, setIsOpenLeaveMenu] = useState(false);

  // const [activePlayerCard, setActivePlayerCard] = useState<string | null>(null);
  // const [isCardSelectAnimationPlayer, setIsCardSelectAnimationPlayer] = useState<boolean>(false);
  const [isCardSelectAnimationEnemy, setIsCardSelectAnimationEnemy] = useState<
    boolean | false
  >(false);
  // const [activeAnimationCardId, setActiveAnimationCardId] = useState<string | null>(null);

  // const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const useCardIdRef = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const closeMenu = () => {
    setIsClosing(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const actionsMenu = () => {
    setIsOpenLeaveMenu(!isOpenLeaveMenu);
  };

  const leaveGame = () => {
    setIsBlock(false);
    setTimeout(() => navigate("/"), 500);
  };

  const toggleMenu = () => {
    console.log("toggle menu");
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current as number);
    setIsClosing(false);
    setIsOpen(true);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current as number);
    };
  }, []);

  const checkBattleCard = (card_id: string, menu_id: string) => {
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
      card_id: card_id,
      menu_id: menu_id,
      enemy_id: playersInfo?.enemyInfo.id,
    });
  };

  const removeCard = (idToRemove: string) => {
    console.log("idToRemove", idToRemove);
    console.log("list", list);
    const removeId = list.filter((item) => item.menu_id !== idToRemove);
    if (!removeId) return;
    setList(removeId);
    setHandList(removeId);
    socket.emit("remove_battle_card", {
      game_key: game_key,
      player_id: player_id,
      remove_id: idToRemove,
      enemy_id: playersInfo?.enemyInfo.id,
    });
  };

  // const useCardIdRef = useRef<string | undefined>(undefined);

  const useCard = (
    type: "open" | "close" | "useCard",
    data?: ActionData | undefined,
  ) => {
    console.log("type", type);
    // if (type !== 'open' || type !== 'close' || type !== 'useCard') return;

    if (type === "open") {
      const cardInfo = data?.cardInfo;
      if (!cardInfo) return;
      useCardIdRef.current = cardInfo?.id;

      console.log("useCardIdRef", useCardIdRef.current);

      setSelectCard((prevState) => [...prevState, cardInfo]);
      // setSelectCard(cardInfo);

      setIsOpenCardActions(true);
    } else if (type === "useCard") {
      const useCardId = useCardIdRef.current;
      console.log("useCardId 2", useCardId);
      if (activePlayerCard === useCardId || !useCardId) return;

      console.log("useCardId", useCardId);

      setIsOpenCardActions(false);

      const updatedHandList = handList.filter(
        (item) => item.menu_id !== useCardId,
      );
      setHandList(updatedHandList);

      setActivePlayerCard(useCardId);

      socket.emit("select_card", {
        game_key: game_key,
        player_id: player_id,
        // enemy_name: playersInfo[0].enemyInfo.name,
        enemy_id: playersInfo?.enemyInfo.id,
        card_id: useCardId,
      });
      setSelectCard([]);

      console.log("activePlayerCard", activePlayerCard);

      // if (activePlayerCard !== null) return;
      //
      // const removeId = handList.filter(item => item.menu_id !== useCardId);
      //
      // setHandList(removeId);
    } else if (type === "close") {
      setSelectCard([]);
      setIsOpenCardActions(false);
    } else {
      setSelectCard([]);
      setIsOpenCardActions(false);
    }
  };

  return (
    <>
      <Game_CardDesk
        onToggleMenu={toggleMenu}
        useCard={(
          type: "open" | "close" | "useCard",
          data?: ActionData | undefined,
        ) => useCard(type, data)}
        // useCard={useCard}
        onActionsMenu={actionsMenu}
        activePlayerCard={activePlayerCard}
        activeEnemyCard={activeEnemyCard}
        setActivePlayerCard={setActivePlayerCard}
        isCardSelectAnimationEnemy={isCardSelectAnimationEnemy}
        setIsCardSelectAnimationEnemy={setIsCardSelectAnimationEnemy}
        handList={handList}
        // setHandList={setHandList}
        enemyHandList={enemyHandList}
        // activeAnimationCardId={activeAnimationCardId}
        // setActiveAnimationCardId={setActiveAnimationCardId}
        playersInfo={playersInfo}
        damageAnimation={damageAnimation}
      />

      {isOpenCardActions && (
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
            className={`${Menus_styles["actions-menu-card"]} ${isClosing ? Menus_styles["closing"] : ""}`}
          >
            <h2>Использовать карту?</h2>
            <div className={Menus_styles["actions-options"]}>
              <div className={Menus_styles["actions-card-info"]}>
                {selectCard && selectCard.length
                  ? selectCard.map((card: any, index: number) => {
                      const lvlName = card?.rarity.toLowerCase();
                      return (
                        <div
                          key={index}
                          id={card?.menu_id}
                          className={CardsDesign_styles["card-3d-wrapper"]}
                        >
                          <div className={CardsDesign_styles["card-inner"]}>
                            <div
                              className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles["hand_card"]} ${CardsDesign_styles[lvlName.toLowerCase()]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
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
                                  className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                                >
                                  {lvlName}
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
                        // <div key={index} className={`${CardDesk_styles["dem-card"]} ${CardDesk_styles[card?.rarity.toLowerCase()]}`}>
                        //     <div className={CardDesk_styles["card-shine"]}></div>
                        //     <div className={CardDesk_styles["card-header"]}>
                        //         <span className={CardDesk_styles["card-cost"]}>{card?.lvl}</span>
                        //         <span className={`${CardDesk_styles["card-rarity"]} ${CardDesk_styles[card?.rarity.toLowerCase()]}`}>{card.rarity}</span>
                        //     </div>
                        //     <img className={CardDesk_styles["card-artwork"]} src={`${api.API_BASE_URL}/${card?.avatar}`} />
                        //     <div className={CardDesk_styles["card-body"]}>
                        //         <div className={CardDesk_styles["card-title"]}>{card?.name}</div>
                        //         <div className={CardDesk_styles["card-description"]}>
                        //             {card?.description}
                        //         </div>
                        //     </div>
                        //     <div className={CardDesk_styles["card-footer"]}>
                        //         <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["attack-badge"]}`}>
                        //             <span className={CardDesk_styles["stat-icon"]}>⚔️</span>
                        //             <span className={CardDesk_styles["stat-value"]}>{card.damage}</span>
                        //         </div>
                        //         <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["protection-badge"]}`}>
                        //             <span className={CardDesk_styles["stat-icon"]}>🛡️</span>
                        //             <span className={CardDesk_styles["stat-value"]}>{card.protection}</span>
                        //         </div>
                        //     </div>
                        // </div>
                      );
                    })
                  : ""}
              </div>

              <div className={Menus_styles["actions-buttons"]}>
                <button
                  className={Menus_styles["menu-btn"]}
                  onClick={() => useCard("useCard")}
                >
                  <span>Использовать</span>
                </button>

                <button
                  className={Menus_styles["menu-btn"]}
                  onClick={() => useCard("close")}
                >
                  <span>Отмена</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen && !loading && (
        <div className={Menus_styles["menu-wrapper"]}>
          <div className={CardDesk_styles["bg-glow"]}></div>
          <div
            className={`${Menus_styles["menu-card"]} ${isClosing ? Menus_styles["closing"] : ""}`}
          >
            <h2>Соберите свою колоду</h2>
            <div className={Menus_styles["options"]}>
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
                              <img
                                src={`${api.API_BASE_URL}/${card.avatar}`}
                                alt="artwork"
                              />
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
                    // <div key={`${card.menu_id || index}`} className={`${CardDesk_styles["dem-card"]} ${CardDesk_styles[`${card.rarity?.toLowerCase()}`]}`}
                    //      onClick={() => removeCard(card.menu_id)} id={card.menu_id}
                    // >
                    //     <div className={CardDesk_styles["card-shine"]}></div>
                    //     <div className={CardDesk_styles["card-header"]}>
                    //         <span className={CardDesk_styles["card-cost"]}>{card.lvl}</span>
                    //         <span className={`${CardDesk_styles["card-rarity"]} ${CardDesk_styles[card.rarity.toLowerCase()]}`}>{card.rarity}</span>
                    //     </div>
                    //     <img className={CardDesk_styles["card-artwork"]} src={`${api.API_BASE_URL}/${card.avatar}`} />
                    //     <div className={CardDesk_styles["card-body"]}>
                    //         <div className={CardDesk_styles["card-title"]}>{card?.name}</div>
                    //         <div className={CardDesk_styles["card-description"]}>
                    //             {card.description && card.description.length >= 100 ? card.description.slice(0, 100) + '...' : card.description}
                    //         </div>
                    //     </div>
                    //     <div className={CardDesk_styles["card-footer"]}>
                    //         <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["attack-badge"]}`}>
                    //             <span className={CardDesk_styles["stat-icon"]}>⚔️</span>
                    //             <span className={CardDesk_styles["stat-value"]}>{card?.damage}</span>
                    //         </div>
                    //         <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["protection-badge"]}`}>
                    //             <span className={CardDesk_styles["stat-icon"]}>🛡️</span>
                    //             <span className={CardDesk_styles["stat-value"]}>{card?.protection}</span>
                    //         </div>
                    //     </div>
                    // </div>
                  })
                ) : (
                  <p style={{ color: "#ffffff" }}>Тут пока пусто.</p>
                )}
              </div>
            </div>

            <div className={Menus_styles["btn-options"]}>
              <button className={Menus_styles["menu-btn"]} onClick={closeMenu}>
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
            className={`${Menus_styles["player-cards-menu"]} ${isClosing ? Menus_styles["closing"] : ""}`}
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
                              <img
                                src={`${api.API_BASE_URL}/${card.avatar}`}
                                alt="artwork"
                              />
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
                    // <div key={card.menu_id} className={`${CardDesk_styles["dem-card"]} ${Menus_styles["menu-card"]} ${CardDesk_styles[card.rarity?.toLowerCase()]}`}
                    //      onClick={() => checkBattleCard( card.id, card.menu_id )}
                    //      id={card.menu_id}
                    // >
                    //     <div className={CardDesk_styles["card-shine"]}></div>
                    //     <div className={CardDesk_styles["card-header"]}>
                    //         <span className={CardDesk_styles["card-cost"]}>{card.lvl}</span>
                    //         <span className={`${CardDesk_styles["card-rarity"]} ${CardDesk_styles[card.rarity.toLowerCase()]}`}>{card.rarity}</span>
                    //     </div>
                    //     <img className={CardDesk_styles["card-artwork"]} src={`${api.API_BASE_URL}/${card.avatar}`} />
                    //     <div className={CardDesk_styles["card-body"]}>
                    //         <div className={CardDesk_styles["card-title"]}>{card.name}</div>
                    //         <div className={CardDesk_styles["card-description"]}>
                    //             {card.description && card.description.length >= 100 ? card.description.slice(0, 100) + '...' : card.description}
                    //         </div>
                    //     </div>
                    //     <div className={CardDesk_styles["card-footer"]}>
                    //         <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["attack-badge"]}`}>
                    //             <span className={CardDesk_styles["stat-icon"]}>⚔️</span>
                    //             <span className={CardDesk_styles["stat-value"]}>{card.damage}</span>
                    //         </div>
                    //         <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["protection-badge"]}`}>
                    //             <span className={CardDesk_styles["stat-icon"]}>🛡️</span>
                    //             <span className={CardDesk_styles["stat-value"]}>{card.protection}</span>
                    //         </div>
                    //     </div>
                    // </div>
                  })
                ) : (
                  <p style={{ color: "#ffffff" }}>Загрузка...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpenLeaveMenu ? (
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
              <button onClick={actionsMenu}>
                <span>Отмена</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
