import { ChangeEvent, useEffect, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import usePageRender from "../../../../tools/PageRender.ts";
import { DefaultLoading } from "../../../LoadingPage/DefaultLoading.tsx";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import toast from "react-hot-toast";

export const NotificationsPage = () => {
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [notifications, setNotifications] = useState({
    push: settings.push ?? false,
    marketing_and_functions: settings.marketing_and_functions ?? false,
  });

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/api/settings/notifications`,
  );

  const handleCheckBoxCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const updateSettings = {
      ...settings,
      push: notifications.push,
      marketing_and_functions: notifications.marketing_and_functions,
    };
    localStorage.setItem("settings", JSON.stringify(updateSettings));

    toast.success("Настройки успешно изменены.");
  };

  useEffect(() => {
    if (!data || !settings || !settings.notifications) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setNotifications({
      push: settings?.notifications?.push ?? false,
      marketing_and_functions:
        settings?.notifications?.marketing_and_functions ?? false,
    });
  }, [data, settings]);

  if (loading || !settings) return <DefaultLoading />;
  if (error) return <ErrorPage error={error} />;

  return (
    <>
      <header className={settings_styles["content-header"]}>
        <h1>Настройки уведомлений</h1>
        <p>Управляйте push-уведомлениями</p>
      </header>

      <section className={settings_styles["settings-section"]}>
        <h2>Уведомления</h2>

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
            <input
              type="checkbox"
              name="push"
              checked={notifications.push}
              onChange={handleCheckBoxCheck}
            />
            <span className={settings_styles["slider"]}></span>
          </label>
        </div>

        {/* <div className={settings_styles["setting-row"]}>
            <div className={settings_styles["setting-info"]}>
              <span className={settings_styles["setting-title"]}>
                Новости
              </span>
              <span className={settings_styles["setting-desc"]}>
                Отправлять увидомления о новостях на ваш Email
              </span>
            </div>
            <label className={settings_styles["toggle-switch"]}>
              <input type="checkbox" />
              <span className={settings_styles["slider"]}></span>
            </label>
          </div> */}

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
            <input
              type="checkbox"
              name="marketing_and_functions"
              checked={notifications.marketing_and_functions}
              onChange={handleCheckBoxCheck}
            />
            <span className={settings_styles["slider"]}></span>
          </label>
        </div>
      </section>

      <footer className={settings_styles["content-footer"]}>
        <button
          className={`${settings_styles["btn"]} ${settings_styles["btn-secondary"]}`}
        >
          Сбросить
        </button>
        <button
          className={`${settings_styles["btn"]} ${settings_styles["btn-primary"]}`}
          onClick={handleSubmit}
        >
          Сохранить изменения
        </button>
      </footer>
    </>
  );
};
