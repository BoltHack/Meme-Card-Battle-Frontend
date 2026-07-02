import styles from "../stylesheets/Card.HeaderFooter.module.css";
import {Link} from "react-router-dom";

export const Header = () => {
    return (
        <>
            <header className={styles['site-header']}>
                <div className={styles['header-container']}>
                    <Link to="/" className={styles['logo']}>
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
                        <span>MEME CARD BATTLE</span>
                    </Link>

                    <nav className={styles['nav-menu']}>
                        <a href="#" className={`${styles['nav-link']} ${styles['active']}`}>Главная</a>
                        <a href="#" className={styles['nav-link']}>Проекты</a>
                        <a href="#" className={styles['nav-link']}>Услуги</a>
                        <a href="#" className={styles['nav-link']}>Контакты</a>
                    </nav>

                    {/*<div className={styles['header-actions']}>*/}
                    {/*    <button className={styles['btn-primary']}>{name.length > 0 ? "Выйти" : "Войти"}</button>*/}
                    {/*</div>*/}
                </div>
            </header>
        </>
    )
}