import { useEffect, useState } from "react";

import styles from "./Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../../../components/LoadingPage/Loading.tsx";

import { ProfilePage } from "../ProfilePage/Profile.tsx";
import { GraphicsPage } from "../GraphicsPage/Graphics.tsx";
import { NotificationsPage } from "../NotificationsPage/Notifications.tsx";
import { AccountPage } from "../AccountPage/Account.tsx";
import { SoundsPage } from "../SoundsPage/Sounds.tsx";

const Settings = [
  "settings:profile",
  "settings:graphics",
  "settings:notifications",
  "settings:sounds",
  "settings:account",
];

export const settingsNavigator = {
  handleChangeTab: (tab: string) => {},
};

import { playFunctions } from "../../Play/Play.tsx";
import { SoundFunctions } from "../../../../tools/global_scripts/SoundsPlayer.tsx";

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<string>(Settings[0]);

  const [userInfo, setUserInfo] = useState({
    name: "",
    avatar: "",
    createdAt: "",
  });

  const { contentData, contentLoading, contentError } =
    useContentRender(`/play/settings`);

  const getRegisterDate = (date: string) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour12: false,
    });
  };

  useEffect(() => {
    settingsNavigator.handleChangeTab = (tab: string) => {
      setActiveTab((prevTab) => {
        console.log("Предыдущая вкладка:", prevTab);
        console.log("Новая вкладка:", tab);

        return tab;
      });
    };

    return () => {
      settingsNavigator.handleChangeTab = () => {};
    };
  }, [activeTab]);

  const handleSetActiveTab = (tab: string) => {
    if (tab === activeTab) return;
<<<<<<< HEAD
    SoundFunctions.fixedVolumeSound("play", "value_change", 0.2);
=======
>>>>>>> 996dd570801d7fd2bf77e32b23521e67dd0877f7
    SoundFunctions.PlaySound_Play("btn_click");
    setActiveTab(tab);
  };

  useEffect(() => {
    // if (!data || !Array.isArray(data.renderData)) {
    if (!contentData || !contentData.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    playFunctions.handleChangeHeaderState(true);

    setUserInfo({
      name: contentData.renderData.name,
      avatar: contentData.renderData.avatar,
      createdAt: contentData.renderData.createdAt,
    });

    console.log("contentData", contentData);
  }, [contentData]);

  if (contentLoading || !contentData) return <LoadingPage />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <>
      <div className={styles["play-container"]}>
        <aside className={styles["sidebar"]}>
          <div className={styles["profile-section"]}>
            {/* <div className={styles["avatar"]}></div> */}
            {userInfo.avatar !== "" ? (
              <img src={`/${userInfo.avatar}`} className={styles["avatar"]} />
            ) : (
              <div className={styles["avatar"]}></div>
            )}

            <div className={styles["profile-info"]}>
              <h3>{userInfo.name}</h3>
              <p>{getRegisterDate(userInfo.createdAt)}</p>
            </div>
          </div>
          <nav className={styles["menu"]}>
            <a
              className={`${styles["menu-item"]} ${activeTab === Settings[0] && styles["active"]}`}
              onClick={() => handleSetActiveTab(Settings[0])}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Профиль
            </a>
            <a
              className={`${styles["menu-item"]} ${activeTab === Settings[1] && styles["active"]}`}
              onClick={() => handleSetActiveTab(Settings[1])}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-camera-icon lucide-camera"
              >
                <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              Графика
            </a>
            {/* <a
              className={`${styles["menu-item"]} ${activeTab === Settings[2] && styles["active"]}`}
              onClick={() => setActiveTab(Settings[2])}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Безопасность
            </a> */}
            <a
              className={`${styles["menu-item"]} ${activeTab === Settings[2] && styles["active"]}`}
              onClick={() => handleSetActiveTab(Settings[2])}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Уведомления
            </a>
            <a
              className={`${styles["menu-item"]} ${activeTab === Settings[3] && styles["active"]}`}
              onClick={() => handleSetActiveTab(Settings[3])}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-volume-2 preview-icon"
              >
                <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                <path d="M16 9a5 5 0 0 1 0 6" />
                <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
              </svg>
              Звук
            </a>
            <a
              className={`${styles["menu-item"]} ${activeTab === Settings[4] && styles["active"]}`}
              onClick={() => handleSetActiveTab(Settings[4])}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              Аккаунт
            </a>
          </nav>
        </aside>

        <main className={styles["settings-content"]}>
          {activeTab === Settings[0] && <ProfilePage />}
          {activeTab === Settings[1] && <GraphicsPage />}
          {activeTab === Settings[2] && <NotificationsPage />}
          {activeTab === Settings[3] && <SoundsPage />}
          {activeTab === Settings[4] && <AccountPage />}
          {/* <header className={styles["content-header"]}>
          <h1>Настройки профиля</h1>
          <p>
            Управляйте данными вашей учетной записи, безопасностью и внешним
            видом
          </p>
        </header>

        <section className={styles["settings-section"]}>
          <h2>Личная информация</h2>

          <div className={styles["avatar-upload-block"]}>
            <img
              src={`/${userInfo.avatar}`}
              className={styles["avatar-preview"]}
            />
            <div className={styles["upload-controls"]}>
              <span className={styles["setting-title"]}>Фото профиля</span>
              <span className={styles["setting-desc"]}>
                Рекомендуется SVG, PNG или JPG не менее 400x400px
              </span>
              <div className={styles["upload-buttons"]}>
                <label
                  className={`${styles["btn"]} ${styles["btn-secondary"]} ${styles["btn-sm"]}`}
                >
                  Выбрать файл
                  <input type="file" style={{ display: "none" }} />
                </label>
                <button
                  className={`${styles["btn"]} ${styles["btn-text-danger"]} ${styles["btn-sm"]}`}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>

          <div className={styles["grid-form"]}>
            <div className={styles["input-group"]}>
              <label>Имя пользователя</label>
              <input type="text" value="Alex_Neon" placeholder="@username" />
            </div>
            <div className={styles["input-group"]}>
              <label>Email</label>
              <input
                type="email"
                value="alex@example.com"
                placeholder="email@domain.com"
              />
            </div>
            <div className={styles["input-group"]}>
              <label>Номер телефона</label>
              <input
                type="tel"
                value="+7 (999) 123-45-67"
                placeholder="+7..."
              />
            </div>
            <div className={`${styles["input-group"]} ${styles["full-width"]}`}>
              <label>О себе</label>
              <textarea
                rows={3}
                placeholder="Расскажите немного о себе..."
              ></textarea>
            </div>
          </div>
        </section>

        <section className={styles["settings-section"]}>
          <h2>Безопасность</h2>
          <div className={styles["grid-form"]}>
            <div className={styles["input-group"]}>
              <label>Текущий пароль</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className={styles["input-group"]}>
              <label>Новый пароль</label>
              <input type="password" placeholder="Минимум 8 символов" />
            </div>
          </div>

          <div className={`${styles["setting-row"]} ${styles["mt-20"]}`}>
            <div className={styles["setting-info"]}>
              <span className={styles["setting-title"]}>
                Двухфакторная аутентификация (2FA)
              </span>
              <span className={styles["setting-desc"]}>
                Защитите аккаунт одноразовыми кодами из приложения вроде Google
                Authenticator
              </span>
            </div>
            <button className={`${styles["btn"]} ${styles["btn-secondary"]}`}>
              Подключить
            </button>
          </div>
        </section>

        <section className={styles["settings-section"]}>
          <h2>Уведомления</h2>

          <div className={styles["setting-row"]}>
            <div className={styles["setting-info"]}>
              <span className={styles["setting-title"]}>
                В push-уведомления в браузере
              </span>
              <span className={styles["setting-desc"]}>
                Получать важные системные алерты в реальном времени
              </span>
            </div>
            <label className={styles["toggle-switch"]}>
              <input type="checkbox" checked />
              <span className={styles["slider"]}></span>
            </label>
          </div>

          <div className={styles["setting-row"]}>
            <div className={styles["setting-info"]}>
              <span className={styles["setting-title"]}>
                Еженедельный дайджест
              </span>
              <span className={styles["setting-desc"]}>
                Отчет об активности аккаунта за неделю на ваш Email
              </span>
            </div>
            <label className={styles["toggle-switch"]}>
              <input type="checkbox" />
              <span className={styles["slider"]}></span>
            </label>
          </div>

          <div className={styles["setting-row"]}>
            <div className={styles["setting-info"]}>
              <span className={styles["setting-title"]}>
                Маркетинговые рассылки
              </span>
              <span className={styles["setting-desc"]}>
                Информация о новых функциях аккаунта и скидках
              </span>
            </div>
            <label className={styles["toggle-switch"]}>
              <input type="checkbox" />
              <span className={styles["slider"]}></span>
            </label>
          </div>
        </section> */}
          {/* <footer className={styles["content-footer"]}>
            <button className={`${styles["btn"]} ${styles["btn-secondary"]}`}>
              Сбросить
            </button>
            <button className={`${styles["btn"]} ${styles["btn-primary"]}`}>
              Сохранить изменения
            </button>
          </footer> */}
        </main>
      </div>
    </>
  );
};
