import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginPage } from "./Login.tsx";
import { RegisterPage } from "./Register.tsx";

import styles from "../AuthPage/Card.Auth.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";
import toast from "react-hot-toast";
import usePageRender from "../../tools/PageRender.ts";

import { LoadingPage } from "../LoadingPage/Loading.tsx";
import { ErrorPage } from "../ErrorPage/Error.tsx";

interface TitleSettings {
  title: string;
}

export const SignInPage = ({ title }: TitleSettings) => {
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [modalType, setModalType] = useState("main");

  const { loading, error } = usePageRender(`${api.API_BASE_URL}/auth/sign-in`);

  const toggleModal = (type: string) => {
    setModalType(type);
  };
  const toggleVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className={styles["overlay"]}></div>

      <div className={styles["auth-modal"]}>
        {modalType === "main" ? (
          <div className={styles["main-modal"]}>
            <h2>
              Войдите или <br />
              зарегистрируйтесь за считанные секунды
            </h2>
            <p className={styles["subtitle"]}>
              Воспользуйтесь своей электронной почтой или другим сервисом, чтобы
              начать игру. Это бесплатно!
            </p>

            <div className={styles["modal-icon"]} onClick={() => navigate("/")}>
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
                  className="lucide lucide-arrow-big-left-icon lucide-arrow-big-left"
                >
                  <path d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z" />
                </svg>
              </div>
            </div>

            <div className={styles["auth-buttons"]}>
              <div
                className={styles["btn"]}
                onClick={() => toggleModal("login")}
              >
                <div className={styles["icon-container"]}>
                  <div className={styles["icon-svg"]}>
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
                      className="lucide lucide-key-square-icon lucide-key-square"
                    >
                      <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z" />
                      <path d="m14 7 3 3" />
                      <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />
                    </svg>
                  </div>
                </div>
                <span>Войти в аккаунт</span>
              </div>

              <div
                className={styles["btn"]}
                onClick={() => toggleModal("register")}
              >
                <div className={styles["icon-container"]}>
                  <div className={styles["icon-svg"]}>
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
                      className="lucide lucide-log-in-icon lucide-log-in"
                    >
                      <path d="m10 17 5-5-5-5" />
                      <path d="M15 12H3" />
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    </svg>
                  </div>
                </div>
                <span className={styles["icon-content"]}>
                  Зарегистрироваться
                </span>
              </div>

              {/*<div className={`${styles["btn"]} ${styles["more-options-btn"]}`}>*/}
              {/*    <span className={styles["icon-content"]}>Просмотреть другие варианты</span>*/}
              {/*</div>*/}

              {/*<div className={styles["btn"]}>*/}
              {/*    <div className={styles["icon-svg"]}>*/}
              {/*        <div className={styles["icon-svg"]}>*/}
              {/*            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>*/}
              {/*        </div>*/}
              {/*    </div>*/}
              {/*    <span className={styles["icon-content"]}>Войти с электронным адресом</span>*/}
              {/*</div>*/}
            </div>

            <a
              href="#"
              className={styles["more-options"]}
              onClick={() => toast.error("Функция находится в разработке.")}
            >
              Просмотреть другие варианты
            </a>

            <p className={styles["terms"]}>
              Продолжая, вы принимаете{" "}
              <a href="/terms-of-use" target="_blank">
                Условия использования
              </a>{" "}
              игры. Прочитайте нашу{" "}
              <a href="/privacy-policy" target="_blank">
                Политику конфиденциальности
              </a>
              .
            </p>

            <hr />

            <div style={{ marginTop: "20px" }}></div>

            <button
              className={styles["btn-other"]}
              onClick={() => toast.error("Функция находится в разработке.")}
            >
              Регистрация для команд / клубов
            </button>
          </div>
        ) : modalType === "login" ? (
          <LoginPage
            toggleModal={toggleModal}
            toggleVisible={toggleVisible}
            passwordVisible={passwordVisible}
          />
        ) : modalType === "register" ? (
          <RegisterPage
            toggleModal={toggleModal}
            toggleVisible={toggleVisible}
            passwordVisible={passwordVisible}
          />
        ) : (
          ""
        )}
      </div>
      <footer>
        <div className={styles["footer-container"]}>
          <div className={styles["footer-content"]}>
            <div className={styles["footer-item"]}>
              <span>
                <a href="/privacy-policy" target="_blank">
                  Политика конфиденциальности
                </a>
              </span>
            </div>
            <div className={styles["footer-item"]}>
              <span>
                <a href="/terms-of-use" target="_blank">
                  Условия использования
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
