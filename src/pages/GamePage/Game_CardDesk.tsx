import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useBlocker } from "react-router-dom";

import CardDesk_styles from "./Card.Desk_styles.module.css";
import Menus_styles from "./Card.Menu_styles.module.css";

import api from "../../api/api.ts";
import toast from "react-hot-toast";

export const Game_CardDesk = ({
                                  onToggleMenu, useCard,
                                  activePlayerCard,
                                  isCardSelectAnimationEnemy, setIsCardSelectAnimationEnemy,
                                  handList,
                                  enemyHandList,
                                  isEnemyCardSelected,
                                  activeAnimationCardId,
                                  playersInfo,
                                  isBlock, setIsBlock
                             }) => {
    const navigate = useNavigate();

    const [isGameStart, setIsGameStart] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isBlock &&
            currentLocation.pathname !== nextLocation.pathname &&
            currentLocation.search === nextLocation.search
    );

    useEffect(() => {
        if (blocker.state === "blocked") {
            toast.error("Вы не можете покинуть игру, пока она активна.");
        }
    }, [blocker]);

    const testEnemu = () => {
        setIsCardSelectAnimationEnemy(null);
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
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

    const leaveGame = () => {
        setIsBlock(false);
        setTimeout(() => navigate("/"), 500);
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

                        <div className={CardDesk_styles["game-tools-action"]} onClick={leaveGame}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out">
                                <path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            </svg>
                        </div>

                    </div>
                </div>

                <div className={CardDesk_styles["game-board"]}>

                    <div className={`${CardDesk_styles["board-row"]} ${CardDesk_styles["top-row"]}`}>
                        {playersInfo && playersInfo.length > 0 && (
                            playersInfo.map((player, index) => (
                                <div key={index} className={`${CardDesk_styles["player-profile"]} ${CardDesk_styles["enemy-profile"]}`}>
                                    <div className={CardDesk_styles["avatar-wrapper"]}>
                                        <div className={CardDesk_styles["avatar-image"]}>😈</div>
                                        <div className={CardDesk_styles["player-level"]}>Lv.{player.enemyInfo.lvl}</div>
                                    </div>
                                    <div className={CardDesk_styles["player-status"]}>
                                        <div className={CardDesk_styles["player-name"]}>{player.enemyInfo.name}</div>
                                        <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["hp-bar"]}`}
                                               min="0" max="100" value={player.enemyInfo.health}
                                        ></meter>
                                        <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["ult-bar"]}`}
                                               min="0" max="100" value={player.enemyInfo.ult}
                                        ></meter>
                                    </div>
                                </div>
                            ))
                        )}

                        <div className={`${Menus_styles["hand-container"]} ${CardDesk_styles["enemy-hand"]}`}>
                            <AnimatePresence>
                                {enemyHandList && enemyHandList.length > 0 ? (
                                    enemyHandList.map((item, index) => {

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

                            {isCardSelectAnimationEnemy === "desk-enemyCard" && (
                                <motion.div
                                    layoutId="shared-EnemyCard">
                                    <div className={`${CardDesk_styles["game-card"]} ${CardDesk_styles["legendary"]}`} onClick={testEnemu}>
                                        <div className={CardDesk_styles["card-shine"]}></div>
                                        <div className={CardDesk_styles["card-header"]}>
                                            <span className={CardDesk_styles["card-cost"]}>5</span>
                                            <span className={CardDesk_styles["card-rarity"]}>⭐ Legendary</span>
                                        </div>
                                        <div className={CardDesk_styles["card-artwork"]}>
                                            <img src="../../../src/assets/Default_Background.png" />
                                        </div>
                                        <div className={CardDesk_styles["card-body"]}>
                                            <div className={CardDesk_styles["card-title"]}>Кибер-Ассасин</div>
                                            <div className={CardDesk_styles["card-description"]}>
                                                <strong>Крик души:</strong> Наносит 30 ед. урона случайному врагу при появлении.
                                            </div>
                                        </div>
                                        <div className={CardDesk_styles["card-footer"]}>
                                            <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["attack-badge"]}`}>
                                                <span className={CardDesk_styles["stat-icon"]}>⚔️</span>
                                                <span className={CardDesk_styles["stat-value"]}>75</span>
                                            </div>
                                            <div className={`${CardDesk_styles["stat-badge"]} ${CardDesk_styles["protection-badge"]}`}>
                                                <span className={CardDesk_styles["stat-icon"]}>🛡️</span>
                                                <span className={CardDesk_styles["stat-value"]}>140</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className={CardDesk_styles["blind-strike-zone"]}>

                            <div className={`${CardDesk_styles["strike-slot"]} ${CardDesk_styles["enemy-strike-slot"]} ${CardDesk_styles["active"]}`}>
                                <AnimatePresence>
                                    {isEnemyCardSelected && (
                                        (() => {

                                            return (
                                                <div className={`${CardDesk_styles["strike-slot"]} ${CardDesk_styles["enemy-strike-slot"]}`}>
                                                    <div className={CardDesk_styles["blind-card"]} onClick={() => setIsCardSelectAnimationEnemy('desk-enemyCard')}></div>
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
                                {handList && handList.length > 0 ? (
                                    handList.map((card, index) => {

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
                                                <div id={cardId} className={`${CardDesk_styles["hand-card"]} ${CardDesk_styles[`${card.rarity?.toLowerCase()}`]}`}
                                                     onClick={() => {
                                                         if (activeAnimationCardId) return;
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
                                                             }
                                                         });
                                                     }}
                                                >
                                                    <div className={CardDesk_styles["h-cost"]}>{card?.lvl}</div>
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

                        {playersInfo && playersInfo.length && (
                            playersInfo.map((player, index) => (
                                <div key={index}
                                    className={`${CardDesk_styles["player-profile"]} ${CardDesk_styles["user-profile"]}`} style={ !isGameStart ? {cursor: 'pointer'} : {}}
                                    onClick={onToggleMenu}
                                >
                                    <div className={CardDesk_styles["player-status"]}>
                                        <div className={CardDesk_styles["player-name"]}>Вы ({player.playerInfo.name})</div>
                                        <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["hp-bar"]}`}
                                               min="0" max="100" value={player.playerInfo.health}
                                        ></meter>
                                        <meter className={`${CardDesk_styles["status-bar"]} ${CardDesk_styles["ult-bar"]}`}
                                               min="0" max="100" value={player.playerInfo.ult}>
                                        </meter>
                                    </div>
                                    <div className={CardDesk_styles["avatar-wrapper"]}>
                                        <div className={CardDesk_styles["avatar-image"]}>🛡️</div>
                                        <div className={CardDesk_styles["player-level"]}>Lv.{player.playerInfo.lvl}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};