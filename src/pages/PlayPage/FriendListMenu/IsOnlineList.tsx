import { useState } from "react";

import styles from "./Card.Friends.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

interface Props {
  friendList: any;
  contentLoading: boolean;
}

import { playFunctions } from "../Play/Play";
import { friendListTools } from "./Menu";

export const IsOnlineList = ({ friendList, contentLoading }: Props) => {
  const [toChallenge, setToChallenge] = useState<string | null>(null);

  const handleToChallenge = (friendID: string) => {
    playFunctions.inviteGame(friendID);
    setToChallenge(friendID);
    setTimeout(() => setToChallenge(null), 1000);
  };

  return (
    <>
      {!contentLoading && friendList && friendList.length > 0
        ? friendList.map((fr) => {
            return (
              <div key={fr.id} className={styles["player-row"]}>
                <div className={styles["player-info"]}>
                  <div
                    className={styles["rank-icon"]}
                    style={{
                      backgroundColor: fr.isOnline ? "#60c360" : "#a0a5a0",
                    }}
                    title={`${fr.lvl} LVL`}
                  ></div>
                  <div>
                    <div className={styles["player-name"]}>{fr.name}</div>
                    {fr.gameInfo === "InGame" ? (
                      <div className={styles["status-fight"]}>В игре</div>
                    ) : fr.isOnline ? (
                      <div className={styles["status-online"]}>В сети</div>
                    ) : (
                      <div className={styles["status-offline"]}>Не в сети</div>
                    )}
                  </div>
                </div>
                <div className={styles["actions"]}>
                  <button
                    className={styles["btn"]}
                    onClick={() => handleToChallenge(fr.id)}
                    // onClick={() => playFunctions.inviteGame(fr.id)}
                  >
                    {toChallenge === fr.id ? "Запрос отправлен" : "Бросить вызов"}
                  </button>
                  <button
                    className={`${styles["btn"]} ${styles["btn-remove"]}`}
                    onClick={() => friendListTools.handleRemoveFriend(fr.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            );
          })
        : !contentLoading && (
            <p>Тут будут появляться игроки, которые на данный момент в сети.</p>
          )}
    </>
  );
};
