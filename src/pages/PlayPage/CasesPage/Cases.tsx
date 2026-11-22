import { useEffect, useState, useRef, WheelEvent } from "react";

import styles from "./Card.Cases.module.css";
import shop_styles from "../ShopPage/Card.Shop.module.css";
import CardsDesign_styles from "../../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../../components/LoadingPage/Loading.tsx";

import toast from "react-hot-toast";

interface ContentPost {
  id: string;
  name: string;
  description: string;
  avatar: string;
  lvl: string;
  rarity: string;
  damage: string;
  protection: string;
  power_slot: string;
  chance: string;
}
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

import { SoundFunctions } from "../../../tools/global_scripts/SoundsPlayer.tsx";

export const CasesPage = () => {
  const [caseContent, setCaseContent] = useState<ContentPost[]>([]);
  const [caseContentLoading, setCaseContentLoading] = useState<boolean | false>(
    false,
  );
  const contentContainerRef = useRef(null);

  const handleMouseScroll = (e: WheelEvent<HTMLDivElement>) => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollLeft += e.deltaY;
    }
  };

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

  const { contentData, contentLoading, contentError } =
    useContentRender(`/play/cases`);

  const handleSetCurrentCase = (caseId: string) => {
    if (caseId === currentCase) return;

    setCurrentCase(caseId);
    SoundFunctions.PlaySound_Play("btn_click_v2");
  };

  const getCaseContent = async (case_id: string) => {
    SoundFunctions.fixedVolumeSound("play", "btn_click_v5", 0.2);
    SoundFunctions.PlaySound_Play("btn_click_v6");
    setTimeout(() => setCaseContentLoading(true), 100);
    try {
      const response = await axios.post(`/play/case/${case_id}/content/get`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setCaseContentLoading(false);
        SoundFunctions.fixedVolumeSound("play", "menu_open", 0.2);
        setCaseContent(response.data.content);
      }

      return response.data;
    } catch (error: any) {
      console.log("error", error);
      const errorMessage = error?.response?.data.error;
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
    }
  };

  const closeContentMenu = () => {
    SoundFunctions.PlaySound_Play("btn_click_v2");
    SoundFunctions.fixedVolumeSound("play", "menu_close_v2", 0.4);
    setCaseContent([]);
  };

  const openCase = async (case_id: string) => {
    setLoadingBtn(true);
    if (isOpenCase !== "") return;
    try {
      const response = await axios.post(`/play/case/${case_id}/open`, {
        withCredentials: true,
      });

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
    } catch (error: any) {
      console.log("error", error);
      setLoadingBtn(false);
      const errorMessage = error?.response?.data.error;
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
    }
  };

  const openContainer = (case_id: string) => {
    SoundFunctions.PlaySound_Play("open_case");
    setIsOpenCase(case_id);
    setMenuType("open");
    setTimeout(() => {
      setReward(true);
      SoundFunctions.PlaySound_Play("open_case_result");
    }, 1000);
  };

  const handleClaim = () => {
    SoundFunctions.PlaySound_Play("btn_click_v2");
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
  }, [contentData]);

  if (contentLoading || !contentData) return <LoadingPage />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div className={styles["play-container"]}>
      <header className={styles["header-container"]}>
        <div className={styles["header-content"]}>
          {cases && cases.length > 0
            ? cases.map((cs, index) => {
                return (
                  <div
                    key={index}
                    className={styles["header-btn"]}
                    // onClick={() => setCurrentCase(cs.rarity.toLowerCase())}
                    onClick={() =>
                      handleSetCurrentCase(cs.rarity.toLowerCase())
                    }
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

      <div
        className={shop_styles["grid-content"]}
        style={{
          position: "fixed",
          top: "20%",
          left: "2.5%",
          maxWidth: "320px",
        }}
      >
        {cases && cases.length > 0
          ? cases
              .filter((cs) => cs.rarity.toLowerCase() === currentCase)
              .map((cs, index) => {
                return (
                  <section
                    key={index}
                    className={`${shop_styles["case-card"]} ${shop_styles["case-" + cs.rarity.toLowerCase()]}`}
                    style={{ transform: "translateY(0)" }}
                  >
                    <br />
                    <div className={shop_styles["case-info"]}>
                      <span className={shop_styles["badge"]}>{cs.rarity}</span>
                      <h3>{cs.name}</h3>
                      <p className={shop_styles["case-desc"]}>
                        {cs.description}
                      </p>

                      <div className={shop_styles["case-footer"]}>
                        <button
                          className={shop_styles["buy-btn"]}
                          style={{ width: "100%" }}
                          onClick={() => getCaseContent(cs.id)}
                          disabled={isOpenCase !== "" ? true : false}
                        >
                          <span>
                            {!caseContentLoading
                              ? "Посмотреть содержимое"
                              : "Загрузка..."}
                          </span>
                        </button>
                      </div>
                    </div>
                  </section>
                );
              })
          : null}
      </div>

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
                              disabled={loadingBtn ? true : false}
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

      {caseContent && caseContent.length > 0 ? (
        <div className={styles["modal-overlay"]}>
          <button
            className={styles["modal-close"]}
            // onClick={() => setCaseContent([])}
            onClick={closeContentMenu}
          >
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
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <div className={styles["modal-container"]}>
            <h1>Содержимое кейса</h1>
            {/* <br/> */}
            <div
              className={styles["modal-content"]}
              ref={contentContainerRef}
              onWheel={handleMouseScroll}
            >
              {caseContent.map((cs, index) => {
                return (
                  <div
                    key={index}
                    className={CardsDesign_styles["card-3d-wrapper"]}
                    style={{
                      marginBottom: "10px",
                      cursor: "default",
                    }}
                  >
                    <div className={CardsDesign_styles["card-inner"]}>
                      <div
                        className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[cs.rarity.toLowerCase()]}`}
                      >
                        <div className={CardsDesign_styles["card-shine"]}></div>
                        <div className={CardsDesign_styles["card-header"]}>
                          <span
                            className={CardsDesign_styles["card-cost"]}
                            title="Занимает 15 слотов силы"
                          >
                            {cs.power_slot}
                          </span>
                          <span
                            className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[cs.rarity.toLowerCase()]}`}
                          >
                            {cs.rarity}
                          </span>
                        </div>
                        <div className={CardsDesign_styles["card-artwork"]}>
                          <div
                            className={CardsDesign_styles["card-artwork-img"]}
                            style={{ backgroundImage: `url("/${cs.avatar}")` }}
                          ></div>
                          {/* <img src={`/${cs.avatar}`} alt="artwork" /> */}
                        </div>
                        <div className={CardsDesign_styles["card-body"]}>
                          <div
                            className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[cs.rarity.toLowerCase()]}`}
                          >
                            {cs.name}
                          </div>
                          <div
                            className={CardsDesign_styles["card-description"]}
                          >
                            {cs.description}
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
                              {cs.damage}
                            </span>
                          </div>
                          <div
                            className={`${CardsDesign_styles["stat-badge"]}`}
                            style={{
                              marginTop: "-300px",
                              borderColor: "#606c38",
                            }}
                          >
                            <span className={CardsDesign_styles["stat-icon"]}>
                              %
                            </span>
                            <span className={CardsDesign_styles["stat-value"]}>
                              {cs.chance}
                            </span>
                          </div>
                          <div
                            className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                          >
                            <span className={CardsDesign_styles["stat-icon"]}>
                              🛡️
                            </span>
                            <span className={CardsDesign_styles["stat-value"]}>
                              {cs.protection}
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
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

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
                      <div
                        className={CardsDesign_styles["card-artwork-img"]}
                        style={{
                          backgroundImage: `url("/${rewardCard.card_avatar}")`,
                        }}
                      ></div>
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
