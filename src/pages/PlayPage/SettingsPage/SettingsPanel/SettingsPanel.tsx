import { useEffect, useState } from "react";

import styles from "./Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import usePageRender from "../../../../tools/PageRender.ts";
import { LoadingPage } from "../../../LoadingPage/Loading.tsx";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";

import { ProfilePage } from "../ProfilePage/Profile.tsx";
import { GraphicsPage } from "../GraphicsPage/Graphics.tsx";
import { SafetyPage } from "../SafetyPage/Safety.tsx";

const Settings = ["settings:profile", "settings:graphics", "settings:safety"];

export const settingsNavigator = {
  handleChangeTab: (tab: string) => {},
};

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<string>(Settings[0]);

  const [userInfo, setUserInfo] = useState({
    name: "",
    avatar: "",
    role: "",
  });

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/api/settings/profile`,
  );

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

  useEffect(() => {
    // if (!data || !Array.isArray(data.renderData)) {
    if (!data || !data.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setUserInfo({
      name: data.renderData.name,
      avatar: data.renderData.avatar,
      role: data.renderData.role,
    });

    console.log("data", data);
  }, [data]);

  if (loading || !data) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <>
      <div className={styles["settings-body"]}>
        <aside className={styles["sidebar"]}>
          <div className={styles["profile-section"]}>
            {/* <div className={styles["avatar"]}></div> */}
            <img
              src={`${api.API_BASE_URL}/${userInfo.avatar}`}
              className={styles["avatar"]}
            />
            <div className={styles["profile-info"]}>
              <h3>{userInfo.name}</h3>
              <p>{userInfo.role}</p>
            </div>
          </div>
          <nav className={styles["menu"]}>
            <a
              className={`${styles["menu-item"]} ${activeTab === Settings[0] && styles["active"]}`}
              onClick={() => setActiveTab(Settings[0])}
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
              onClick={() => setActiveTab(Settings[1])}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
            <a
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
            </a>
            <a className={styles["menu-item"]}>
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
            <a className={styles["menu-item"]}>
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
              Интеграции
            </a>
          </nav>
        </aside>

        <main className={styles["settings-content"]}>
          {activeTab === Settings[0] && <ProfilePage />}
          {activeTab === Settings[1] && <GraphicsPage />}
          {activeTab === Settings[2] && <SafetyPage />}
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
              src={`${api.API_BASE_URL}/${userInfo.avatar}`}
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
        </main>
      </div>
    </>
  );
};
