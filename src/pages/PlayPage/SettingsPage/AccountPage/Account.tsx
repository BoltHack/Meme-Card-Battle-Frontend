import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

export const AccountPage = () => {
  return (
    <>
      <header className={settings_styles["content-header"]}>
        <h1>Настройки аккаунта</h1>
        <p>Управляйте аккаунтом и её безопасностью</p>
      </header>

      <section className={settings_styles["settings-section"]}>
        <h2>Аккаунт</h2>

        <div
          className={`${settings_styles["setting-row"]} ${settings_styles["mt-20"]}`}
        >
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Смена пароля
            </span>
            <span className={settings_styles["setting-desc"]}>
              Поменяйте ваш текущий пароль от аккаунта, если прошлый показался
              вам небезопасным
            </span>
          </div>
          <button
            className={`${settings_styles["btn"]} ${settings_styles["btn-secondary"]}`}
          >
            Изменить
          </button>
        </div>

        <div
          className={`${settings_styles["setting-row"]} ${settings_styles["mt-20"]}`}
        >
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Выйти со всех устройств
            </span>
            <span className={settings_styles["setting-desc"]}>
              Завершить все активные сеансы на других устройствах, кроме
              текущего. Для входа потребуется заново ввести пароль.
            </span>
          </div>
          <button
            className={`${settings_styles["btn"]} ${settings_styles["btn-secondary"]}`}
          >
            Выйти
          </button>
        </div>
      </section>

      <section
        className={`${settings_styles["settings-section"]} ${settings_styles["bottom-section"]}`}
      >
        <h2>Безопасность</h2>
        {/* <div className={settings_styles["grid-form"]}>
          <div className={settings_styles["input-group"]}>
            <label>Текущий пароль</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <div className={settings_styles["input-group"]}>
            <label>Новый пароль</label>
            <input type="password" placeholder="Минимум 8 символов" />
          </div>
        </div> */}

        <div
          className={`${settings_styles["setting-row"]} ${settings_styles["mt-20"]}`}
        >
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Двухфакторная аутентификация (2FA)
            </span>
            <span className={settings_styles["setting-desc"]}>
              Защитите аккаунт одноразовыми кодами из приложения вроде Google
              Authenticator
            </span>
          </div>
          <button
            className={`${settings_styles["btn"]} ${settings_styles["btn-secondary"]}`}
          >
            Подключить
          </button>
        </div>
      </section>

      <section
        className={`${settings_styles["settings-section"]} ${settings_styles["border-danger"]} ${settings_styles["bottom-section"]}`}
      >
        <h2 className={settings_styles["text-danger"]}>Опасная зона</h2>
        <div className={settings_styles["setting-row"]}>
          <div className={settings_styles["setting-info"]}>
            <span className={settings_styles["setting-title"]}>
              Удаление учетной записи
            </span>
            <span className={settings_styles["setting-desc"]}>
              После удаления вашего аккаунта все данные будут безвозвратно
              стерты. Действие нельзя отменить.
            </span>
          </div>
          <button
            className={`${settings_styles["btn"]} ${settings_styles["btn-danger"]}`}
          >
            Удалить аккаунт
          </button>
        </div>
      </section>
    </>
  );
};
