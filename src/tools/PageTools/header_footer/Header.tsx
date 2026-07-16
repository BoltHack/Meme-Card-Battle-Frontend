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
            {/*<header className={styles['site-header']}>*/}
            {/*    <div className={styles['header-container']}>*/}
            {/*        <Link to="/" className={styles['logo']}>*/}
            {/*            <svg*/}
            {/*                className={styles['logo-icon']}*/}
            {/*                xmlns="http://www.w3.org/2000/svg"*/}
            {/*                viewBox="0 0 24 24"*/}
            {/*                fill="none"*/}
            {/*                stroke="currentColor"*/}
            {/*                strokeWidth="2.5"*/}
            {/*                strokeLinecap="round"*/}
            {/*                strokeLinejoin="round"*/}
            {/*            >*/}
            {/*                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />*/}
            {/*                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />*/}
            {/*                <line x1="12" y1="22.08" x2="12" y2="12" />*/}
            {/*            </svg>*/}
            {/*            <span>MEME CARD BATTLE</span>*/}
            {/*        </Link>*/}

            {/*        <nav className={styles['nav-menu']}>*/}

            {/*            <ul className="nav-list">*/}
            {/*                <li><a href="#" className={styles["nav-link"]}>Главная</a></li>*/}

            {/*                <li className="dropdown">*/}
            {/*                    <a href="#" className={`${styles["nav-link"]} ${styles["dropdown-toggle"]}`}>Услуги <span className={styles["arrow"]}>▼</span></a>*/}
            {/*                    <ul className={styles["dropdown-menu"]}>*/}
            {/*                        <li><a href="#">Веб-дизайн</a></li>*/}
            {/*                        <li><a href="#">Разработка сайтов</a></li>*/}
            {/*                        <li><a href="#">SEO-продвижение</a></li>*/}
            {/*                        <li><a href="#">Маркетинг</a></li>*/}
            {/*                    </ul>*/}
            {/*                </li>*/}

            {/*                <li><a href="#" className="nav-link">О нас</a></li>*/}
            {/*                <li><a href="#" className="nav-link">Контакты</a></li>*/}
            {/*            </ul>*/}

            {/*        /!*    <div className={styles['nav-link-menu']}*!/*/}
            {/*        /!*         onMouseMove={() => handleMenuOpen("blog_nav")}*!/*/}
            {/*        /!*         onMouseLeave={() => handleMenuOpen(null)}*!/*/}
            {/*        /!*    >*!/*/}
            {/*        /!*        <div className={styles["nav-link"]}>*!/*/}
            {/*        /!*            <span>Блог</span>*!/*/}
            {/*        /!*            <div className={`${styles["nav-svg"]} ${isOpen === "blog_nav" ? styles["active"] : null}`}>*!/*/}
            {/*        /!*                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">*!/*/}
            {/*        /!*                    <path d="M12 6L8 10L4 6" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>*!/*/}
            {/*        /!*                </svg>*!/*/}
            {/*        /!*            </div>*!/*/}
            {/*        /!*        </div>*!/*/}

            {/*        /!*        <div className={`${styles["nav-link-tools"]} ${isOpen === "blog_nav" ? styles["active"] : null}`}>*!/*/}
            {/*        /!*            <ul>*!/*/}
            {/*        /!*                <li><Link to="/">test</Link></li>*!/*/}
            {/*        /!*                <li><Link to="/">test</Link></li>*!/*/}
            {/*        /!*                <li><Link to="/">test</Link></li>*!/*/}
            {/*        /!*            </ul>*!/*/}
            {/*        /!*        </div>*!/*/}
            {/*        /!*    </div>*!/*/}

            {/*        </nav>*/}

            {/*        /!*<div className={styles['header-actions']}>*!/*/}
            {/*        /!*    <button className={styles['btn-primary']}>{name.length > 0 ? "Выйти" : "Войти"}</button>*!/*/}
            {/*        /!*</div>*!/*/}
            {/*    </div>*/}
            {/*</header>*/}

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
                                    <li><Link to="/blog/category/community">Сообщество</Link></li>
                                    <li><Link to="/blog/category/development">Разработка</Link></li>
                                    <li><Link to="/blog/category/functions">Функции</Link></li>
                                    <li><Link to="/blog/category/safety">Безопасность</Link></li>
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