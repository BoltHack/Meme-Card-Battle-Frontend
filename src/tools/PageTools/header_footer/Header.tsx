import styles from "../stylesheets/Card.HeaderFooter.module.css";
import {Link} from "react-router-dom";
import {useState} from "react";

export const Header = () => {
    const [isOpen, setIsOpen] = useState(null);

    const handleMenuOpen = (menuId) => {
        setIsOpen(menuId);
    }

    return (
        <>
            <header className={styles["header"]}>
                <div className={styles["header-container"]}>
                    <Link to="/" className={styles["logo"]}>
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
                        MEME CARD<span>BATTLE</span>
                    </Link>

                    <nav className={styles["nav"]}>
                        <ul className={styles["nav-list"]}>
                            <li>
                                <Link to="/" className={styles["nav-link"]}>Главная</Link>
                            </li>

                            <li className={styles["dropdown"]}>
                                <Link to="/blog" className={`${styles["nav-link"]} ${styles["dropdown-toggle"]}`}>
                                    Блог<span className={styles["arrow"]}>
                                    {/*▼*/}
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 6L8 10L4 6" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
                                </Link>

                                <ul className={styles["dropdown-menu"]}>
                                    <li><Link to="/category/community">Сообщество</Link></li>
                                    <li><Link to="/category/development">Разработка</Link></li>
                                    <li><Link to="/category/functions">Функции</Link></li>
                                    <li><Link to="/category/safety">Безопасность</Link></li>
                                </ul>
                            </li>

                            {/*<li className={styles["dropdown"]}>*/}
                            {/*    <Link to="/news" className={`${styles["nav-link"]} ${styles["dropdown-toggle"]}`}>*/}
                            {/*        Новости<span className={styles["arrow"]}>*/}
                            {/*        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*            <path d="M12 6L8 10L4 6" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>*/}
                            {/*        </svg>*/}
                            {/*    </span>*/}
                            {/*    </Link>*/}

                            {/*    <ul className={styles["dropdown-menu"]}>*/}
                            {/*        <li><a href="#">Обновления</a></li>*/}
                            {/*        <li><a href="#">Об игре</a></li>*/}
                            {/*        <li><a href="#">Баги и ошибки</a></li>*/}
                            {/*    </ul>*/}
                            {/*</li>*/}

                            <li className={styles["dropdown"]}>
                                <Link to="/company-information" className={`${styles["nav-link"]} ${styles["dropdown-toggle"]}`}>
                                    Информация<span className={styles["arrow"]}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 6L8 10L4 6" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
                                </Link>

                                <ul className={styles["dropdown-menu"]}>
                                    <li><Link to="/about-us">О нас</Link></li>
                                    <li><Link to="/how-to-play">Как играть?</Link></li>
                                </ul>
                            </li>

                            <li>
                                <a href="/news" className={styles["nav-link"]}>Новости</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}