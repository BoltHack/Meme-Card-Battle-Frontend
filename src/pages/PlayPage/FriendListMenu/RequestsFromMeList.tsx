import styles from "./Card.Friends.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

interface Props {
  friendList: any;
  contentLoading: boolean;
}

import { friendListTools } from "./Menu";

export const RequestsFromMeList = ({ friendList, contentLoading }: Props) => {
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
                    {fr.isOnline ? (
                      <div className={styles["status-online"]}>В сети</div>
                    ) : (
                      <div className={styles["status-offline"]}>Не в сети</div>
                    )}
                  </div>
                </div>
                <div className={styles["actions"]}>
                  <button
                    className={`${styles["btn"]} ${styles["btn-remove"]}`}
                    onClick={(e) =>
                      friendListTools.handleCancelRequest(fr.id)
                    }
                  >
                    Отменить
                  </button>
                </div>
              </div>
            );
          })
        : !contentLoading && <p>Тут пусто</p>}

      {/* <div className={styles["window-footer"]}>
            <input
              type="text"
              name="requestName"
              value={formData.requestName}
              onChange={handleChange}
              className={styles["search-input"]}
              placeholder="Отправить заявку в друзья"
              required
            />
            <button
              className={`${styles["btn"]} ${styles["btn-accept"]}`}
              onClick={handleSendRequest}
            >
              Добавить
            </button>
          </div> */}
    </>
  );
};