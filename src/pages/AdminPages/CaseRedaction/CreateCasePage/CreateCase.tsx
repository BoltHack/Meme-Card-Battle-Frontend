import { ChangeEvent, useState } from "react";

import styles from "../../CardRedaction/CreateCardPage/Card.CreateCard.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import usePageRender from "../../../../tools/PageRender.ts";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import { DefaultLoading } from "../../../LoadingPage/DefaultLoading.tsx";
import toast from "react-hot-toast";

import { CaseSettingsPage } from "../CaseSettingsPage/CaseSettings.tsx";

interface CaseFormat {
  case_name: string;
  case_description: string;
  case_icon: string;
  case_rarity: string;
  case_price: string;
}

export const CreateCasePage = () => {
  const [formData, setFormData] = useState<CaseFormat>({
    case_name: "",
    case_description: "",
    case_icon: "",
    case_rarity: "DEFAULT",
    case_price: "",
  });

  const [back, setBack] = useState<boolean | false>(false);

  const { loading, error } = usePageRender(
    `${api.API_BASE_URL}/admin/case/create`,
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

    dataToSend.append("name", formData.case_name);
    dataToSend.append("description", formData.case_description);
    dataToSend.append("icon", formData.case_icon);
    dataToSend.append("rarity", formData.case_rarity);
    dataToSend.append("price", formData.case_price);

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/case/create`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Новый кейс успешно создан:", response.data);

      setFormData({
        case_name: "",
        case_description: "",
        case_icon: "",
        case_rarity: "DEFAULT",
        case_price: "",
      });

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

  if (loading) return <DefaultLoading />;
  if (error) return <ErrorPage error={error} />;

  if (back) return <CaseSettingsPage />;

  return (
    <div
      id="create-case-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Создать новый кейс</h1>
        <p>Создание нового, уникального кейса.</p>
      </header>

      <a
        href="#"
        className={admin_styles["on-back"]}
        onClick={() => setBack(true)}
      >
        ← Назад
      </a>

      <div className={styles["editor-container"]}>
        <h1 className={styles["editor-title"]}>Создание нового кейса</h1>

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

            <button type="submit" className={styles["submit-btn"]}>
              Создать кейс
            </button>
          </div>

          {/* <div className={styles["editor-right-side"]}>
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
              Опубликовать статью
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};
