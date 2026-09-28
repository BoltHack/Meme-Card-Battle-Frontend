// import { useEffect, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

// import api from "../../../api/api.ts";
// import usePageRender from "../../../tools/PageRender.ts";
// import { LoadingPage } from "../../LoadingPage/Loading.tsx";
// import { ErrorPage } from "../../ErrorPage/Error.tsx";

// import { settingsNavigator } from "../SettingsPanel/SettingsPanel.tsx";

export const AccountPage = () => {
  //   const [userInfo, setUserInfo] = useState({
  //     name: "",
  //     avatar: "",
  //     role: "",
  //   });

  //   const { data, loading, error } = usePageRender(
  //     `${api.API_BASE_URL}/api/settings/profile`,
  //   );

  //   useEffect(() => {
  //     if (!data || !data.renderData) {
  //       console.log(
  //         "Данные еще не загрузились или структура не совпадает:",
  //         data,
  //       );
  //       return;
  //     }

  //     setUserInfo({
  //       name: data.renderData.name,
  //       avatar: data.renderData.avatar,
  //       role: data.renderData.role,
  //     });

  //     console.log("data", data);
  //   }, [data]);

  //   if (loading || !data) return <LoadingPage />;
  //   if (error) return <ErrorPage error={error} />;

  return (
    <>
      <header className={settings_styles["content-header"]}>
        <h1>Настройки аккаунта</h1>
        <p>Управляйте аккаунтом и её безопасностью</p>
      </header>

      <section className={settings_styles["settings-section"]}>
        <h2>Безопасность</h2>
        <div className={settings_styles["grid-form"]}>
          <div className={settings_styles["input-group"]}>
            <label>Текущий пароль</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className={settings_styles["input-group"]}>
            <label>Новый пароль</label>
            <input type="password" placeholder="Минимум 8 символов" />
          </div>
        </div>

        <div
          className={`${settings_styles["setting-row"]} ${settings_styles["mt-20"]}`}
        >
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Двухфакторная аутентификация (2FA)
            </span>
            <span className={settings_styles["setting-desc"]}>
              Защитите аккаунт одноразовыми кодами из приложения вроде Google
              Authenticator
            </span>
          </div>
          <button
            className={`${settings_styles["btn"]} ${settings_styles["btn-secondary"]}`}
          >
            Подключить
          </button>
        </div>
      </section>

      <section
        className={`${settings_styles["settings-section"]} ${settings_styles["border-danger"]}`}
      >
        <h2 className={settings_styles["text-danger"]}>Опасная зона</h2>
        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Удаление учетной записи
            </span>
            <span className={settings_styles["setting-desc"]}>
              После удаления вашего аккаунта все данные будут безвозвратно
              стерты. Действие нельзя отменить.
            </span>
          </div>
          <button
            className={`${settings_styles["btn"]} ${settings_styles["btn-danger"]}`}
          >
            Удалить аккаунт
          </button>
        </div>
      </section>
    </>
  );
};
