import { ChangeEvent, useRef, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import toast from "react-hot-toast";

import { playFunctions } from "../../Play/Play";

export const AccountPage = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [menuType, setMenuType] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState<boolean | false>(false);
  const [isLoading, setIsLoading] = useState<boolean | false>(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsClosing(true);

    timeoutRef.current = window.setTimeout(() => {
      setMenuType(null);
      setIsClosing(false);
    }, 200);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSend = new FormData();

    dataToSend.append("old_password", formData.old_password);
    dataToSend.append("new_password", formData.new_password);
    dataToSend.append("confirm_password", formData.confirm_password);

    try {
      const response = await axios.post("/auth/change-password", dataToSend, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success(response.data.success);
        setMenuType(null);
        setIsLoading(false);
      }

      return response.data;
    } catch (error: any) {
      setIsLoading(false);
      console.log("error", error);
      const errorMessage = error.response.data.error;
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };
  
  const handleSubmit_LeaveAllAccounts = async (
    e: ChangeEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/auth/logout-all-accounts", {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success(response.data.success);
        setMenuType(null);
        setIsLoading(false);
        playFunctions.logout(e);
      }

      return response.data;
    } catch (error: any) {
      setIsLoading(false);
      console.log("error", error);
      const errorMessage = error.response.data.error;
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };

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
            onClick={() => setMenuType("changepassword")}
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
            onClick={() => setMenuType("logoutallaccounts")}
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
            onClick={() => setMenuType("deleteaccount")}
          >
            Удалить аккаунт
          </button>
        </div>
      </section>

      {menuType === "changepassword" && (
        <div className={settings_styles["menu-wrapper"]}>
          <div className={settings_styles["bg-glow"]}></div>
          <div
            className={`${settings_styles["menu-card"]} ${isClosing ? settings_styles["closing"] : ""}`}
          >
            <span
              className={settings_styles["close-menu-btn"]}
              onClick={closeMenu}
            >
              <div className={settings_styles["close-menu-svg"]}>
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
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
            </span>
            <div className={settings_styles["menu-info"]}>
              <h2>Обновить пароль</h2>
              <p>Введите текущий и новый пароли.</p>
            </div>
            <div className={settings_styles["menu-form"]}>
              <div className={settings_styles["form-group"]}>
                <label
                  className={settings_styles["form-label"]}
                  htmlFor="old_password"
                >
                  Текущий пароль
                </label>
                <input
                  type="password"
                  name="old_password"
                  id="old_password"
                  onChange={handleChange}
                  value={formData.old_password}
                  className={settings_styles["form-input"]}
                  placeholder="Заполните поле"
                  required
                />
              </div>

              <div className={settings_styles["form-group"]}>
                <label
                  className={settings_styles["form-label"]}
                  htmlFor="new_password"
                >
                  Новый пароль
                </label>
                <input
                  type="password"
                  name="new_password"
                  id="new_password"
                  onChange={handleChange}
                  value={formData.new_password}
                  className={settings_styles["form-input"]}
                  placeholder="Заполните поле"
                  required
                />
              </div>

              <div className={settings_styles["form-group"]}>
                <label
                  className={settings_styles["form-label"]}
                  htmlFor="confirm_password"
                >
                  Подтвержение нового пароля
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  id="confirm_password"
                  onChange={handleChange}
                  value={formData.confirm_password}
                  className={settings_styles["form-input"]}
                  placeholder="Заполните поле"
                  required
                />
              </div>
            </div>
            <div className={settings_styles["options"]}>
              <div
                className={settings_styles["menu-btn"]}
                style={{ background: "rgb(41, 22, 86)" }}
                onClick={() => setMenuType(null)}
              >
                <span>Отмена</span>
              </div>

              <div
                className={settings_styles["menu-btn"]}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <div className={settings_styles["loader"]}>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                  </div>
                ) : (
                  <span>Готово</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {menuType === "logoutallaccounts" && (
        <div className={settings_styles["menu-wrapper"]}>
          <div className={settings_styles["bg-glow"]}></div>
          <div
            className={`${settings_styles["menu-card"]} ${isClosing ? settings_styles["closing"] : ""}`}
          >
            <span
              className={settings_styles["close-menu-btn"]}
              onClick={closeMenu}
            >
              <div className={settings_styles["close-menu-svg"]}>
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
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
            </span>
            <div className={settings_styles["menu-info"]}>
              <h2>Выйти со всех устройств</h2>
              <p>
                Эта функция закрывает <strong>все</strong> сессии, кроме
                текущей.
              </p>
            </div>
            <div className={settings_styles["options"]}>
              <div
                className={settings_styles["menu-btn"]}
                style={{ background: "rgb(41, 22, 86)" }}
                onClick={() => setMenuType(null)}
              >
                <span>Отмена</span>
              </div>

              <div
                className={settings_styles["menu-btn"]}
                onClick={handleSubmit_LeaveAllAccounts}
              >
                {isLoading ? (
                  <div className={settings_styles["loader"]}>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                  </div>
                ) : (
                  <span>Выйти</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {menuType === "deleteaccount" && (
        <div className={settings_styles["menu-wrapper"]}>
          <div className={settings_styles["bg-glow"]}></div>
          <div
            className={`${settings_styles["menu-card"]} ${isClosing ? settings_styles["closing"] : ""}`}
          >
            <span
              className={settings_styles["close-menu-btn"]}
              onClick={closeMenu}
            >
              <div className={settings_styles["close-menu-svg"]}>
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
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
            </span>
            <div className={settings_styles["menu-info"]}>
              <h2>Удалить аккаунт</h2>
              <p>Введите свой текущий пароль для удаления аккаунта.</p>
            </div>
            <div className={settings_styles["menu-form"]}>
              <div className={settings_styles["form-group"]}>
                <label
                  className={settings_styles["form-label"]}
                  htmlFor="password"
                >
                  Текущий пароль
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={handleChange}
                  value={formData.old_password}
                  className={settings_styles["form-input"]}
                  placeholder="Заполните поле"
                  required
                />
              </div>
            </div>
            <div className={settings_styles["options"]}>
              <div
                className={settings_styles["menu-btn"]}
                style={{ background: "rgb(41, 22, 86)" }}
                onClick={() => setMenuType(null)}
              >
                <span>Отмена</span>
              </div>

              <div
                className={settings_styles["menu-btn"]}
                // onClick={handleSubmit}
              >
                {isLoading ? (
                  <div className={settings_styles["loader"]}>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                    <div className={settings_styles["circle"]}>
                      <div className={settings_styles["dot"]}></div>
                      <div className={settings_styles["outline"]}></div>
                    </div>
                  </div>
                ) : (
                  <span>Удалить</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
