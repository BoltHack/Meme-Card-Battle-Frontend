import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import styles from "./Card.Main.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";
import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../../сomponents/ErrorPage/Error.tsx";
import { LoadingPage } from "../../сomponents/LoadingPage/Loading.tsx";

import { Header } from "../../сomponents/Header/Header.tsx";
import { Footer } from "../../сomponents/Footer/Footer.tsx";

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

    setMainBlog(data?.renderData.blogData);
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

      <section className={styles["news-section"]}>
        <h2 className={styles["section-title"]}>Свежие новости и события</h2>

        <div className={styles["news-grid"]}>
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
                          src={`${api.API_BASE_URL}/${blog.cover}`}
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
      {/* <div className={styles["footer-wrapper"]}>
        <div className={styles["footer-container"]}>
          <div className={styles["social-title"]}>Следи за новостями игры</div> */}

      {/* <div className={styles["social-grid"]}>
            {mainLinks && mainLinks.length > 0
              ? mainLinks
                  .sort((a, b) =>
                    a.priority.toString().localeCompare(b.priority.toString()),
                  )
                  .map((lk) => {
                    return (
                      <a
                        key={lk.id}
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
                            src={`${api.API_BASE_URL}/${lk.icon}`}
                            alt="Platform icon"
                          />
                        )}

                        <span>{lk.name}</span>
                      </a>
                    );
                  })
              : null} */}
      {/* <a href="#" target="_blank" className={styles["social-card"]}>
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

              <svg
                className={styles["platform-icon"]}
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="40"
                viewBox="0 0 48 40"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.2865 17.2514C16.1687 11.6243 24.7446 7.88528 29.051 6.0713C41.3075 0.925503 43.884 0.0370201 45.5403 0C45.9083 0 46.7181 0.0740407 47.2702 0.518282C47.7119 0.888483 47.8223 1.36975 47.8959 1.73995C47.9695 2.11015 48.0431 2.88757 47.9695 3.47989C47.307 10.5137 44.4361 27.58 42.9638 35.4282C42.3381 38.76 41.1235 39.8706 39.9457 39.9817C37.3693 40.2038 35.4185 38.2788 32.9525 36.6499C29.051 34.0955 26.8794 32.5036 23.0884 29.9863C18.7084 27.0987 21.5425 25.5069 24.0453 22.9154C24.7078 22.2491 36.0074 11.8835 36.2283 10.958C36.2651 10.8469 36.2651 10.4026 36.0074 10.1805C35.7498 9.95841 35.3817 10.0324 35.0873 10.1065C34.6824 10.1805 28.4989 14.3268 16.4632 22.5082C14.6965 23.7299 13.1138 24.3222 11.6784 24.2852C10.0957 24.2482 7.07756 23.3967 4.79556 22.6563C2.03508 21.7678 -0.173308 21.2866 0.0107243 19.7317C0.121144 18.9173 1.22534 18.1028 3.2865 17.2514Z"
                  fill="#BFD5FF"
                />
              </svg>
              <span className={styles["card-name"]}>Telegram</span>
            </a> */}

      {/* <a href="#" target="_blank" className={styles["social-card"]}>
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

              <svg
                className={styles["platform-icon"]}
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.37413 3.37407C0 6.74814 0 12.1786 0 23.0396V24.9596C0 35.8206 0 41.251 3.37413 44.6251C6.74826 47.9992 12.1788 47.9992 23.04 47.9992H24.96C35.8212 47.9992 41.2517 47.9992 44.6259 44.6251C48 41.251 48 35.8206 48 24.9596V23.0396C48 12.1786 48 6.74814 44.6259 3.37407C41.2517 0 35.8212 0 24.96 0H23.04C12.1788 0 6.74826 0 3.37413 3.37407ZM8.1001 14.6013C8.3601 27.0811 14.6 34.5809 25.54 34.5809H26.1602V27.4411C30.1802 27.8411 33.2199 30.781 34.4399 34.5809H40.1201C38.5601 28.9011 34.4599 25.7611 31.8999 24.5611C34.4599 23.0812 38.0599 19.4812 38.9199 14.6013H33.7598C32.6398 18.5612 29.3202 22.1612 26.1602 22.5012V14.6013H21V28.4411C17.8 27.6411 13.7601 23.7611 13.5801 14.6013H8.1001Z"
                  fill="#BFD5FF"
                />
              </svg>
              <span>Вконтакте</span>
            </a> */}

      {/* <a href="#" target="_blank" className={styles["social-card"]}>
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

              <svg
                className={styles["platform-icon"]}
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="37"
                viewBox="0 0 48 37"
                fill="none"
              >
                <path
                  d="M40.6606 3.0826C37.5534 1.64253 34.2312 0.595937 30.7578 0C30.3312 0.76397 29.8329 1.79153 29.4893 2.60894C25.797 2.05889 22.1387 2.05889 18.5143 2.60894C18.1708 1.79153 17.6611 0.76397 17.2307 0C13.7536 0.595937 10.4275 1.64637 7.32039 3.09023C1.05329 12.4716 -0.645622 21.6199 0.203833 30.6384C4.3605 33.7133 8.38882 35.5812 12.3492 36.8035C13.327 35.4704 14.1991 34.0533 14.9504 32.5597C13.5195 32.0212 12.1491 31.3565 10.8541 30.5849C11.1977 30.3328 11.5337 30.0692 11.8584 29.798C19.7564 33.4574 28.3378 33.4574 36.1415 29.798C36.4699 30.0692 36.8059 30.3328 37.1457 30.5849C35.847 31.3603 34.4728 32.0249 33.0419 32.5636C33.7932 34.0533 34.6615 35.4742 35.6431 36.8073C39.6073 35.585 43.6393 33.7171 47.796 30.6384C48.7927 20.1837 46.0933 11.1194 40.6606 3.0826ZM16.0264 25.0921C13.6554 25.0921 11.7111 22.8995 11.7111 20.2295C11.7111 17.5595 13.6139 15.3632 16.0264 15.3632C18.4388 15.3632 20.3831 17.5557 20.3416 20.2295C20.3454 22.8995 18.4388 25.0921 16.0264 25.0921ZM31.9735 25.0921C29.6026 25.0921 27.6582 22.8995 27.6582 20.2295C27.6582 17.5595 29.561 15.3632 31.9735 15.3632C34.3859 15.3632 36.3303 17.5557 36.2887 20.2295C36.2887 22.8995 34.3859 25.0921 31.9735 25.0921Z"
                  fill="#BFD5FF"
                />
              </svg>
              <span>Discord</span>
            </a>

            <a href="#" target="_blank" className={styles["social-card"]}>
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

              <svg
                className={styles["platform-icon"]}
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="36"
                viewBox="0 0 48 36"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M46.9998 6.73602C48 10.4809 48 18.2901 48 18.2901C48 18.2901 48 26.1024 46.9968 29.8442C46.7236 30.8614 46.188 31.789 45.4434 32.534C44.699 33.279 43.7718 33.8154 42.7548 34.0892C39.0098 35.0926 24 35.0926 24 35.0926C24 35.0926 8.9902 35.0926 5.2483 34.0892C4.23036 33.8156 3.3023 33.279 2.5572 32.5334C1.81211 31.7878 1.27621 30.8594 1.00326 29.8412C0 26.1054 0 18.2901 0 18.2901C0 18.2901 0 10.4809 1.00326 6.73602C1.27713 5.719 1.81345 4.79178 2.55848 4.04728C3.3035 3.30278 4.23108 2.76714 5.2483 2.49398C8.9902 1.49072 24 1.49072 24 1.49072C24 1.49072 39.0098 1.49072 42.7548 2.49398C43.7714 2.7676 44.6984 3.30346 45.4428 4.04792C46.1872 4.7924 46.7232 5.71936 46.9968 6.73602H46.9998ZM18.9626 25.768L31.4356 18.5673L18.9626 11.3667V25.768Z"
                  fill="#BFD5FF"
                />
              </svg>
              <span>Youtube</span>
            </a> */}
      {/* </div> */}

      {/* <div className={styles["footer-middle-bar"]}>
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

            <span className={styles["alternativa-logo"]}>
              <a href="https://github.com/" target="_blank">
                <span className={styles["brand"]}>Git</span>
                <span className={styles["subtext"]}>Hub</span>
              </a>
            </span>
          </div> */}

      {/* <div className={styles["footer-bottom-bar"]}>
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
          </div> */}
      {/* </div> */}
      {/* </div> */}

      <Footer links={footerLinks} />
    </div>
  );
};
