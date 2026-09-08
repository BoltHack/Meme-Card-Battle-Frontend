import { ChangeEvent, useEffect, useState } from "react";

import styles from "./Card.EditCase.module.css";
// import CardList_styles from "../../CardRedaction/CardList/Card.CardList.module.css";
import CardsDesign_styles from "../../../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import usePageRender from "../../../../tools/PageRender.ts";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import { DefaultLoading } from "../../../LoadingPage/DefaultLoading.tsx";
import toast from "react-hot-toast";
import { CaseListPage } from "../CaseListPage/CaseList.tsx";

interface CardPost {
  id: string;
  name: string;
  avatar: string;
  description: string;
  damage: number;
  protection: string;
  lvl: number;
  rarity: string;
  power_slot: number;
  chance: number;
}

interface ResponseProps {
  case_id: string;
}

export const EditContentPage = ({ case_id }: ResponseProps) => {
  const [formData, setFormData] = useState({
    card_id: "",
    card_chance: "",
  });

  const [cardList, setCardList] = useState<CardPost[]>([]);

  const [addNewCardMenu, setAddNewCardMenu] = useState<boolean | false>(false);

  const [back, setBack] = useState<boolean | false>(false);

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/admin/case/${case_id}/edit/content`,
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMinusNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "+") e.preventDefault();
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = new FormData();

    dataToSend.append("card_id", formData.card_id);
    dataToSend.append("card_chance", formData.card_chance);

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/case/${case_id}/edit/content`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Новая карта успешно добавлена:", response.data);

      setCardList((prevState) => [...prevState, response.data.card]);

      toast.success(response.data.success);
      setAddNewCardMenu(false);
      setFormData({
        card_id: "",
        card_chance: "",
      });
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data.error;
      console.log("error", error);
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
    }
  };

  useEffect(() => {
    if (!data || !Array.isArray(data.renderData)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setCardList(data.renderData);
    // if (data?.renderData?.card && Array.isArray(data.renderData.card)) {
    //   setCardList(data.renderData.card);
    // }
  }, [data]);

  if (loading) return <DefaultLoading />;
  if (error) return <ErrorPage error={error} />;

  if (back) return <CaseListPage />;

  return (
    <div
      id="edit-content-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Редактор содержимого</h1>
        <p>Изменение содержимого кейса.</p>
      </header>

      <a
        href="#"
        className={admin_styles["on-back"]}
        onClick={() => setBack(true)}
      >
        ← Назад
      </a>

      <main className={styles["discord-card-container"]}>
        <button
          onClick={() => setAddNewCardMenu(true)}
          className={styles["add-card-btn"]}
        >
          Добавить карту
        </button>

        <br />
        <br />
        <br />
        <div className={CardsDesign_styles["cards-grid"]}>
          {cardList && cardList.length > 0
            ? cardList.map((card) => {
                const rarity = card?.rarity.toLowerCase();
                return (
                  <div
                    key={card.id}
                    className={CardsDesign_styles["card-3d-wrapper"]}
                  >
                    <div className={CardsDesign_styles["card-inner"]}>
                      <div
                        className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[rarity]} ${CardsDesign_styles[rarity]}`}
                        style={{ width: "220px" }}
                      >
                        <div className={CardsDesign_styles["card-shine"]}></div>
                        <div className={CardsDesign_styles["card-header"]}>
                          <span
                            className={CardsDesign_styles["card-cost"]}
                            title="Занимает 15 слотов силы"
                          >
                            {card.power_slot}
                          </span>
                          <span
                            className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[rarity]}`}
                          >
                            {card.rarity}
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
                            className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[rarity]}`}
                          >
                            {card.name}
                          </div>
                          <div
                            className={CardsDesign_styles["card-description"]}
                          >
                            {card.description}
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
                              {card.damage}
                            </span>
                          </div>
                          <div
                            className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                          >
                            <span className={CardsDesign_styles["stat-icon"]}>
                              🛡️
                            </span>
                            <span className={CardsDesign_styles["stat-value"]}>
                              {card.protection}
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
              })
            : null}
        </div>
      </main>

      {addNewCardMenu && (
        <div className={styles["menu-wrapper"]}>
          <div className={styles["action-menu"]}>
            <h2>Добавить карту</h2>
            <div className={styles["action-options"]}>
              <div className={styles["options-group"]}>
                <label htmlFor="card_id">ID карты</label>
                <input
                  type="text"
                  name="card_id"
                  id="card_id"
                  onChange={handleChange}
                  value={formData.card_id}
                  placeholder="Заполните форму..."
                  required
                />
              </div>
              <div className={styles["options-group"]}>
                <label htmlFor="card_chance">Шанс выпадения</label>
                <input
                  type="number"
                  name="card_chance"
                  id="card_chance"
                  min="1"
                  onKeyDown={handleMinusNumber}
                  onChange={handleChange}
                  value={formData.card_chance}
                  placeholder="Заполните форму..."
                  required
                />
              </div>
            </div>
            <div className={styles["action-menu-btn"]}>
              <button onClick={(e) => handleSubmit(e)}>
                <span>Добавить</span>
              </button>
              <button onClick={() => setAddNewCardMenu(false)}>
                <span>Отмена</span>
              </button>
            </div>
            <br />
          </div>
        </div>
      )}
    </div>
  );
};
