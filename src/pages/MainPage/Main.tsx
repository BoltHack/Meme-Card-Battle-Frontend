import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import styles from "./Card.Main.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";
import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../components/LoadingPage/Loading.tsx";

import { Header } from "../../components/Header/Header.tsx";
import { Footer } from "../../components/Footer/Footer.tsx";

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

interface FooterLinksContext {
  footerLinks?: any;
}

import ratings_cover from "../../assets/MainPage_background.png";
import github_cover from "../../assets/GitHub-1024x600.png";

export const MainPage = ({ title }: TitleSettings) => {
  const { footerLinks } = useOutletContext<FooterLinksContext>() ?? {
    footerLinks: [],
  };

  const [mainBlog, setMainBlog] = useState<BlogPost[]>([]);

  const { data, loading, error, socket } = usePageRender(
    `${api.API_BASE_URL}/api/`,
  );

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

    setMainBlog(data?.renderData?.blogData);
  }, [data]);

  // useEffect(() => {
  //   setBodyClass(styles["body-wrapper"]);
  // }, [setBodyClass]);

  useEffect(() => {
    const socketDisconnect = () => {
      if (socket.connected) socket.disconnect();
    };

    const timerId = setTimeout(socketDisconnect, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [socket]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />

      {data?.role === "Admin" && (
        <Link to="/admin/panel" className={styles["admin-panel-btn"]}>
          Админка
        </Link>
      )}

      <section className={styles["hero"]}>
        {/* <div className={styles["parallax-body"]}></div> */}
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
          <p>Захватывающе и интересные карточные баталии</p>
          <div className={styles["btn-group"]}>
            <Link
              to="/play"
              className={`${styles["btn"]} ${styles["btn-primary"]}`}
            >
              Играть в браузере
            </Link>
            <Link
              to="/how-to-play"
              className={`${styles["btn"]} ${styles["btn-secondary"]}`}
            >
              {/* Скачать для Windows */}
              Как играть?
            </Link>
          </div>
        </div>
      </section>

      <div className={styles["line"]}></div>

      <section className={styles["info-section"]}>
        <h2 className={styles["section-title"]}>Свежие новости и события</h2>

        <div className={`${styles["info-grid"]} ${styles["grid-3"]}`}>
          {mainBlog && mainBlog.length > 0
            ? mainBlog
                .map((blog) => {
                  return (
                    <div
                      className={styles["news-card"]}
                      style={{ maxWidth: "370px" }}
                      key={blog.id}
                    >
                      {blog.cover.length > 0 ? (
                        <img
                          src={`${api.IMAGE_BASE_URL}/${blog.cover}`}
                          crossOrigin="anonymous"
                          loading="lazy"
                          className={`${styles["news-img"]} ${styles["img-blockopolis"]}`}
                        />
                      ) : (
                        <div
                          className={`${styles["news-img"]} ${styles["img-blockopolis"]}`}
                        ></div>
                      )}
                      <div className={styles["news-content"]}>
                        <div className={styles["news-meta"]}>
                          <span>{dateSettings(blog.date)}</span>
                          <span className={styles["tag"]}>
                            {blog.category === "news"
                              ? "Новости"
                              : blog.category}
                          </span>
                        </div>
                        <h3>
                          {blog.title.length > 50
                            ? blog.title.slice(0, 50) + "..."
                            : blog.title}
                        </h3>
                        <p>
                          {blog.description.length > 155
                            ? blog.description.slice(0, 155) + "..."
                            : blog.description}
                        </p>
                        <a
                          href={`/blog/${blog.id.toString()}`}
                          className={styles["news-href"]}
                        >
                          Читать подробнее →
                        </a>
                      </div>
                    </div>
                  );
                })
                .reverse()
            : "Новых новостей пока нет"}
        </div>
      </section>

      <section
        className={styles["info-section"]}
        style={{ marginTop: "200px", marginBottom: "200px" }}
      >
        <h2 className={styles["section-title"]}>Дополнительные ссылки</h2>

        <div className={`${styles["info-grid"]} ${styles["grid-2"]}`}>
          <a href="/ratings" target="_blank" className={styles["link-card"]}>
            <div className={styles["link-cover"]}>
              {/* <svg
                className={styles["cover-svg"]}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 6V2h-1" />
                <path d="M9 15a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1" />
                <path d="M9 21V11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10" />
              </svg> */}
              <img src={ratings_cover} className={styles["cover-img"]} />
            </div>

            <div className={styles["link-overlay"]}>
              <h2 className={styles["link-title"]}>РЕЙТИНГ</h2>
              <p className={styles["link-description"]}>
                Система личной статистики, рейтингов и достижений позволяет
                знакомиться со своими и чужими боевыми показателями,
                соревноваться за места в еженедельных рейтингах и получать
                памятные «медали» за достижения.
              </p>
            </div>
            <div className={styles["link-arrow"]}>
              <svg className={styles["arrow-icon"]} viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M5 19L19 5M19 5H10M19 5V14"
                  // stroke="#fff"
                  // strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </a>
          <a
            href="https://github.com/BoltHack"
            target="_blank"
            className={styles["link-card"]}
          >
            <div className={styles["link-cover"]}>
              <img src={github_cover} className={styles["cover-img"]} />
            </div>

            <div className={styles["link-overlay"]}>
              <h2 className={styles["link-title"]}>Github</h2>
              <p className={styles["link-description"]}>
                Если вам интересны наши другие проекты и вы хотите узнать больше
                про них, то можете посетить наш гитхаб. Там новости об
                обновлениях, доработках, багфиксах и о многом другом.
              </p>
            </div>
            <div className={styles["link-arrow"]}>
              <svg className={styles["arrow-icon"]} viewBox="0 0 24 24">
                <path
                  fill="none"
                  d="M5 19L19 5M19 5H10M19 5V14"
                  // stroke="#fff"
                  // strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </a>
        </div>
      </section>

      <Footer links={footerLinks} />
    </div>
  );
};
