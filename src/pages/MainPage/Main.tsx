import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import styles from "./Card.Main.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";

import usePageRender from "../../tools/PageRender.ts";
import { LoadingPage } from "../LoadingPage/Loading.tsx";
import { ErrorPage } from "../ErrorPage/Error.tsx";
import { Header } from "../../tools/PageTools/header_footer/Header.tsx";
import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";

interface BlogPost {
  author: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  date: string;
  id: string;
}

interface TitleSettings {
  title: string;
}

export const MainPage = ({ title }: TitleSettings) => {
  const [mainBlog, setMainBlog] = useState<BlogPost[]>([]);

  const { data, loading, error } = usePageRender(`${api.API_BASE_URL}/api/`);

  const dateSettings = (date: string) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour12: false,
    });
  };

  useEffect(() => {
    if (!data || !data.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
    }

    setMainBlog(data?.renderData);
    console.log("data", data);
  }, [data]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />

      <section className={styles["hero"]}>
        <div className={styles["parallax-body"]}></div>
        <div className={styles["parallax-wrapper"]}>
          <div className={styles["smoke-glow smoke-red"]}></div>
          <div className={styles["smoke-glow smoke-blue"]}></div>
          <div className={styles["smoke-glow smoke-purple"]}></div>

          <div className={styles["halftone-overlay"]}></div>

          <div className={styles["star-particles"]}></div>

          <div className={styles["shard shard-1"]}></div>
          <div className={styles["shard shard-2"]}></div>

          <svg
            className={`${styles["lightning"]} ${styles["lightning-right"]}`}
            viewBox="0 0 24 24"
          >
            <path d="M19 9h-6l3-7L5 13h6l-3 9z" />
          </svg>

          <div className={styles["card-layer"]}>
            <div className={`${styles["premium-card"]} ${styles["card-king"]}`}>
              <div></div>
              <div className={styles["card-suit-center"]}>?</div>
              <div className={styles["card-suit-bottom"]}></div>
            </div>

            <div
              className={`${styles["premium-card"]} ${styles["card-ace-spades"]}`}
            >
              <div></div>
              <div className={styles["card-suit-center"]}>?</div>
              <div className={styles["card-suit-bottom"]}></div>
            </div>

            <div
              className={`${styles["premium-card"]} ${styles["card-ace-diamonds"]}`}
            >
              <div></div>
              <div className={styles["card-suit-center"]}>?</div>
              <div className={styles["card-suit-bottom"]}></div>
            </div>
          </div>
        </div>

        <div className={styles["hero-content"]}>
          <h1>
            MEME CARD <span>BATTLE</span>
          </h1>
          <p>Захватывающе и интересные карточные бои!</p>
          <div className={styles["btn-group"]}>
            <Link
              to="/play"
              className={`${styles["btn"]} ${styles["btn-primary"]}`}
            >
              Играть в браузере
            </Link>
            {/* <a
              href="#"
              className={`${styles["btn"]} ${styles["btn-secondary"]}`}
            >
              Скачать для Windows
            </a> */}
          </div>
        </div>
      </section>

      <div className={styles["line"]}></div>

      <section className={styles["news-section"]}>
        <h2 className={styles["section-title"]}>Новости и события</h2>

        <div className={styles["news-grid"]}>
          {mainBlog && mainBlog.length > 0
            ? mainBlog.map((blog) => {
                return (
                  <div className={styles["news-card"]} key={blog.id}>
                    {blog.cover.length > 0 ? (
                      <img
                        src={`${api.API_BASE_URL}/${blog.cover}`}
                        loading="lazy"
                        className={`${styles["news-img"]} ${styles["img-blockopolis"]}`}
                      />
                    ) : (
                      <div
                        className={`${styles["news-img"]} ${styles["img-blockopolis"]}`}
                      ></div>
                    )}
                    {/* <img
                      src={`${api.API_BASE_URL}/${blog.cover}`}
                      className={`${styles["news-img"]} ${styles["img-blockopolis"]}`}
                    /> */}
                    <div className={styles["news-content"]}>
                      <div className={styles["news-meta"]}>
                        <span>{dateSettings(blog.date)}</span>
                        <span className={styles["tag"]}>{blog.category}</span>
                      </div>
                      <h3>
                        {blog.title.length > 50
                          ? blog.title.slice(0, 50) + "..."
                          : blog.title}
                      </h3>
                      <p>
                        {blog.description.length > 140
                          ? blog.description.slice(0, 140) + "..."
                          : blog.description}
                      </p>
                      <a
                        href={`/blog/${blog.id.toString()}`}
                        target="_blank"
                        className={styles["news-href"]}
                      >
                        Читать подробнее →
                      </a>
                    </div>
                  </div>
                );
              })
            : "Новых новостей пока нет"}
        </div>
      </section>
      <div className={styles["footer-wrapper"]}>
        <div className={styles["footer-container"]}>
          <div className={styles["social-title"]}>Следи за новостями игры</div>

          <div className={styles["social-grid"]}>
            <a href="#" className={styles["social-card"]}>
              <svg className={styles["arrow-icon"]} viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M5 19L19 5M19 5H10M19 5V14"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className={styles["platform-icon"]} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7-2.46 2.75-2.67.01-.03.01-.15-.06-.21a.25.25 0 0 0-.22-.04c-.3.07-5.02 3.19-5.12 3.26-.2.13-.39.2-.57.19-.2 0-.58-.1-.86-.2-.35-.11-.63-.17-.6-.36.02-.1.15-.2.38-.3 1.48-.65 4.93-2.12 10.35-4.46.94-.38 1.13-.35 1.25-.13.04.07.05.17.02.32z" />
              </svg>
              <span>Telegram</span>
            </a>

            <a href="#" className={styles["social-card"]}>
              <svg className={styles["arrow-icon"]} viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M5 19L19 5M19 5H10M19 5V14"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className={styles["platform-icon"]} viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2.4 9.1c.3.3.7.6 1.1.9.4.4.5.8.2.9-.3.1-.7.1-1.1.1-.4 0-.8-.1-1.1-.3-.3-.2-.5-.5-.8-.8-.4-.4-.7-.5-1-.5h-.3v2c0 .3-.1.4-.4.4h-.6c-1.3 0-2.4-.5-3.3-1.4-.9-.9-1.5-2.1-1.8-3.5 0-.2.1-.3.3-.3h1.2c.3 0 .4.1.4.3.2.7.5 1.3.9 1.8.3.3.6.5.8.5.1 0 .2-.1.2-.3v-2.1c0-.4-.2-.5-.5-.5h-.3c-.1 0-.2-.1-.1-.2.1-.2.4-.4.8-.4h1.2c.3 0 .4.1.4.4v2.5c0 .2.1.3.2.3.1 0 .2-.1.3-.2.5-.7.8-1.4 1-2.2 0-.2.2-.3.4-.3h1.2c.2 0 .3 0 .3.2-.2.8-.6 1.5-1.1 2.1-.2.2-.2.3 0 .5z" />
              </svg>
              <span>Вконтакте</span>
            </a>

            <a href="#" className={styles["social-card"]}>
              <svg className={styles["arrow-icon"]} viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M5 19L19 5M19 5H10M19 5V14"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className={styles["platform-icon"]} viewBox="0 0 24 24">
                <path d="M19.27 4.73a16.13 16.13 0 0 0-3.97-1.23.08.08 0 0 0-.08.04c-.17.31-.36.71-.49 1.03a14.86 14.86 0 0 0-4.46 0c-.13-.32-.33-.72-.51-1.03a.08.08 0 0 0-.08-.04 16.09 16.09 0 0 0-3.97 1.23.05.05 0 0 0-.02.02A16.17 16.17 0 0 0 2.1 16.63a.08.08 0 0 0 .03.06 16.18 16.18 0 0 0 4.86 2.45.08.08 0 0 0 .09-.03c.38-.51.71-1.07.99-1.65a.08.08 0 0 0-.04-.11 10.43 10.43 0 0 1-1.52-.73.08.08 0 0 1-.01-.13c.1-.07.2-.15.3-.23a.08.08 0 0 1 .08-.01 11.44 11.44 0 0 0 10.6 0 .08.08 0 0 1 .09.01c.1.08.2.16.3.23a.08.08 0 0 1-.01.13 10.64 10.64 0 0 1-1.52.73.08.08 0 0 0-.04.11c.29.58.61 1.14.99 1.65a.08.08 0 0 0 .09.03 16.16 16.16 0 0 0 4.87-2.45.08.08 0 0 0 .03-.06 16.23 16.23 0 0 0-3.66-11.88.06.06 0 0 0-.02-.02zM8.52 12.05c-.96 0-1.75-.88-1.75-1.96s.77-1.96 1.75-1.96c.99 0 1.77.89 1.75 1.96 0 1.08-.77 1.96-1.75 1.96zm6.97 0c-.96 0-1.75-.88-1.75-1.96s.77-1.96 1.75-1.96c.99 0 1.77.89 1.75 1.96 0 1.08-.77 1.96-1.75 1.96z" />
              </svg>
              <span>Discord</span>
            </a>

            <a href="#" className={styles["social-card"]}>
              <svg className={styles["arrow-icon"]} viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M5 19L19 5M19 5H10M19 5V14"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className={styles["platform-icon"]} viewBox="0 0 24 24">
                <path d="M23.5 12.4c0 1.5-.1 3-.3 4.4-.2 1.4-1.1 2.4-2.4 2.6-2.9.4-8.8.4-8.8.4s-5.9 0-8.8-.4c-1.3-.2-2.2-1.2-2.4-2.6-.2-1.4-.3-2.9-.3-4.4s.1-3 .3-4.4c.2-1.4 1.1-2.4 2.4-2.6 2.9-.4 8.8-.4 8.8-.4s5.9 0 8.8.4c1.3.2 2.2 1.2 2.4 2.6.2 1.4.3 2.9.3 4.4zM9.5 8.5V15.5L15.5 12L9.5 8.5z" />
              </svg>
              <span>Youtube</span>
            </a>

            <a href="#" className={styles["social-card"]}>
              <svg className={styles["arrow-icon"]} viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M5 19L19 5M19 5H10M19 5V14"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className={styles["platform-icon"]} viewBox="0 0 24 24">
                <path d="M11.6 3L4 9.6V21h5.3v2.6h2.7L14.7 21h4L21 14.4V3H11.6zm8.1 10.2L17.1 16H13.1l-2.7 2.7V16H7.8V4.3h11.9v8.9zm-2.7-5.8h-1.4v4.5h1.4V7.4zm-3.3 0h-1.4v4.5h1.4V7.4z" />
              </svg>
              <span>Twitch</span>
            </a>

            <a href="#" className={styles["social-card"]}>
              <svg className={styles["arrow-icon"]} viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M5 19L19 5M19 5H10M19 5V14"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className={styles["platform-icon"]} viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
              </svg>
              <span>Дзен</span>
            </a>

            <a href="#" className={styles["social-card"]}>
              <svg className={styles["arrow-icon"]} viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M5 19L19 5M19 5H10M19 5V14"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg className={styles["platform-icon"]} viewBox="0 0 24 24">
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
              </svg>
              <span>Max</span>
            </a>
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

            {/* <div className={styles["alternativa-logo"]}>
              <span className={styles["brand"]}>test</span>
              <span className={styles["subtext"]}>test</span>
            </div> */}
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
              <a href="/rules" target="_blank">Правила игры</a>
              <a href="/how-to-play" target="_blank">
                Как играть?
              </a>
              <a href="/support" target="_blank">Поддежрка</a>
            </div>

            <div className={styles["age-rating"]}>0+</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
