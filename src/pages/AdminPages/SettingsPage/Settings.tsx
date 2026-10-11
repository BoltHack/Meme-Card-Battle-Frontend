import { useEffect, useState } from "react";

import styles from "../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import toast from "react-hot-toast";

import useContentRender from "../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../сomponents/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../сomponents/LoadingPage/ContentLoading.tsx";

interface AppSettings {
  maintenanceMode: boolean;
  require2FA: boolean;
}

export const SettingsPage = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const { contentData, contentLoading, contentError } = useContentRender(
    `${api.API_BASE_URL}/admin/settings`,
  );

  const handleToggle = async (dataToChange: keyof AppSettings) => {
    if (!settings) return;

    const previousSettings = { ...settings };
    const newValue = !settings[dataToChange];

    console.log("newValue", newValue);
    console.log("previousSettings", previousSettings);

    setSettings((prevState) => {
      if (!prevState) return null;
      return {
        ...prevState,
        [dataToChange]: newValue,
      };
    });

    const dataToSend = new FormData();

    dataToSend.append(dataToChange, String(newValue));

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/settings/change`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Данные успешно добавлены:", response.data);
      // await fetch(`${api.API_BASE_URL}/admin/settings`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(updatedSettings),
      // });
      toast.success(response.data.success || "Настройки обновлены");

      return response.data;
    } catch (error) {
      console.error("error", error);
      // setSettings(settings);
    }
  };

  useEffect(() => {
    if (contentData && contentData?.renderData) {
      setSettings(contentData?.renderData);
      console.log("contentData", contentData?.renderData);
    }
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div id="settings-page" className={`${styles["page"]} ${styles["active"]}`}>
      <header className={styles["header"]}>
        <h1>Глобальные настройки</h1>
        <p>Управление поведением платформы и безопасностью данных.</p>
      </header>
      <div className={styles["settings-box"]}>
        <div className={styles["settings-row"]}>
          <div className={styles["settings-text"]}>
            <h3>Технический режим (Maintenance Mode)</h3>
            <p>Закрывает доступ к сайту для обычных пользователей.</p>
          </div>
          <label className={styles["switch-toggle"]}>
            <input
              type="checkbox"
              checked={settings?.maintenanceMode ? true : false}
              onChange={() => handleToggle("maintenanceMode")}
            />
            <span className={styles["slider"]}></span>
          </label>
        </div>
        <div className={styles["settings-row"]}>
          <div className={styles["settings-text"]}>
            <h3>Двухфакторная аутентификация (2FA)</h3>
            <p>Требовать одноразовый код от всех модераторов при входе.</p>
          </div>
          <label className={styles["switch-toggle"]}>
            <input
              type="checkbox"
              checked={settings?.require2FA ? true : false}
              onChange={() => handleToggle("require2FA")}
            />
            <span className={styles["slider"]}></span>
          </label>
        </div>
      </div>
    </div>
  );
};
