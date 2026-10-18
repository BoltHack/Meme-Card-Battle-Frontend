import { useEffect, useState } from "react";

import styles from "./Card.CardList.module.css";
import CardsDesign_styles from "../../../../tools/global_stylesheets/Card.CardsDesign_styles.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

import toast from "react-hot-toast";

interface CardPost {
  card_id: string;
  card_name: string;
  card_avatar: string;
  card_description: string;
  card_damage: string;
  card_protection: string;
  lvl_number: string;
  lvl_name: string;
  power_slot: string;
}

interface CardResponse {
  id?: string;
  renderData: {
    card: CardPost[];
  };
}

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const CardListPage = () => {
  const [cards, setCards] = useState<CardPost[]>([]);

  const initialCardState = {
    card_id: "",
    card_name: "",
    card_avatar: "",
    card_description: "",
    card_damage: "",
    card_protection: "",
    lvl_number: "",
    lvl_name: "",
    power_slot: "",
  };
  const [editCardData, setEditCardData] = useState(initialCardState);

  const [cardsCategory, setCardsCategory] = useState<string | "all">("all");

  const { contentData, contentLoading, contentError } =
    useContentRender<CardResponse>(`/admin/card/list/${cardsCategory}`);

  const copy = (cardId: string) => {
    navigator.clipboard
      .writeText(cardId)
      .then(() => {
        toast.success(`ID ${cardId} скопирован!`);
      })
      .catch((err) => console.log("copy error", err));
  };

  // const cardEditMenu = (data: CardPost) => {
  //   console.log("data", data);
  //   setEditCardData((prevState) => [...prevState, data]);
  // };

  const handleRemoveCard = async (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/admin/card/${id}/delete`, {
        withCredentials: true,
      });

      console.log("Карта успешно удалена:", response.data);

      const updatedBlogList = cards.filter((item) => item.card_id !== id);
      setCards(updatedBlogList);
      setEditCardData(initialCardState);

      toast.success(response.data.success);
      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!contentData || !Array.isArray(contentData.renderData.card)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    setCards(contentData.renderData.card);
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="card-list-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Список игровых карт</h1>
        <p>Просматривайте, редактируйте и удаляйте карты.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("card:settings")}
      >
        ← Назад
      </a>

      <main className={styles["discord-card-container"]}>
        <div className={styles["card-categories"]}>
          <button
            onClick={() => setCardsCategory("all")}
            className={`${styles["card-categorie-btn"]} ${cardsCategory === "all" ? styles["active"] : null}`}
          >
            Все
          </button>
          <button
            onClick={() => setCardsCategory("default")}
            className={`${styles["card-categorie-btn"]} ${cardsCategory === "default" ? styles["active"] : null}`}
          >
            Обычные
          </button>
          <button
            onClick={() => setCardsCategory("rare")}
            className={`${styles["card-categorie-btn"]} ${cardsCategory === "rare" ? styles["active"] : null}`}
          >
            Редкие
          </button>
          <button
            onClick={() => setCardsCategory("epic")}
            className={`${styles["card-categorie-btn"]} ${cardsCategory === "epic" ? styles["active"] : null}`}
          >
            Эпические
          </button>
          <button
            onClick={() => setCardsCategory("legendary")}
            className={`${styles["card-categorie-btn"]} ${cardsCategory === "legendary" ? styles["active"] : null}`}
          >
            Легендарные
          </button>
        </div>

        <div className={CardsDesign_styles["cards-grid"]}>
          {cards && cards.length > 0
            ? cards.map((card) => {
                const lvlName = card?.lvl_name.toLowerCase();
                return (
                  <div
                    key={card.card_id}
                    className={CardsDesign_styles["card-3d-wrapper"]}
                    onClick={() =>
                      setEditCardData({
                        card_id: card.card_id,
                        card_name: card.card_name,
                        card_avatar: card.card_avatar,
                        card_description: card.card_description,
                        card_damage: card.card_damage,
                        card_protection: card.card_protection,
                        lvl_number: card.lvl_number,
                        lvl_name: card.lvl_name,
                        power_slot: card.power_slot,
                      })
                    }
                  >
                    <div className={CardsDesign_styles["card-inner"]}>
                      <div
                        className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[lvlName.toLowerCase()]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
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
                            className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                          >
                            {card.lvl_name}
                          </span>
                        </div>
                        <div className={CardsDesign_styles["card-artwork"]}>
                          <img src={`/${card.card_avatar}`} alt="artwork" />
                        </div>
                        <div className={CardsDesign_styles["card-body"]}>
                          <div
                            className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[lvlName.toLowerCase()]}`}
                          >
                            {card.card_name}
                          </div>
                          <div
                            className={CardsDesign_styles["card-description"]}
                          >
                            {card.card_description}
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
                              {card.card_damage}
                            </span>
                          </div>
                          <div
                            className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                          >
                            <span className={CardsDesign_styles["stat-icon"]}>
                              🛡️
                            </span>
                            <span className={CardsDesign_styles["stat-value"]}>
                              {card.card_protection}
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

      {editCardData.card_id && (
        <div className={styles["menu-wrapper"]}>
          <div className={styles["action-menu"]}>
            <h2>Удалить карту</h2>
            <div className={styles["action-options"]}>
              <div className={CardsDesign_styles["card-3d-wrapper"]}>
                <div className={CardsDesign_styles["card-inner"]}>
                  <div
                    className={`${CardsDesign_styles["game-card"]} ${CardsDesign_styles[editCardData.lvl_name.toLowerCase()]} ${CardsDesign_styles[editCardData.lvl_name.toLowerCase()]}`}
                  >
                    <div className={CardsDesign_styles["card-shine"]}></div>
                    <div className={CardsDesign_styles["card-header"]}>
                      <span
                        className={CardsDesign_styles["card-cost"]}
                        title="Занимает 15 слотов силы"
                      >
                        {editCardData.power_slot}
                      </span>
                      <span
                        className={`${CardsDesign_styles["card-rarity"]} ${CardsDesign_styles[editCardData.lvl_name.toLowerCase()]}`}
                      >
                        {editCardData.lvl_name}
                      </span>
                    </div>
                    <div className={CardsDesign_styles["card-artwork"]}>
                      <img src={`/${editCardData.card_avatar}`} alt="artwork" />
                    </div>
                    <div className={CardsDesign_styles["card-body"]}>
                      <div
                        className={`${CardsDesign_styles["card-title"]} ${CardsDesign_styles[editCardData.lvl_name.toLowerCase()]}`}
                      >
                        {editCardData.card_name}
                      </div>
                      <div className={CardsDesign_styles["card-description"]}>
                        {editCardData.card_description}
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
                          {editCardData.card_damage}
                        </span>
                      </div>
                      <div
                        className={`${CardsDesign_styles["stat-badge"]} ${CardsDesign_styles["protection-badge"]}`}
                      >
                        <span className={CardsDesign_styles["stat-icon"]}>
                          🛡️
                        </span>
                        <span className={CardsDesign_styles["stat-value"]}>
                          {editCardData.card_protection}
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
            <br />
            <br />
            <button
              className={styles["card_id_to_copy"]}
              onClick={() => copy(editCardData.card_id)}
            >
              Скопировать ID карты
            </button>
            <br />
            <div className={styles["action-menu-btn"]}>
              <button
                onClick={(e) => handleRemoveCard(editCardData.card_id, e)}
              >
                <span>Удалить</span>
              </button>
              <button onClick={() => setEditCardData(initialCardState)}>
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
