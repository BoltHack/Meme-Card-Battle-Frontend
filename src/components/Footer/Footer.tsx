import { Link } from "react-router-dom";

import styles from "./Card.Footer.module.css";

import api from "../../api/api";

interface Props {
  links: any;
}

export const Footer = ({ links }: Props) => {
  return (
    <footer className={styles["site-footer"]}>
      <div className={styles["footer-wrapper"]}>
        <div className={styles["footer-container"]}>
          <div className={styles["social-title"]}>Следи за новостями игры</div>

          <div className={styles["social-grid"]}>
            {links && links.length > 0
              ? links
                  .sort((a, b) =>
                    a.priority.toString().localeCompare(b.priority.toString()),
                  )
                  .map((lk: any, index: number) => {
                    return (
                      <a
                        key={index}
                        href={lk.link}
                        target="_blank"
                        className={styles["social-card"]}
                      >
                        <svg
                          className={styles["arrow-icon"]}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            d="M5 19L19 5M19 5H10M19 5V14"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        {lk.icon && (
                          <img
                            className={styles["platform-icon"]}
                            src={`${api.IMAGE_BASE_URL}/${lk.icon}`}
                            alt="Platform icon"
                          />
                        )}

                        <span>{lk.name}</span>
                      </a>
                    );
                  })
              : null}
          </div>

          <div className={styles["footer-middle-bar"]}>
            <div className={styles["support-info"]}>
              <div className={styles["support-icon"]}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className={styles["support-text"]}>
                <span className={styles["label"]}>Служба поддержки:</span>
                <span className={styles["email"]}>help@example.com</span>
              </div>
            </div>

            <Link to="/play" className={styles["btn-play-footer"]}>
              Играть в браузере
            </Link>

            <span className={styles["github-logo"]}>
              <a href="https://github.com/" target="_blank">
                <span className={styles["brand"]}>Git</span>
                <span className={styles["subtext"]}>Hub</span>
              </a>
            </span>
          </div>

          <div className={styles["footer-bottom-bar"]}>
            <div className={styles["copyright-block"]}>
              <div className={styles["cookie-icon"]}></div>
              <span>
                &copy; <strong>Все права защищены</strong>. Полное или частичное
                копирование сайта запрещено.
              </span>
            </div>

            <div className={styles["legal-links"]}>
              <Link to="/rules">Правила игры</Link>
              <Link to="/how-to-play">Как играть?</Link>
              <Link to="/help-center">Справочный центр</Link>
              <Link to="/support">Поддежрка</Link>
            </div>

            <div className={styles["age-rating"]}>0+</div>
          </div>
          <br />
          <div className={styles["social-title"]}>Другие ссылки</div>
          <div className={styles["footer-col-container"]}>
            <div className={styles["footer-col"]}>
              <Link to="/company-information">Информация о компании</Link>
              <Link to="/about-us">О нас</Link>
              <Link to="/category/news">Новости</Link>
              <Link to="/support">Поддержка</Link>
              <Link to="/blog">Блог</Link>
              <Link to="/privacy-policy">Политика конфиденциальности</Link>
              <Link to="/terms-of-use">Условия использования</Link>
              <Link to="/cookie-policy">Политика Cookie файлов</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
