import { ChangeEvent, useEffect, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import usePageRender from "../../../../tools/PageRender.ts";
import { ContentLoading } from "../../../LoadingPage/ContentLoading.tsx";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import toast from "react-hot-toast";

// import { settingsNavigator } from "../SettingsPanel/SettingsPanel.tsx";

export const GraphicsPage = () => {
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [settingsList, setSettingsList] = useState({
    effects: true,
    particles: true,
    // marketing_and_functions: settings.marketing_and_functions ?? false,
  });

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/play/settings/graphics`,
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
      graphics: {
        effects: settingsList.effects,
        particles: settingsList.particles,
      },
    };
    localStorage.setItem("settings", JSON.stringify(updateSettings));

    toast.success("Настройки успешно изменены.");
  };

  useEffect(() => {
    if (!data) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setSettingsList({
      effects: settings?.graphics?.effects ?? true,
      particles: settings?.graphics?.particles ?? true,
    });
  }, [data]);

  if (loading || !data) return <ContentLoading />;
  if (error) return <ErrorPage error={error} />;

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
