import { ChangeEvent, useEffect, useState } from "react";

import styles from "../../CardRedaction/CreateCardPage/Card.CreateCard.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import usePageRender from "../../../../tools/PageRender.ts";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import { ContentLoading } from "../../../LoadingPage/ContentLoading.tsx";
import toast from "react-hot-toast";

interface CaseFormat {
  case_name: string;
  case_description: string;
  case_icon: string;
  case_rarity: string;
  case_quantity: string;
  case_price: string;
  case_priority: string;
}

interface ResponseProps {
  case_id: string;
}

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const EditDataPage = ({ case_id }: ResponseProps) => {
  const [formData, setFormData] = useState<CaseFormat>({
    case_name: "",
    case_description: "",
    case_icon: "",
    case_rarity: "DEFAULT",
    case_quantity: "",
    case_price: "",
    case_priority: "",
  });

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/admin/case/${case_id}/edit/data`,
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

    console.log("case_id", case_id);

    const dataToSend = new FormData();

    dataToSend.append("name", formData.case_name);
    dataToSend.append("description", formData.case_description);
    dataToSend.append("icon", formData.case_icon);
    dataToSend.append("rarity", formData.case_rarity);
    dataToSend.append("quantity", formData.case_quantity);
    dataToSend.append("price", formData.case_price);
    dataToSend.append("priority", formData.case_priority);

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/case/${case_id}/edit/data`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Новый кейс успешно создан:", response.data);

      toast.success(response.data.success);

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
    if (!data || !data.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setFormData({
      case_name: data.renderData.name,
      case_description: data.renderData.description,
      case_icon: data.renderData.icon,
      case_rarity: data.renderData.rarity,
      case_quantity: data.renderData.quantity,
      case_price: data.renderData.price,
      case_priority: data.renderData.priority,
    });
  }, [data]);

  if (loading) return <ContentLoading />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div
      id="edit-data-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Редактор данных</h1>
        <p>Изменение данных кейса.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("case:list")}
      >
        ← Назад
      </a>

      <div className={styles["editor-container"]}>
        <h1 className={styles["editor-title"]}>Изменить кейс</h1>

        <form className={styles["editor-form"]} onSubmit={handleSubmit}>
          <div className={styles["editor-left-side"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="case_name">
                Название
              </label>
              <input
                type="text"
                name="case_name"
                id="case_name"
                onChange={handleChange}
                value={formData.case_name}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label
                className={styles["form-label"]}
                htmlFor="case_description"
              >
                Описание
              </label>
              <input
                type="text"
                name="case_description"
                id="case_description"
                onChange={handleChange}
                value={formData.case_description}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="case_icon">
                Иконка
              </label>
              <input
                type="text"
                name="case_icon"
                id="case_icon"
                onChange={handleChange}
                value={formData.case_icon}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="case_rarity">
                Редкость
              </label>
              <select
                name="case_rarity"
                onChange={handleChange}
                value={formData.case_rarity}
                className={styles["form-input"]}
              >
                <option value="DEFAULT">Обычный</option>
                <option value="RARE">Редкий</option>
                <option value="EPIC">Эпический</option>
                <option value="LEGENDARY">Легендарный</option>
              </select>
            </div>
          </div>
          <div
            className={styles["editor-right-side"]}
            style={{ marginTop: "0" }}
          >
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="case_quantity">
                Количество
              </label>
              <input
                type="number"
                name="case_quantity"
                id="case_quantity"
                min="1"
                onKeyDown={handleMinusNumber}
                onChange={handleChange}
                value={formData.case_quantity}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="case_price">
                Цена
              </label>
              <input
                type="number"
                name="case_price"
                id="case_price"
                min="1"
                onKeyDown={handleMinusNumber}
                onChange={handleChange}
                value={formData.case_price}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="case_priority">
                Приоритет
              </label>
              <input
                type="number"
                name="case_priority"
                id="case_priority"
                min="1"
                onKeyDown={handleMinusNumber}
                onChange={handleChange}
                value={formData.case_priority}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <button type="submit" className={styles["submit-btn"]}>
              Сохранить данные
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
