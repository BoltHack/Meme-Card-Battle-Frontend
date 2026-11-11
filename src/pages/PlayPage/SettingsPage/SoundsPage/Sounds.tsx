import { ChangeEvent, useEffect, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

import { SoundFunctions } from "../../../../tools/global_scripts/SoundsPlayer.tsx";

export const SoundsPage = () => {
  const settings = JSON.parse(localStorage.getItem("settings") || "{}");

  const [settingsList, setSettingsList] = useState({
    game_background_music_volume: 100,
    interface_volume: 100,
    game_effects_volume: 100,
    notifications_volume: 100,
  });

  const { contentLoading, contentError } = useContentRender(
    `/play/settings/sounds`,
  );

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    SoundFunctions.fixedVolumeSound("play", "volume_change", 0.1);

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
    window.dispatchEvent(new Event("local-storage-volume-update"));
  };

  useEffect(() => {
    if (!settings.sounds) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        settings.sounds,
      );
      return;
    }

    const game_background_music = settings.sounds.game_background_music_volume;
    const all_interface = settings.sounds.interface_volume;
    const game_effects = settings.sounds.game_effects_volume;
    const notifications = settings.sounds.notifications_volume;

    setSettingsList({
      game_background_music_volume:
        game_background_music === 0 ? 0 : game_background_music * 100 || 100,
      interface_volume: all_interface === 0 ? 0 : all_interface * 100 || 100,
      game_effects_volume: game_effects === 0 ? 0 : game_effects * 100 || 100,
      notifications_volume:
        notifications === 0 ? 0 : notifications * 100 || 100,
    });
  }, []);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <>
      <header className={settings_styles["content-header"]}>
        <h1>Настройки звука</h1>
        <p>Управляйте громкостью музыки, эффектов игры и многим другим.</p>
      </header>

      <section className={settings_styles["settings-section"]}>
        <h2>Звук</h2>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Громкость фоновой музыки в бою
            </span>

            <div className={settings_styles["toggle-volume"]}>
              <input
                type="range"
                name="game_background_music_volume"
                min="0"
                max="100"
                step="1"
                value={settingsList.game_background_music_volume}
                onChange={handleRangeChange}
              />
              <span>
                ({Math.round(settingsList.game_background_music_volume)}%)
              </span>
            </div>
          </div>
        </div>

        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Громкость интерфейса
            </span>

            <div className={settings_styles["toggle-volume"]}>
              <input
                type="range"
                name="interface_volume"
                min="0"
                max="100"
                step="1"
                value={settingsList.interface_volume}
                onChange={handleRangeChange}
              />
              <span>({Math.round(settingsList.interface_volume)}%)</span>
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
