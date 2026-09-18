import { useEffect, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import usePageRender from "../../../../tools/PageRender.ts";
import { DefaultLoading } from "../../../LoadingPage/DefaultLoading.tsx";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";

// import { settingsNavigator } from "../SettingsPanel/SettingsPanel.tsx";

export const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    avatar: "",
    role: "",
  });

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/api/settings/profile`,
  );

  useEffect(() => {
    if (!data || !data.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setUserInfo({
      name: data.renderData.name,
      avatar: data.renderData.avatar,
      role: data.renderData.role,
    });

    console.log("data", data);
  }, [data]);

  if (loading || !data) return <DefaultLoading />;
  if (error) return <ErrorPage error={error} />;

  return (
    <>
      <header className={settings_styles["content-header"]}>
        <h1>Настройки профиля</h1>
        <p>
          Управляйте данными вашей учетной записи, безопасностью и внешним видом
        </p>
      </header>

      <section className={settings_styles["settings-section"]}>
        <h2>Личная информация</h2>

        <div className={settings_styles["avatar-upload-block"]}>
          <img
            src={`${api.API_BASE_URL}/${userInfo.avatar}`}
            className={settings_styles["avatar-preview"]}
          />
          <div className={settings_styles["upload-controls"]}>
            <span className={settings_styles["setting-title"]}>
              Фото профиля
            </span>
            <span className={settings_styles["setting-desc"]}>
              Рекомендуется SVG, PNG или JPG не менее 400x400px
            </span>
            <div className={settings_styles["upload-buttons"]}>
              <label
                className={`${settings_styles["btn"]} ${settings_styles["btn-secondary"]} ${settings_styles["btn-sm"]}`}
              >
                Выбрать файл
                <input type="file" style={{ display: "none" }} />
              </label>
              <button
                className={`${settings_styles["btn"]} ${settings_styles["btn-text-danger"]} ${settings_styles["btn-sm"]}`}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>

        <div className={settings_styles["grid-form"]}>
          {/* <div className={settings_styles["input-group"]}>
            <label>Имя пользователя</label>
            <input type="text" placeholder="@username" />
          </div>
          <div className={settings_styles["input-group"]}>
            <label>Email</label>
            <input type="email" placeholder="email@domain.com" />
          </div>
          <div className={settings_styles["input-group"]}>
            <label>Номер телефона</label>
            <input type="tel" placeholder="+7..." />
          </div> */}
          <div
            className={`${settings_styles["input-group"]} ${settings_styles["full-width"]}`}
          >
            <label>О себе</label>
            <textarea
              rows={3}
              placeholder="Расскажите немного о себе..."
            ></textarea>
          </div>
        </div>
      </section>
    </>
  );
};