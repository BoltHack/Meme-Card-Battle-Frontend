import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import CardDesk_styles from "./Card.Desk_styles.module.css";
import Menus_styles from "./Card.Menu_styles.module.css";

import api from "../../api/api.ts";

import { ActionData } from "./Game_Menus.tsx"

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

interface TitleSettings {
    useCard: (type: 'open' | 'close' | 'useCard', data?: ActionData | undefined) => void;
    onToggleMenu: () => void;
    onActionsMenu: () => void;

    isCardSelectAnimationEnemy: boolean;
    setIsCardSelectAnimationEnemy: Dispatch<SetStateAction<boolean>>;

    handList: CardData[];
    enemyHandList: any;

    activePlayerCard: string | null;
    activeEnemyCard: boolean | false;

    // activeAnimationCardId: string | null;

    setActivePlayerCard: Dispatch<SetStateAction<string | null>>;

    playersInfo: any;

    damageAnimation: string | null;
}

export const Game_CardDesk = ({
                                  onToggleMenu, onActionsMenu, useCard,
                                  // isCardSelectAnimationEnemy,
                                  setIsCardSelectAnimationEnemy,
                                  handList,
                                  enemyHandList,
                                  activePlayerCard, activeEnemyCard,
                                  // activeAnimationCardId,
                                  playersInfo,
                                  damageAnimation
                             }: TitleSettings) => {
    const [isGameStart,] = useState<boolean | false>(false);
    const [isFullScreen, setIsFullScreen] = useState<boolean | false>(false);

    // const [damageAnimation, setDamageAnimation] = useState<string | null>(null);

    // const testEnemu = () => {
    //     setIsCardSelectAnimationEnemy(false);
    // }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F11') {
                e.preventDefault();

                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen()
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
        }

        window.addEventListener("keydown", handleKeyDown);
        document.addEventListener("fullscreenchange", handleResize);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.addEventListener("fullscreenchange", handleResize);
        }

    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Ошибка при попытке полноэкранного режима: ${err.message}`);
            });
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    }

    return (
        <>
            <div className={CardDesk_styles["bg-glow"]}></div>
            <div className={`${CardDesk_styles["sparkle"]} ${CardDesk_styles["sp-1"]}`}></div>
            <div className={`${CardDesk_styles["sparkle"]} ${CardDesk_styles["sp-2"]}`}></div>
            <div className={`${CardDesk_styles["sparkle"]} ${CardDesk_styles["sp-3"]}`}></div>

            <div className={CardDesk_styles["game-container"]}>

                <div className={CardDesk_styles["game-tools-container"]}>
                    <div className={CardDesk_styles["game-tools-content"]}>

                        <div className={CardDesk_styles["game-tools-action"]} onClick={toggleFullscreen}>
                            {isFullScreen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minimize-icon lucide-minimize">
                                    <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
                                </svg>
                            ) :
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-maximize-icon lucide-maximize">
                                    <path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
                                </svg>
                            }
                        </div>

                        <div className={CardDesk_styles["game-tools-action"]}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings">
                                <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>

                        <div className={CardDesk_styles["game-tools-action"]} onClick={onActionsMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out">
                                <path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            </svg>
                        </div>

                    </div>
                </div>

                <div className={CardDesk_styles["game-board"]}>

                    <div className={`${CardDesk_styles["board-row"]} ${CardDesk_styles["top-row"]}`}>

                        {playersInfo && playersInfo.enemyInfo && (
                            <div className={`
                            ${CardDesk_styles["player-profile"]}
                            ${CardDesk_styles["enemy-profile"]}
                            ${damageAnimation === "enemy_damage" ? CardDesk_styles["damage-received"] : null}
                            `}
                            >
                                <div className={CardDesk_styles["avatar-wrapper"]}>
                                    <div className={CardDesk_styles["avatar-image"]}>😈</div>
                                    <div className={CardDesk_styles["player-level"]}>Lv.{playersInfo.enemyInfo.lvl}</div>
                                </div>
                                <div className={CardDesk_styles["player-status"]}>
                                    <div className={CardDesk_styles["player-name"]}>{playersInfo.enemyInfo.name}</div>
                                    <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["hp-bar"]}`}
                                           min="0" max="100" value={playersInfo.enemyInfo.health}
                                    ></meter>
                                    <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["ult-bar"]}`}
                                           min="0" max="100" value={playersInfo.enemyInfo.ult}
                                    ></meter>
                                </div>
                            </div>
                        )}

                        <div className={`${Menus_styles["hand-container"]} ${CardDesk_styles["enemy-hand"]}`}>
                            <AnimatePresence>
                                {enemyHandList && enemyHandList.length > 0 ? (
                                    enemyHandList.map((item: number, index: number) => {

                                        return (
                                            <motion.div
                                                key={`card-back-wrapper-${item}-${index}`}
                                                layoutId={`card-back-shared-${item}-${index}`}
                                                layout
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            >
                                                <div id={`card-back-${item}`} className={CardDesk_styles["card-back"]}></div>
                                            </motion.div>
                                        )

                                    })
                                ) : null}
                            </AnimatePresence>
                            {/*<div className={CardDesk_styles["card-back"]}></div>*/}
                            {/*// {isCardSelectAnimationEnemy === "" && (*/}
                            {/*//     <motion.div*/}
                            {/*//         layoutId="shared-EnemyCard">*/}
                            {/*//         <div className={CardDesk_styles["card-back"]} onClick={() => setIsCardSelectAnimationEnemy("use-enemyCard")}></div>*/}
                            {/*//     </motion.div>*/}
                            {/*// )}*/}
                        </div>
                    </div>

                    <div className={`${CardDesk_styles["board-row"]} ${CardDesk_styles["battle-arena"]}`}>
                        <div className={CardDesk_styles["vs-light"]}></div>

                        <div className={CardDesk_styles["arena-center"]}>

                            {/*{isCardSelectAnimationEnemy && (*/}
                            {/*    <motion.div*/}
                            {/*        layoutId="shared-EnemyCard">*/}
                            {/*        <div className={`${CardDesk_styles["game-card"]} ${CardDesk_styles["legendary"]}`} onClick={testEnemu}>*/}
                            {/*            <div className={CardDesk_styles["card-shine"]}></div>*/}
                            {/*            <div className={CardDesk_styles["card-header"]}>*/}
                            {/*                <span className={CardDesk_styles["card-cost"]}>5</span>*/}
                            {/*                <span className={CardDesk_styles["card-rarity"]}>⭐ Legendary</span>*/}
                            {/*            </div>*/}
                            {/*            <div className={CardDesk_styles["card-artwork"]}>*/}
                            {/*                <img src="../../../src/assets/Default_Background.png" />*/}
                            {/*            </div>*/}
                            {/*            <div className={CardDesk_styles["card-body"]}>*/}
                            {/*                <div className={CardDesk_styles["card-title"]}>Кибер-Ассасин</div>*/}
                            {/*                <div className={CardDesk_styles["card-description"]}>*/}
                            {/*                    <strong>Крик души:</strong> Наносит 30 ед. урона случайному врагу при появлении.*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*            <div className={CardDesk_styles["card-footer"]}>*/}
                            {/*                <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["attack-badge"]}`}>*/}
                            {/*                    <span className={CardDesk_styles["stat-icon"]}>⚔️</span>*/}
                            {/*                    <span className={CardDesk_styles["stat-value"]}>75</span>*/}
                            {/*                </div>*/}
                            {/*                <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["protection-badge"]}`}>*/}
                            {/*                    <span className={CardDesk_styles["stat-icon"]}>🛡️</span>*/}
                            {/*                    <span className={CardDesk_styles["stat-value"]}>140</span>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </motion.div>*/}
                            {/*)}*/}
                        </div>

                        <div className={CardDesk_styles["blind-strike-zone"]}>

                            <div className={`${CardDesk_styles["strike-slot"]} ${CardDesk_styles["enemy-strike-slot"]} ${CardDesk_styles["active"]}`}>
                                <AnimatePresence>
                                    {/*{isEnemyCardSelected && (*/}
                                    {activeEnemyCard && (
                                        (() => {

                                            return (
                                                <div className={`${CardDesk_styles["strike-slot"]} ${CardDesk_styles["enemy-strike-slot"]}`}>
                                                    {/*<div className={CardDesk_styles["blind-card"]} onClick={() => setIsCardSelectAnimationEnemy('desk-enemyCard')}></div>*/}
                                                    <div className={CardDesk_styles["blind-card"]} onClick={() => setIsCardSelectAnimationEnemy(true)}></div>
                                                </div>
                                            );

                                        })()
                                    )}
                                </AnimatePresence>
                            </div>



                            <div className={`${CardDesk_styles["strike-slot"]} ${CardDesk_styles["player-strike-slot"]} ${CardDesk_styles["active"]}`}>
                            {/*{isCardSelectAnimationPlayer === "use-playerCard" && (*/}
                            {/*    <motion.div*/}
                            {/*        layoutId="shared-card">*/}
                            {/*        <div className={`${CardDesk_styles["strike-slot"]} ${CardDesk_styles["player-strike-slot"]}`}>*/}
                            {/*            <div className={CardDesk_styles["blind-card"]}></div>*/}
                            {/*        </div>*/}
                            {/*    </motion.div>*/}
                            {/*)}*/}
                                <AnimatePresence>
                                    {activePlayerCard && (
                                        (() => {
                                        // const animatingCard = handList.find(c => c.menu_id === activePlayerCard);
                                        // if (!animatingCard) return null;

                                        return (
                                            <div className={`${CardDesk_styles["strike-slot"]} ${CardDesk_styles["player-strike-slot"]}`}>
                                                <div className={CardDesk_styles["blind-card"]}></div>
                                            </div>
                                        );

                                        })()
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    </div>

                    <div className={`${CardDesk_styles["board-row"]} ${CardDesk_styles["bottom-row"]}`}>
                        <div className={`${Menus_styles["hand-container"]} ${CardDesk_styles["player-hand"]}`}>

                            <AnimatePresence>
                                {handList && handList?.length > 0 ? (
                                    handList.map((card,) => {
                                        const cardId = card.menu_id;
                                        // const isThisCardAnimating = activePlayerCard === cardId;

                                        return (
                                            <motion.div
                                                key={`card-wrapper-${cardId}`}
                                                layoutId={`card-shared-${cardId}`}
                                                layout
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            >

                                                {/*<div*/}
                                                {/*    key={cardId} id={cardId} className={`${CardsDesign_styles["card-3d-wrapper"]} ${CardsDesign_styles["hand_card"]}`}*/}
                                                {/*    onClick={() => {*/}
                                                {/*        // if (activeAnimationCardId || activePlayerCard !== null) return;*/}
                                                {/*        if (activePlayerCard !== null) return;*/}
                                                {/*        useCard('open', {*/}
                                                {/*            cardInfo: {*/}
                                                {/*                id: cardId,*/}
                                                {/*                lvl: card?.lvl,*/}
                                                {/*                rarity: card?.rarity,*/}
                                                {/*                avatar: card?.avatar,*/}
                                                {/*                name: card?.name,*/}
                                                {/*                description: card?.description,*/}
                                                {/*                damage: card?.damage,*/}
                                                {/*                protection: card?.protection,*/}
                                                {/*            }*/}
                                                {/*        } as ActionData);*/}
                                                {/*    }}*/}
                                                {/*>*/}
                                                {/*    <div className={CardsDesign_styles["card-inner"]}>*/}
                                                {/*        <div className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[lvlName.toLowerCase()]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}>*/}
                                                {/*            <div className={CardsDesign_styles["card-shine"]}></div>*/}
                                                {/*            <div className={CardsDesign_styles["card-header"]}>*/}
                                                {/*                <span className={CardsDesign_styles["card-cost"]} title="Занимает 15 слотов силы">{card.power_slot}</span>*/}
                                                {/*                <span className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}>{lvlName}</span>*/}
                                                {/*            </div>*/}
                                                {/*            <div className={CardsDesign_styles["card-artwork"]}>*/}
                                                {/*                <img src={`${api.API_BASE_URL}/${card.avatar}`} alt="artwork" />*/}
                                                {/*            </div>*/}
                                                {/*            <div className={CardsDesign_styles["card-body"]}>*/}
                                                {/*                <div className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}>{card.name}</div>*/}
                                                {/*                <div className={CardsDesign_styles["card-description"]}>*/}
                                                {/*                    {card.description}*/}
                                                {/*                </div>*/}
                                                {/*            </div>*/}
                                                {/*            /!*<div className={CardsDesign_styles["card-footer"]}>*!/*/}
                                                {/*            /!*    <div className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["attack-badge"]}`}>*!/*/}
                                                {/*            /!*        <span className={CardsDesign_styles["stat-icon"]}>⚔️</span>*!/*/}
                                                {/*            /!*        <span className={CardsDesign_styles["stat-value"]}>{card.damage}</span>*!/*/}
                                                {/*            /!*    </div>*!/*/}
                                                {/*            /!*    <div className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}>*!/*/}
                                                {/*            /!*        <span className={CardsDesign_styles["stat-icon"]}>🛡️</span>*!/*/}
                                                {/*            /!*        <span className={CardsDesign_styles["stat-value"]}>{card.protection}</span>*!/*/}
                                                {/*            /!*    </div>*!/*/}
                                                {/*            /!*</div>*!/*/}
                                                {/*        </div>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}


                                                <div id={cardId} className={`${CardDesk_styles["hand-card"]} ${CardDesk_styles[`${card.rarity?.toLowerCase()}`]}`}
                                                     onClick={() => {
                                                         // if (activeAnimationCardId || activePlayerCard !== null) return;
                                                         if (activePlayerCard !== null) return;
                                                         useCard('open', {
                                                             cardInfo: {
                                                                 id: cardId,
                                                                 lvl: card?.lvl,
                                                                 rarity: card?.rarity,
                                                                 avatar: card?.avatar,
                                                                 name: card?.name,
                                                                 description: card?.description,
                                                                 damage: card?.damage,
                                                                 protection: card?.protection,
                                                                 power_slot: card?.power_slot
                                                             }
                                                         } as ActionData);
                                                     }}
                                                >
                                                    <div className={CardDesk_styles["h-cost"]}>{card?.power_slot}</div>
                                                    <div className={`${CardDesk_styles["h-rarity"]} ${CardDesk_styles[`${card.rarity?.toLowerCase()}`]}`}>{card?.rarity.slice(0, 3)}</div>
                                                    <div className={CardDesk_styles["h-avatar"]}>
                                                        <img src={`${api.API_BASE_URL}/${card?.avatar}`} />
                                                    </div>
                                                    <div className={CardDesk_styles["h-title"]}>{card?.name}</div>
                                                    <div className={CardDesk_styles["h-stats"]}>
                                                        <span className={CardDesk_styles["h-atk"]}>⚔️{card?.damage}</span>
                                                        <span className={CardDesk_styles["h-protection"]}>🛡️{card?.protection}</span>
                                                    </div>
                                                </div>

                                            </motion.div>
                                        )
                                    })
                                ) : ''}
                            </AnimatePresence>

                        </div>

                        {/*{playersInfo && playersInfo.length && (*/}
                        {/*    playersInfo.map((player) => (*/}
                        {/*        <div key={player.id || player.playerInfo.name}*/}
                        {/*            className={`${CardDesk_styles["player-profile"]} ${CardDesk_styles["user-profile"]}`} style={ !isGameStart ? {cursor: 'pointer'} : {}}*/}
                        {/*            onClick={onToggleMenu}*/}
                        {/*        >*/}
                        {/*            <div className={CardDesk_styles["player-status"]}>*/}
                        {/*                <div className={CardDesk_styles["player-name"]}>Вы ({player.playerInfo.name})</div>*/}
                        {/*                <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["hp-bar"]}`}*/}
                        {/*                       min="0" max="100" value={player.playerInfo.health}*/}
                        {/*                ></meter>*/}
                        {/*                <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["ult-bar"]}`}*/}
                        {/*                       min="0" max="100" value={player.playerInfo.ult}>*/}
                        {/*                </meter>*/}
                        {/*            </div>*/}
                        {/*            <div className={CardDesk_styles["avatar-wrapper"]}>*/}
                        {/*                <div className={CardDesk_styles["avatar-image"]}>🛡️</div>*/}
                        {/*                <div className={CardDesk_styles["player-level"]}>Lv.{player.playerInfo.lvl}</div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    ))*/}
                        {/*)}*/}

                        {playersInfo && playersInfo.playerInfo && (
                            <div
                                 className={`
                                 ${CardDesk_styles["player-profile"]}
                                 ${CardDesk_styles["user-profile"]}
                                 ${damageAnimation === "player_damage" ? CardDesk_styles["damage-received"] : null}
                                 `} style={ !isGameStart ? {cursor: 'pointer'} : {}}
                                 onClick={onToggleMenu}
                            >
                                <div className={CardDesk_styles["player-status"]}>
                                    <div className={CardDesk_styles["player-name"]}>Вы ({playersInfo.playerInfo.name})</div>
                                    <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["hp-bar"]}`}
                                           min="0" max="100" value={playersInfo.playerInfo.health}
                                    ></meter>
                                    <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["ult-bar"]}`}
                                           min="0" max="100" value={playersInfo.playerInfo.ult}>
                                    </meter>
                                </div>
                                <div className={CardDesk_styles["avatar-wrapper"]}>
                                    <div className={CardDesk_styles["avatar-image"]}>🛡️</div>
                                    <div className={CardDesk_styles["player-level"]}>Lv.{playersInfo.playerInfo.lvl}</div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};