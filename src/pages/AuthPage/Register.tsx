import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../AuthPage/Card.Auth.module.css";
import toast from "react-hot-toast";

import axios from "axios";
axios.defaults.withCredentials = true;

interface SignInSettings {
  toggleModal: (type: string) => void;
  toggleVisible: () => void;
  passwordVisible: boolean;
}

export const RegisterPage = ({
  toggleModal,
  toggleVisible,
  passwordVisible,
}: SignInSettings) => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const registerUser = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoader(true);

    if (formData.password !== formData.confirmPassword) {
      setLoader(false);
      toast.error("Пароли не совпадают");
      return;
    }

    try {
      const response = await axios.post(`/auth/registerUser`, formData, {
        withCredentials: true,
      });

      const data = response.data;

      console.log("Успешная регистрация!");
      setLoader(false);
      toast.success(data.success);
      localStorage.setItem("token", "true");
      setTimeout(() => navigate(response.data.referer), 1000);
    } catch (err: any) {
      console.log("error", err);
      setLoader(false);

      if (err?.response && err?.response.data) {
        const serverError = err?.response.data.error;
        toast.error(serverError);
      } else {
        console.log("Ошибка сети/запроса:", err?.message);
        toast.error("Ошибка соединения с сервером");
      }
    }
  };

  return (
    <>
      <form onSubmit={registerUser}>
        <div className={styles["main-modal"]}>
          <h2>Создайте себе аккаунт</h2>
          <p className={styles["subtitle"]}>
            Создайте себе аккаунт и играйте сколько влезет!
          </p>

          <div
            className={styles["modal-icon"]}
            onClick={() => toggleModal("main")}
          >
            <div className={styles["modal-icon-svg"]}>
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
                className="lucide lucide-chevron-left-icon lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </div>
          </div>

          <div className={styles["auth-inputs"]}>
            <div className={styles["input-container"]}>
              <div className={styles["input"]}>
                <p>Никнейм</p>
                <input
                  type="text"
                  name="name"
                  placeholder="Придумайте себе никнейм"
                  autoComplete="off"
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
              </div>

              <div className={styles["input"]}>
                <p>Эл. адрес</p>
                <input
                  type="text"
                  name="email"
                  placeholder="Введите электронный адрес"
                  autoComplete="off"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>

              <div className={styles["input"]}>
                <p>Пароль</p>
                <input
                  type={!passwordVisible ? "password" : "text"}
                  name="password"
                  placeholder="Придумайте пароль"
                  autoComplete="new-password"
                  onChange={handleChange}
                  value={formData.password}
                />

                <div className={styles["svg-wrapper"]} onClick={toggleVisible}>
                  {!passwordVisible ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye-off-icon lucide-eye-off"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye-icon lucide-eye"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </div>
              </div>

              <div className={styles["input"]}>
                <p>Повтор пароля</p>
                <input
                  type={!passwordVisible ? "password" : "text"}
                  name="confirmPassword"
                  placeholder="Повторите пароль"
                  autoComplete="new-password"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
              </div>
            </div>
          </div>

          <button className={styles["submit-btn"]} disabled={loader}>
            {loader ? (
              <div className={styles["loader"]}></div>
            ) : (
              <span>Создать аккаунт</span>
            )}
          </button>

          <hr />

          <p className={styles["terms"]}>
            Регистрируясь, вы принимаете{" "}
            <a href="/documents/terms-of-use" target="_blank">
              Условия использования
            </a>{" "}
            игры. Прочитайте нашу{" "}
            <a href="/documents/privacy-policy" target="_blank">
              Политику конфиденциальности
            </a>
            .
          </p>

          {/*<p className={styles["terms"]}>*/}
          {/*    У вас уже есть аккаунт? <a href="#" onClick={() => toggleModal("login")}>Войти</a>*/}
          {/*</p>*/}
        </div>
      </form>
    </>
  );
};
