import { ChangeEvent, useState } from "react";

import styles from "./Card.CreateCard.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../сomponents/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../сomponents/LoadingPage/ContentLoading.tsx";

import toast from "react-hot-toast";

interface PlayerData {
  name: string;
}

interface CardsFormat {
  card_name: string;
  card_description: string;
  card_damage: string;
  card_protection: string;
  lvl_number: string;
  lvl_name: string;
  power_slot: string;
}

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const CreateCardPage = () => {
  // const navigate = useNavigate();

  const { contentLoading, contentError } = useContentRender<PlayerData>(
    `${api.API_BASE_URL}/admin/card/create`,
  );

  const [formData, setFormData] = useState<CardsFormat>({
    card_name: "",
    card_description: "",
    card_damage: "",
    card_protection: "",
    lvl_number: "",
    lvl_name: "DEFAULT",
    power_slot: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  //     const { name, value } = e.target;
  //     formData[name as keyof typeof formData] = value;
  // };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleMinusNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "+") e.preventDefault();
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = new FormData();

    dataToSend.append("card_name", formData.card_name);
    dataToSend.append("card_description", formData.card_description);
    dataToSend.append("card_damage", formData.card_damage);
    dataToSend.append("card_protection", formData.card_protection);
    dataToSend.append("lvl_number", formData.lvl_number);
    dataToSend.append("lvl_name", formData.lvl_name);
    dataToSend.append("power_slot", formData.power_slot);
    if (file) {
      console.log("file", file);
      dataToSend.append("card_avatar", file);
    }
    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/card/create`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Карта успешно создана:", response.data);

      setFormData({
        card_name: "",
        card_description: "",
        card_damage: "",
        card_protection: "",
        lvl_number: "",
        lvl_name: "DEFAULT",
        power_slot: "",
      });
      setFile(null);

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

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="create-card-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Создание игральных карт</h1>
        <p>Создайте себе карту, выбрав нужные характеристики.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("card:settings")}
      >
        ← Назад
      </a>

      <div className={styles["editor-container"]}>
        <h1 className={styles["editor-title"]}>Создание новой карты</h1>

        <form className={styles["editor-form"]} onSubmit={handleSubmit}>
          <div className={styles["editor-left-side"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="card_name">
                Название карты
              </label>
              <input
                type="text"
                name="card_name"
                id="card_name"
                onChange={handleChange}
                value={formData.card_name}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            {/*<div className={styles["form-group"]}>*/}
            {/*    <label className={styles["form-label"]} htmlFor="card_description">Описание</label>*/}
            {/*    <input*/}
            {/*        type="text" name="card_description" id="card_description"*/}
            {/*        onChange={handleChange} value={formData.card_description}*/}
            {/*        className={styles["form-input"]}*/}
            {/*        placeholder="Заполните форму..."*/}
            {/*        required*/}
            {/*    />*/}
            {/*</div>*/}

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="card_damage">
                Урон
              </label>
              <input
                type="number"
                name="card_damage"
                id="card_damage"
                min="1"
                onKeyDown={handleMinusNumber}
                onChange={handleChange}
                value={formData.card_damage}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="card_protection">
                Броня
              </label>
              <input
                type="number"
                name="card_protection"
                id="card_protection"
                min="1"
                onKeyDown={handleMinusNumber}
                onChange={handleChange}
                value={formData.card_protection}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="lvl_number">
                Уровень
              </label>
              <input
                type="number"
                name="lvl_number"
                id="lvl_number"
                min="1"
                onKeyDown={handleMinusNumber}
                onChange={handleChange}
                value={formData.lvl_number}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="power_slot">
                Слот уровня
              </label>
              <input
                type="number"
                name="power_slot"
                id="power_slot"
                min="1"
                onKeyDown={handleMinusNumber}
                onChange={handleChange}
                value={formData.power_slot}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="lvl_number">
                Редкость
              </label>
              <select
                name="lvl_name"
                onChange={handleChange}
                value={formData.lvl_name}
                className={styles["form-input"]}
              >
                <option value="DEFAULT">Обычный</option>
                <option value="RARE">Редкий</option>
                <option value="EPIC">Эпический</option>
                <option value="LEGENDARY">Легендарный</option>
              </select>
            </div>

            {/*<button type="submit" className={styles["submit-btn"]}>Создать карту</button>*/}
          </div>

          <div className={styles["editor-right-side"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Обложка</label>
              <label className={styles["file-dropzone"]}>
                <input
                  onChange={handleFileChange}
                  type="file"
                  name="card_cover"
                  accept="image/*"
                />
                <div className={styles["file-dropzone-text"]}>
                  {file !== null ? (
                    <span>
                      Файл выбран <strong>{file.name}</strong>
                    </span>
                  ) : (
                    <span>
                      Перетащите изображение сюда или{" "}
                      <strong>выберите файл</strong>
                    </span>
                  )}
                </div>
              </label>
              {file !== null && (
                <a
                  className={styles["delete-file-btn"]}
                  onClick={() => setFile(null)}
                >
                  Нажмите, чтобы удалить файл
                </a>
              )}
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Описание</label>
              <textarea
                name="card_description"
                id="card_description"
                onInput={handleTextAreaChange}
                value={formData.card_description}
                className={styles["form-textarea"]}
                placeholder="Заполните форму..."
                required
              />
            </div>
            <button type="submit" className={styles["submit-btn"]}>
              Создать карту
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
