import { ChangeEvent, useEffect, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import useContentRender from "../../../../tools/ContentRender.ts";
import { ContentLoading } from "../../../LoadingPage/ContentLoading.tsx";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import toast from "react-hot-toast";

export const NotificationsPage = () => {
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [settingsList, setSettingsList] = useState({
    push: true,
    marketing_and_functions:
      true,
  });

  const { contentLoading, contentError } = useContentRender(
    `${api.API_BASE_URL}/play/settings/notifications`,
  );

  const handleCheckBoxCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettingsList((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const updateSettings = {
      ...settings,
      notifications: {
        push: settingsList.push,
        marketing_and_functions: settingsList.marketing_and_functions,
      },
    };
    localStorage.setItem("settings", JSON.stringify(updateSettings));

    toast.success("Настройки успешно изменены.");
  };

  useEffect(() => {
    if (!settings.notifications) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        settings.notifications,
      );
      return;
    }

    setSettingsList({
      push: settings?.notifications?.push ?? true,
      marketing_and_functions:
        settings?.notifications?.marketing_and_functions ?? true,
    });
  }, []);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

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
              Push-уведомления в браузере
            </span>
            <span className={settings_styles["setting-desc"]}>
              Получать важные системные алерты в реальном времени
            </span>
          </div>
          <label className={settings_styles["toggle-switch"]}>
            <input
              type="checkbox"
              name="push"
              checked={settingsList.push}
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
              checked={settingsList.marketing_and_functions}
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
