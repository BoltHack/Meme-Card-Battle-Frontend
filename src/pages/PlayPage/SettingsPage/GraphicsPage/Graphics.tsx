import { ChangeEvent, useEffect, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

export const GraphicsPage = () => {
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [settingsList, setSettingsList] = useState({
    effects: true,
    particles: true,
  });

  const { contentLoading, contentError } = useContentRender(
    `/play/settings/graphics`,
  );

  const handleCheckBoxCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettingsList((prev) => ({
      ...prev,
      [name]: checked,
    }));

    const updateSettings = {
      ...settings,
      graphics: {
        ...settings.graphics,
        [name]: checked,
      },
    };
    localStorage.setItem("settings", JSON.stringify(updateSettings));
  };

  useEffect(() => {
    if (!settings.graphics) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        settings.graphics,
      );
      return;
    }

    setSettingsList({
      effects: settings?.graphics?.effects ?? true,
      particles: settings?.graphics?.particles ?? true,
    });
  }, []);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

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
        <h2>Графика</h2>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>Эффекты</span>
            <span className={settings_styles["setting-desc"]}>
              Отображение эффектов в главном меню и в игре
            </span>
          </div>
          <label className={settings_styles["toggle-switch"]}>
            <input
              type="checkbox"
              name="effects"
              checked={settingsList.effects}
              onChange={handleCheckBoxCheck}
            />
            <span className={settings_styles["slider"]}></span>
          </label>
        </div>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>Частицы</span>
            <span className={settings_styles["setting-desc"]}>
              Отображение частиц в главном меню и в игре
            </span>
          </div>
          <label className={settings_styles["toggle-switch"]}>
            <input
              type="checkbox"
              name="particles"
              checked={settingsList.particles}
              onChange={handleCheckBoxCheck}
            />
            <span className={settings_styles["slider"]}></span>
          </label>
        </div>
      </section>

      {/* <footer className={settings_styles["content-footer"]}>
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
      </footer> */}
    </>
  );
};
