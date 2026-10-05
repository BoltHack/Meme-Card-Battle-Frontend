import { useEffect, useState } from "react";

import styles from "./Card.Cases.module.css";
import CardsDesign_styles from "../../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import useContentRender from "../../../tools/ContentRender.ts";
import { LoadingPage } from "../../LoadingPage/Loading.tsx";
import { ErrorPage } from "../../ErrorPage/Error.tsx";

import toast from "react-hot-toast";

interface CardsPost {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  price: string;
  keys: string;
}

import { playFunctions } from "../Play/Play.tsx";

export const CasesPage = () => {
  const [cases, setCases] = useState<CardsPost[]>([]);

  const [currentCase, setCurrentCase] = useState<string | "">("default");

  const [loadingBtn, setLoadingBtn] = useState<boolean | false>(false);
  const [isOpenCase, setIsOpenCase] = useState<string | "">("");

  const [reward, setReward] = useState<boolean | false>(false);
  const [menuType, setMenuType] = useState<string | "">("");

  const initialCardState = {
    card_name: "",
    card_avatar: "",
    card_description: "",
    card_damage: "",
    card_protection: "",
    lvl_number: "",
    lvl_name: "",
    power_slot: "",
  };
  const [rewardCard, setRewardCard] = useState(initialCardState);

  const { contentData, contentLoading, contentError } = useContentRender(
    `${api.API_BASE_URL}/play/cases`,
  );

  const openCase = async (case_id: string) => {
    setLoadingBtn(true);
    if (isOpenCase !== "") return;
    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/play/case/${case_id}/open`,
        {
          withCredentials: true,
        },
      );

      if (response.data?.success) {
        setLoadingBtn(false);
        const card = response.data.card;
        const updatedCase = cases.map((cs) => {
          if (cs.id.toString() === case_id.toString()) {
            return { ...cs, keys: cs.keys - 1 };
          }

          return cs;
        });
        setCases(updatedCase);

        setRewardCard({
          card_name: card.card_name,
          card_avatar: card.card_avatar,
          card_description: card.card_description,
          card_damage: card.card_damage,
          card_protection: card.card_protection,
          lvl_number: card.lvl_number,
          lvl_name: card.lvl_name,
          power_slot: card.power_slot,
        });
        openContainer(case_id);
      }

      return response.data;
    } catch (error) {
      console.log("error", error);
      const errorMessage = error?.response?.data.error;
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
    }
  };

  const openContainer = (case_id: string) => {
    setIsOpenCase(case_id);
    setMenuType("open");
    setTimeout(() => setReward(true), 1000);
  };

  const handleClaim = () => {
    setMenuType("close");
    setIsOpenCase("");
    setTimeout(() => setReward(false), 1000);
  };

  useEffect(() => {
    if (!contentData || !Array.isArray(contentData.renderData.cases)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    playFunctions.handleChangeHeaderState(true);

    setCases(contentData.renderData.cases);

    console.log("data", contentData);
  }, [contentData]);

  if (contentLoading || !contentData) return <LoadingPage />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div style={{ userSelect: "none" }}>
      {!isOpenCase && (
        <header className={styles["header-container"]}>
          <div className={styles["header-content"]}>
            {cases && cases.length > 0
              ? cases.map((cs, index) => {
                  return (
                    <div
                      key={index}
                      className={styles["header-btn"]}
                      onClick={() => setCurrentCase(cs.rarity.toLowerCase())}
                    >
                      <div className={styles["case-btn-info"]}>
                        <span
                          className={`${styles["case-name"]} ${styles[currentCase === cs.rarity.toLowerCase() ? "case-selected" : ""]}`}
                        >
                          {cs?.name.replace("кейс", "")}
                        </span>
                        <span className={styles["case-count"]}>{cs?.keys}</span>
                      </div>
                      {currentCase === cs.rarity.toLowerCase() && (
                        <div className={styles["case-btn-line"]}></div>
                      )}
                      {/* <span
                      className={`${styles["case-btn-info"]} ${styles["case-count"]}`}
                    >
                      {cs?.keys}
                    </span> */}
                    </div>
                  );
                })
              : null}
          </div>
        </header>
      )}

      <div className={styles["animation-wrapper"]}>
        {cases && cases.length > 0
          ? cases
              .filter((cs) => cs.rarity.toLowerCase() === currentCase)
              .map((cs) => {
                return (
                  <div
                    key={cs?.id}
                    className={`${styles["scene"]} ${styles[isOpenCase === cs?.id ? "opened" : ""]}`}
                  >
                    <div className={styles["platform"]}>
                      <div className={styles["platform-info"]}>
                        {/* <span>{cs?.name}</span> */}
                        {/* <span>Ключей: {cs?.keys}</span> */}
                        {!isOpenCase &&
                          (Number(cs.keys) > 0 ? (
                            <button
                              className={styles["open-case-btn"]}
                              disabled={isOpenCase ? true : false}
                              onClick={() => openCase(cs?.id)}
                            >
                              {loadingBtn ? "Загрузка..." : "Открыть кейс"}
                            </button>
                          ) : (
                            <span>Ключи отсутствуют</span>
                          ))}
                        <br />
                      </div>
                      <div className={styles["platform-line"]}></div>
                    </div>
                    <div
                      className={styles["light-beam"]}
                      style={{
                        background: `var(--${isOpenCase === cs?.id ? rewardCard?.lvl_name.toLowerCase() : ""}-light)`,
                      }}
                    ></div>

                    <div className={styles["container-box"]}>
                      <div className={styles["badge"]}>
                        <div className={styles["badge-icon"]}>{cs?.icon}</div>
                      </div>
                      <div
                        className={`${styles["gate"]} ${styles["gate-top"]}`}
                      >
                        <div className={styles["neon-line"]}></div>
                      </div>
                      <div
                        className={`${styles["gate"]} ${styles["gate-bottom"]}`}
                      ></div>
                      <div className={styles["neon-line"]}></div>
                    </div>
                  </div>
                );
              })
          : null}
      </div>

      {reward && (
        <div className={`${styles["blur-overlay"]} ${styles[menuType]}`}>
          <div className={`${styles["reward-menu"]} ${styles[menuType]}`}>
            <div className={styles["reward-prize"]}>
              <div className={CardsDesign_styles["card-3d-wrapper"]}>
                <div className={CardsDesign_styles["card-inner"]}>
                  <div
                    className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[rewardCard.lvl_name.toLowerCase()]}`}
                  >
                    <div className={CardsDesign_styles["card-shine"]}></div>
                    <div className={CardsDesign_styles["card-header"]}>
                      <span
                        className={CardsDesign_styles["card-cost"]}
                        title="Занимает 15 слотов силы"
                      >
                        {rewardCard.power_slot}
                      </span>
                      <span
                        className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[rewardCard.lvl_name.toLowerCase()]}`}
                      >
                        {rewardCard.lvl_name}
                      </span>
                    </div>
                    <div className={CardsDesign_styles["card-artwork"]}>
                      <img
                        src={`${api.API_BASE_URL}/${rewardCard.card_avatar}`}
                        alt="artwork"
                      />
                    </div>
                    <div className={CardsDesign_styles["card-body"]}>
                      <div
                        className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[rewardCard.lvl_name.toLowerCase()]}`}
                      >
                        {rewardCard.card_name}
                      </div>
                      <div className={CardsDesign_styles["card-description"]}>
                        {rewardCard.card_description}
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
                          {rewardCard.card_damage}
                        </span>
                      </div>
                      <div
                        className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                      >
                        <span className={CardsDesign_styles["stat-icon"]}>
                          🛡️
                        </span>
                        <span className={CardsDesign_styles["stat-value"]}>
                          {rewardCard.card_protection}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={CardsDesign_styles["game-card-back"]}>
                    <div className={CardsDesign_styles["card-back-logo"]}>
                      🔮
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className={styles["claim-btn"]} onClick={handleClaim}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
