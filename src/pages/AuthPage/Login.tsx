import {Link, useNavigate} from 'react-router-dom';
import { useState } from "react";

import styles from "../AuthPage/Card.Auth.module.css";
import toast from "react-hot-toast";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";

export const LoginPage = ({ toggleModal, toggleVisible, passwordVisible }) => {
    const navigate = useNavigate();

    const [loader, setLoader] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const loginUser = async (e) => {
        e.preventDefault();

        setLoader(true);

        try {
            const response = await axios.post(`${api.API_BASE_URL}/auth/loginUser`, formData, {
                withCredentials: true
            });

            const data = response.data;

            console.log('Успешная авторизация!');
            setLoader(false);
            toast.success(data.success);
            localStorage.setItem("token", "true");
            setTimeout(() => navigate("/"), 1000);

        } catch (err) {
            setLoader(false);
            console.log('error', err);

            if (err.response && err.response.data) {
                const serverError = err.response.data.error;
                toast.error(serverError);
            } else {
                console.log('Ошибка сети/запроса:', err.message);
                toast.error('Ошибка соединения с сервером');
            }
        }
    }

    return (
        <>
            <form onSubmit={loginUser}>
                <div className={styles["main-modal"]}>

                    <h2>Войдите в аккаунт</h2>
                    <p className={styles["subtitle"]}>Мы проверим, есть ли у вас учетная запись, и поможем создать ее, если у вас ее нет.</p>

                    <div className={styles["modal-icon"]} onClick={() => toggleModal("main")}>
                        <div className={styles["modal-icon-svg"]}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left">
                                <path d="m15 18-6-6 6-6"/>
                            </svg>
                        </div>
                    </div>

                    <div className={styles["auth-inputs"]}>
                        <div className={styles["input-container"]}>
                            <div className={styles["input"]}>
                                <p>Эл. адрес</p>
                                <input
                                    type="email" name="email" placeholder="Введите электронный адрес" autoComplete="off"
                                    onChange={handleChange} value={formData.email}
                                    required
                                />
                            </div>

                            <div className={styles["input"]}>
                                <p>Пароль</p>
                                <input
                                    type={!passwordVisible ? "password" : "text"} name="password" placeholder="Введите пароль" autoComplete="current-password"
                                    onChange={handleChange} value={formData.password}
                                    required
                                />

                                <div className={styles["svg-wrapper"]} onClick={toggleVisible}>
                                    {!passwordVisible ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off-icon lucide-eye-off">
                                            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>
                                        </svg>
                                    ) :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye">
                                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    }
                                </div>
                            </div>
                        </div>

                        {/*<div className={styles["checkbox-container"]}>*/}
                        {/*    <div className={styles["checkbox-group"]}>*/}
                        {/*        <input type="checkbox" id="rememberMeCheckbox" />*/}
                        {/*        <label className={styles["remember-me"]} htmlFor="rememberMeCheckbox">Запомнить меня</label>*/}
                        {/*    </div>*/}
                        {/*    <Link to="/auth/forget-password" className={styles["forget-password"]}>Я забыл пароль</Link>*/}
                        {/*</div>*/}
                    </div>

                    <button className={styles["submit-btn"]} disabled={loader}>
                        {loader ? (
                            <div className={styles["loader"]}></div>
                        ) : (
                            <span>Войти</span>
                        )}
                    </button>
                    <hr/>
                    {/*<a href="#" className={styles["more-options"]}>Я забыл пароль</a>*/}
                    <a className={styles["btn-other"]} onClick={() => toast.error("Функция находится в разработке.")}>Я забыл пароль от аккаунта</a>

                </div>
            </form>
        </>
    );
};