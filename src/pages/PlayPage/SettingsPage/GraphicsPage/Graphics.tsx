// import { useEffect, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

// import api from "../../../api/api.ts";
// import usePageRender from "../../../tools/PageRender.ts";
// import { LoadingPage } from "../../LoadingPage/Loading.tsx";
// import { ErrorPage } from "../../ErrorPage/Error.tsx";

// import { settingsNavigator } from "../SettingsPanel/SettingsPanel.tsx";

export const GraphicsPage = () => {
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
        <h1>Настройки графики</h1>
        <p>
          Управляйте производительностью, эффектами и частицами для комфортной
          игры.
        </p>
      </header>

      <section className={settings_styles["settings-section"]}>
        <h2>Эффекты</h2>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              В push-уведомления в браузере
            </span>
            <span className={settings_styles["setting-desc"]}>
              Получать важные системные алерты в реальном времени
            </span>
          </div>
          <label className={settings_styles["toggle-switch"]}>
            <input type="checkbox" />
            <span className={settings_styles["slider"]}></span>
          </label>
        </div>
        <br/>
        <h2>Частицы</h2>
        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Еженедельный дайджест
            </span>
            <span className={settings_styles["setting-desc"]}>
              Отчет об активности аккаунта за неделю на ваш Email
            </span>
          </div>
          <label className={settings_styles["toggle-switch"]}>
            <input type="checkbox" />
            <span className={settings_styles["slider"]}></span>
          </label>
        </div>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Маркетинговые рассылки
            </span>
            <span className={settings_styles["setting-desc"]}>
              Информация о новых функциях аккаунта и скидках
            </span>
          </div>
          <label className={settings_styles["toggle-switch"]}>
            <input type="checkbox" />
            <span className={settings_styles["slider"]}></span>
          </label>
        </div>
      </section>
    </>
  );
};
