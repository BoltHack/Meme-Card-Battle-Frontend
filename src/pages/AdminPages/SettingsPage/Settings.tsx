import { useEffect, useState } from "react";

import styles from "../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import toast from "react-hot-toast";

import useContentRender from "../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../components/LoadingPage/ContentLoading.tsx";

interface AppSettings {
  maintenanceMode: boolean;
  configLogger: boolean;
}

export const SettingsPage = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const { contentData, contentLoading, contentError } =
    useContentRender(`/admin/settings`);

  const handleToggle = async (dataToChange: keyof AppSettings) => {
    if (!settings) return;

    const newValue = !settings[dataToChange];

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
      const response = await axios.post(`/admin/settings/change`, dataToSend, {
        withCredentials: true,
      });

      console.log("Данные успешно добавлены:", response.data);
      // await fetch(`/admin/settings`, {
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
            <h3>Логи системы (Logger mode)</h3>
            <p>Собирать логи о состоянии сервера и его функций.</p>
          </div>
          <label className={styles["switch-toggle"]}>
            <input
              type="checkbox"
              checked={settings?.configLogger ? true : false}
              onChange={() => handleToggle("configLogger")}
            />
            <span className={styles["slider"]}></span>
          </label>
        </div>
      </div>
    </div>
  );
};
