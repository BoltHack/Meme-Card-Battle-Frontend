import { ChangeEvent, useEffect, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import useContentRender from "../../../../tools/ContentRender.ts";
import { ContentLoading } from "../../../LoadingPage/ContentLoading.tsx";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";

// import toast from "react-hot-toast";

export const SoundsPage = () => {
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [settingsList, setSettingsList] = useState({
    all_volume: 1,
    background_music_volume: 1,
    game_effects_volume: 1,
    notifications_volume: 1,
  });

  const { contentLoading, contentError } = useContentRender(
    `${api.API_BASE_URL}/play/settings/sounds`,
  );

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettingsList((prev) => ({
      ...prev,
      [name]: Number(value),
    }));

    const updateSettings = {
      ...settings,
      sounds: {
        ...settings.sounds,
        [name]: Number(value) / 100,
      },
    };
    localStorage.setItem("settings", JSON.stringify(updateSettings));
  };

  useEffect(() => {
    if (!settings.sounds) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        settings.sounds,
      );
      return;
    }

    const all = settings.sounds.all_volume * 100;
    const background_music = settings.sounds.background_music_volume * 100;
    const game_effects = settings.sounds.game_effects_volume * 100;
    const sotifications = settings.sounds.notifications_volume * 100;

    setSettingsList({
      all_volume: all,
      background_music_volume: background_music,
      game_effects_volume: game_effects,
      notifications_volume: sotifications,
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
        <h2>Звук</h2>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Общая громкость
            </span>

            <div className={settings_styles["toggle-volume"]}>
              <input
                type="range"
                name="all_volume"
                min="0"
                max="100"
                step="1"
                value={settingsList.all_volume}
                onChange={handleRangeChange}
              />
              <span>({Math.round(settingsList.all_volume)}%)</span>
            </div>
          </div>
        </div>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Громкость фоновой музыки
            </span>

            <div className={settings_styles["toggle-volume"]}>
              <input
                type="range"
                name="background_music_volume"
                min="0"
                max="100"
                step="1"
                value={settingsList.background_music_volume}
                onChange={handleRangeChange}
              />
              <span>({Math.round(settingsList.background_music_volume)}%)</span>
            </div>
          </div>
        </div>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Громкость эффектов в бою
            </span>

            <div className={settings_styles["toggle-volume"]}>
              <input
                type="range"
                name="game_effects_volume"
                min="0"
                max="100"
                step="1"
                value={settingsList.game_effects_volume}
                onChange={handleRangeChange}
              />
              <span>({Math.round(settingsList.game_effects_volume)}%)</span>
            </div>
          </div>
        </div>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Громкость уведомлений
            </span>

            <div className={settings_styles["toggle-volume"]}>
              <input
                type="range"
                name="notifications_volume"
                min="0"
                max="100"
                step="1"
                value={settingsList.notifications_volume}
                onChange={handleRangeChange}
              />
              <span>({Math.round(settingsList.notifications_volume)}%)</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
