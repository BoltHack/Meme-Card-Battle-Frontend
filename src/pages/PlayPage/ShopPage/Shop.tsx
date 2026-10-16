import { useEffect, useState } from "react";

import styles from "./Card.Shop.module.css";
// import CardsDesign_styles from "../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import useContentRender from "../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../../components/LoadingPage/Loading.tsx";

import toast from "react-hot-toast";

interface CaseFormat {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  quantity: string;
  price: string;
  prioriry: string;
}

import { playFunctions } from "../Play/Play.tsx";

export const ShopPage = () => {
  const [cases, setCases] = useState<CaseFormat[]>([]);

  const initialShopDataState = {
    product: "",
    quantity: 0,
  };

  const [shopData, setShopData] = useState(initialShopDataState);

  // const [caseContent, setCaseContent] = useState<[]>([]);

  // const [isCaseMenuOpen, setIsCaseMenuOpen] = useState<boolean | false>(false);

  const [isCaseLoading, setIsCaseLoading] = useState<string | null>(null);

  const { contentData, contentLoading, contentError } = useContentRender(
    `${api.API_BASE_URL}/play/shop`,
  );

  const buyCase = async (case_id: string, case_quantity: string) => {
    setIsCaseLoading(case_id);

    const dataToSend = new FormData();

    dataToSend.append("case_quantity", case_quantity);

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/play/case/${case_id}/buy`,
        dataToSend,
        {
          withCredentials: true,
        },
      );
      if (response.data?.success) {
        toast.success(response.data?.success);
        setIsCaseLoading(null);
        setShopData({
          product: response.data.shopData.product,
          quantity: response.data.shopData.quantity,
        });
        playFunctions.updateUserInfo(response.data.coins);
      }
      return response.data;
    } catch (error) {
      console.log("error", error);
      setIsCaseLoading(null);
      const errorMessage = error?.response?.data.error;
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
    }
  };

  // const openCase = async (case_id: string) => {
  //   setIsCaseLoading(case_id);

  //   try {
  //     const response = await axios.post(
  //       `${api.API_BASE_URL}/play/case/${case_id}/content/get`,
  //       {
  //         withCredentials: true,
  //       },
  //     );

  //     if (response.data?.success) {
  //       setIsCaseLoading(null);
  //       setCaseContent(response.data.content);
  //       setIsCaseMenuOpen(true);
  //     }

  //     console.log("response", response.data);

  //     return response.data;
  //   } catch (error) {
  //     console.log("error", error);
  //     setIsCaseLoading(null);
  //   }
  // };

  const updatePrice = (case_id: string, count: number) => {
    setCases((prevState) =>
      prevState.map((cs) =>
        cs.id === case_id
          ? {
              ...cs,
              quantity: String(count),
            }
          : cs,
      ),
    );
  };

  const formattedCPrice = (count: number): string => {
    const formattedCount = new Intl.NumberFormat("de-DE", {
      notation: "standard",
      // compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(count);
    return formattedCount.toLowerCase();
  };

  useEffect(() => {
    if (!contentData || !Array.isArray(contentData.renderData)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    playFunctions.handleChangeHeaderState(true);

    setCases(contentData.renderData);
    console.log("contentData", contentData);
  }, [contentData]);

  if (contentLoading || cases.length < 1) return <LoadingPage />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div className={styles["play-container"]}>
      <div className={styles["shop-container"]}>
        <header className={styles["shop-header"]}>
          <h1>Магазин</h1>
        </header>

        <main className={styles["grid-container"]}>
          <header>
            <h1>Кейсы</h1>
            <p>Испытай удачу и собери свою коллекцию редких карт</p>
          </header>

          <div className={styles["grid-content"]}>
            {cases && cases.length > 0
              ? cases
                  .sort((a, b) => a.priority.localeCompare(b.priority))
                  // .sort((a, b) => a.prioriry.localeCompare(b.prioriry))
                  .map((cs, index) => {
                    return (
                      <section
                        key={index}
                        className={`${styles["case-card"]} ${styles["case-" + cs.rarity.toLowerCase()]}`}
                      >
                        <div className={styles["case-visual"]}>
                          <div className={styles["glow-source"]}></div>
                          <div className={styles["card-pack-3d"]}>
                            <div
                              className={`${styles["layer"]} ${styles["layer-3"]}`}
                            ></div>
                            <div
                              className={`${styles["layer"]} ${styles["layer-2"]}`}
                            ></div>
                            <div
                              className={`${styles["layer"]} ${styles["layer-1"]}`}
                            >
                              <div
                                data-icon={cs.icon}
                                className={`${styles["card-pattern"]} after:content-[attr(data-icon)]`}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className={styles["case-info"]}>
                          <span className={styles["badge"]}>{cs.rarity}</span>
                          <h3>
                            {cs.name} {cs.quantity} шт.
                          </h3>
                          <p className={styles["case-desc"]}>
                            {cs.description}
                          </p>
                          <div className={styles["quantity-selector"]}>
                            <label
                              className={`${styles["quantity-option"]} ${styles[Number(cs.quantity) === 1 ? "checked" : ""]}`}
                            >
                              <input
                                type="radio"
                                name="quantity"
                                value="1"
                                onChange={() => updatePrice(cs.id, 1)}
                              />
                              <span>x1</span>
                            </label>
                            <label
                              className={`${styles["quantity-option"]} ${styles[Number(cs.quantity) === 15 ? "checked" : ""]}`}
                            >
                              <input
                                type="radio"
                                name="quantity"
                                value="15"
                                onChange={() => updatePrice(cs.id, 15)}
                              />
                              <span>x15</span>
                            </label>
                            <label
                              className={`${styles["quantity-option"]} ${styles[Number(cs.quantity) === 30 ? "checked" : ""]}`}
                            >
                              <input
                                type="radio"
                                name="quantity"
                                value="30"
                                onChange={() => updatePrice(cs.id, 30)}
                              />
                              <span>x30</span>
                            </label>
                          </div>
                          <div className={styles["case-footer"]}>
                            <div className={styles["price-block"]}>
                              <svg
                                className={styles["currency-svg"]}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://w3.org"
                              >
                                <defs>
                                  <linearGradient
                                    id="coinGrad"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                  >
                                    <stop offset="0%" stopColor="#fcd34d" />
                                    <stop offset="50%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#b45309" />
                                  </linearGradient>
                                  <linearGradient
                                    id="symbolGrad"
                                    x1="0%"
                                    y1="0%"
                                    x2="0%"
                                    y2="100%"
                                  >
                                    <stop offset="0%" stopColor="#ffffff" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                  </linearGradient>
                                </defs>
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="url(#coinGrad)"
                                  strokeWidth="2"
                                  fill="rgba(21, 9, 49, 0.6)"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="7"
                                  stroke="url(#coinGrad)"
                                  strokeWidth="1"
                                  strokeDasharray="2 1"
                                  fill="none"
                                />
                                <path
                                  d="M12 6L15 12L12 18L9 12L12 6Z"
                                  fill="url(#symbolGrad)"
                                />
                                <path
                                  d="M12 8L14 12L12 16L10 12L12 8Z"
                                  fill="#b45309"
                                  opacity="0.5"
                                />
                              </svg>
                              <span className={styles["price"]}>
                                {formattedCPrice(
                                  Number(cs.price) * Number(cs.quantity),
                                )}
                              </span>
                            </div>
                            <button
                              className={styles["buy-btn"]}
                              disabled={shopData.product ? true : false}
                              onClick={() => buyCase(cs.id, cs.quantity)}
                            >
                              <span>
                                {isCaseLoading === cs.id
                                  ? "Загрузка..."
                                  : "Купить"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </section>
                    );
                  })
              : null}
          </div>

          {/* <header>
            <h1>Валюта</h1>
            <p>Обменяй коины на валюту</p>
          </header> */}
        </main>
      </div>

      {shopData.product && (
        <div className={styles["menu-wrapper"]}>
          <div className={styles["shop-modal"]}>
            <div className={styles["shop-modal-aside"]}>
              <div className={styles["cart-icon-container"]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shopping-cart"
                >
                  <path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" />
                  <path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" />
                  <circle cx="18" cy="20" r="2" />
                  <circle cx="8" cy="20" r="2" />
                </svg>
              </div>
            </div>

            <div className={styles["shop-modal-main"]}>
              <button
                className={styles["close-btn"]}
                onClick={() => setShopData(initialShopDataState)}
              >
                &times;
              </button>

              <h2 className={styles["shop-modal-title"]}>
                ПОКУПКА ПРОИЗВЕДЕНА УСПЕШНО
              </h2>

              <p className={styles["subtitle"]}>Вы приобрели:</p>

              <div className={styles["purchase-item"]}>
                <span className={styles["item-name"]}>{shopData.product}</span>
                <span className={styles["item-count"]}>
                  {shopData.quantity}
                </span>
              </div>

              <div className={styles["button-container"]}>
                <button
                  className={styles["shop-action-btn"]}
                  onClick={() => setShopData(initialShopDataState)}
                >
                  {/* <span className={styles["key-hin"]}>ENTER</span> */}
                  ЗАКРЫТЬ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
