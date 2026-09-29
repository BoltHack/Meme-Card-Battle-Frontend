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

interface LinkFormat {
  name: string;
  link: string;
  icon: string;
  priority: number;
}

// import DOMPurify from "dompurify";

// const cleanSvg = DOMPurify.sanitize(svgFromServer, {
//   USE_PROFILES: { svg: true },
// });
// container.innerHTML = cleanSvg;

interface ResponseProps {
  link_id: string;
}

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const EditLinkPage = ({ link_id }: ResponseProps) => {
  // const navigate = useNavigate();

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/admin/links/${link_id}/edit`,
  );

  const [formData, setFormData] = useState<LinkFormat>({
    name: "",
    link: "",
    icon: "",
    priority: 1,
  });
  const [mainPriority, setMainPriority] = useState<boolean | false>(false);

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

  const HandlemainPriority = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setMainPriority(true);
    } else {
      setMainPriority(false);
    }
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = new FormData();

    dataToSend.append("name", formData.name);
    dataToSend.append("link", formData.link);
    dataToSend.append("icon", formData.icon);
    dataToSend.append("priority", String(formData.priority));
    dataToSend.append("main_priority", String(mainPriority));

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/links/${link_id}/edit`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        // setFormData({
        //   name: "",
        //   link: "",
        //   icon: "",
        //   priority: 1,
        //   priority: 1,
        // });
        // setMainPriority(false);
        toast.success(response.data.success);
      }

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
    if (!data || !Array.from(data.renderData)) {
      return;
    }

    setFormData({
      name: data.renderData.name,
      link: data.renderData.link,
      icon: data.renderData.icon,
      priority: data.renderData.priority,
    });
    setMainPriority(data.renderData.main_priority);
  }, [data]);

  if (loading) return <ContentLoading />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div
      id="edit-link-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Редактор данных</h1>
        <p>Управление содержимым ссылок</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("links:list")}
      >
        ← Назад
      </a>

      <div className={styles["editor-container"]}>
        <h1 className={styles["editor-title"]}>Редактирование данных ссылки</h1>

        <form className={styles["editor-form"]} onSubmit={handleSubmit}>
          <div className={styles["editor-left-side"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="name">
                Название
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                value={formData.name}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="link">
                Ссылка
              </label>
              <input
                type="text"
                name="link"
                id="link"
                onChange={handleChange}
                value={formData.link}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="priority">
                Приоритет
              </label>
              <input
                type="number"
                name="priority"
                id="priority"
                min="1"
                onChange={handleChange}
                onKeyDown={handleMinusNumber}
                value={formData.priority}
                className={styles["form-input"]}
                placeholder="Заполните форму..."
                required
              />
            </div>

            <div
              className={styles["form-group"]}
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <label className={styles["form-label"]} htmlFor="mainPriority">
                MAIN PAGE VIEW
              </label>
              <label className={styles["main-page-view-container"]}>
                <input
                  type="checkbox"
                  checked={mainPriority}
                  name="mainPriority"
                  id="mainPriority"
                  onChange={HandlemainPriority}
                />
                <div className={styles["checkmark"]}></div>
              </label>
            </div>
          </div>
          <div
            className={styles["editor-left-side"]}
            style={{ maxWidth: "600px" }}
          >
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="icon">
                Иконка (svg)
              </label>
              <textarea
                name="icon"
                id="icon"
                onInput={handleChange}
                value={formData.icon}
                className={styles["form-textarea"]}
                placeholder="Заполните форму..."
                required
              />
            </div>
            <button type="submit" className={styles["submit-btn"]}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
