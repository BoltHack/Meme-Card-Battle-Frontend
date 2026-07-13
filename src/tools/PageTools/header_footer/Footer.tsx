import { Link } from "react-router-dom";

import styles from "../stylesheets/Card.HeaderFooter.module.css";

export const Footer = () => {
    return (
        <>
            <footer className={`${styles["site-footer"]} ${styles["glass-footer"]}`}>
                <div className={styles["footer-container"]}>
                    <div className={styles["footer-row"]}>
                        <div className={`${styles["footer-col-container"]} ${styles["left"]}`}>

                            <div className={`${styles["footer-col"]} ${styles["icon"]}`}>
                                <svg
                                    className={styles['logo-icon']}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                </svg>
                            </div>

                            <div className={`${styles["footer-col"]} ${styles["about"]}`}>
                                <h3>О проекте</h3>
                                <p>Создаем современные интерфейсы с акцентом на эстетику и функциональность. Погрузитесь в мир чистого кода и стильного дизайна.</p>
                            </div>
                            <div className={`${styles["footer-col"]} ${styles["about"]}`}>
                                <h3>Социальные сети</h3>
                                <div className={styles["social-links"]}>
                                    <a href="#" aria-label="Telegram"><i className={`${styles["fab"]} ${styles["fa-telegram-plane"]}`}></i></a>
                                    <a href="#" aria-label="VK"><i className={`${styles["fab"]} ${styles["fa-vk"]}`}></i></a>
                                    <a href="#" aria-label="GitHub"><i className={`${styles["fab"]} ${styles["fa-github"]}`}></i></a>
                                    <a href="#" aria-label="Discord"><i className={`${styles["fab"]} ${styles["fa-discord"]}`}></i></a>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles["footer-col-container"]} ${styles["right"]}`}>
                            <div className={`${styles["footer-col"]} ${styles["links"]}`}>
                                <h3>Навигация</h3>
                                <ul>
                                    <li><Link to="/">Главная</Link></li>
                                    <li><Link to="#">Документация</Link></li>
                                    <li><Link to="/shop">Магазин</Link></li>
                                    <li><Link to="#">Сундуки</Link></li>
                                </ul>
                            </div>

                            <div className={`${styles["footer-col"]} ${styles["links"]}`}>
                                <h3>Компания</h3>
                                <ul>
                                    <li><Link to="/company-information">Информация о компании</Link></li>
                                    <li><Link to="/about-us">О нас</Link></li>
                                    <li><Link to="/news">Новости</Link></li>
                                </ul>
                            </div>

                            <div className={`${styles["footer-col"]} ${styles["links"]}`}>
                                <h3>Информация</h3>
                                <ul>
                                    <li><Link to="/help-center">Справочный центр</Link></li>
                                    <li><Link to="/support">Поддержка</Link></li>
                                    <li><Link to="/blog">Блог</Link></li>
                                </ul>
                            </div>

                            <div className={`${styles["footer-col"]} ${styles["links"]}`}>
                                <h3>Политика</h3>
                                <ul>
                                    <li><Link to="/privacy-policy">Политика конфиденциальности</Link></li>
                                    <li><Link to="/terms-of-use">Условия использования</Link></li>
                                    <li><Link to="/cookie-policy">Политика Cookie файлов</Link></li>
                                    <li><Link to="/rules">Правила</Link></li>
                                </ul>
                            </div>

                            <div className={`${styles["footer-col"]} ${styles["contact"]}`}>
                                <h3>Контакты</h3>
                                <ul>
                                    <li><a href="#" className={`${styles["fas"]} ${styles["fa-code"]}`}>Developer Mode</a></li>
                                    <li><a href="#" className={`${styles["fas"]} ${styles["fa-envelope"]}`}>support@glassui.io</a></li>
                                    <li><a href="#" className={`${styles["fas"]} ${styles["fa-shield-alt"]}`}>Конфиденциальность</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className={styles["footer-divider"]}/>

                    <br/>

                    <div className={styles["footer-bottom"]}>
                        {/*<p>&copy; 2026 MEME CARD BATTLE | Все права защищены.</p>*/}
                        <h1>MEME CARD BATTLE</h1>
                    </div>
                </div>
            </footer>
        </>
    )
}