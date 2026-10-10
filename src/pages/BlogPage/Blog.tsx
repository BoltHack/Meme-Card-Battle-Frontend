import { useEffect, useRef, useState } from "react";
import { useOutletContext, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import styles from "./Card.Blog.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";

import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../ErrorPage/Error.tsx";
import { LoadingPage } from "../LoadingPage/Loading.tsx";

import { Header } from "../../tools/PageTools/header_footer/Header.tsx";
import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";
import { Pagination } from "../../tools/PageTools/Pagination/Pagination.tsx";

interface BlogPost {
  author: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  date: string;
  id: string;
}

interface BlogResponse {
  id?: string;
  renderData: {
    blog: BlogPost[];
    currentPage: number;
    totalPages: number;
  };
}

interface BlogPageProps {
  title: string;
}

interface FooterLinksContext {
  footerLinks?: any;
}

export const BlogPage = ({ title }: BlogPageProps) => {
  const { footerLinks } = useOutletContext<FooterLinksContext>() ?? {
    footerLinks: [],
  };

  const bodyWrapperRef = useRef<HTMLDivElement | null>(null);

  const [blog, setBlog] = useState<BlogPost[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [searchParams] = useSearchParams();
  const getCurrentPage = Number(searchParams.get("page")) || 1;

  const blog_state = JSON.parse(sessionStorage.getItem("blog_state") || "{}");
  // const [isBlogState, setIsBlogState] = useState<boolean | false>(false);

  const { data, loading, error, socket } = usePageRender<BlogResponse>(
    `${api.API_BASE_URL}/api/blog?page=${currentPage}`,
  );

  const dateSettings = (date: string) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      // hour: '2-digit', minute: '2-digit',
      hour12: false,
    });
  };

  const categorySettings = (category: string) => {
    let setCategory = "";
    switch (category) {
      case "community":
        setCategory = "Сообщество";
        break;
      case "development":
        setCategory = "Разработка";
        break;
      case "functions":
        setCategory = "Функции";
        break;
      case "safety":
        setCategory = "Безопасность";
        break;
      default:
        setCategory = "";
    }
    return setCategory;
  };

  const handleScrollToTop = () => {
    setTimeout(() => {
      if (bodyWrapperRef.current) {
        bodyWrapperRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("blog_state");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    if (!data || !Array.isArray(data.renderData.blog)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setBlog(data.renderData.blog);

    setCurrentPage(getCurrentPage);
    setTotalPages(data.renderData.totalPages);

    handleScrollToTop();

    const updatedState = { ...blog_state, page: getCurrentPage, category: "" };
    sessionStorage.setItem("blog_state", JSON.stringify(updatedState));

    return () => {
      if (
        !window.location.pathname.startsWith("/blog/") &&
        !window.location.pathname.startsWith("/category/")
      ) {
        sessionStorage.removeItem("blog_state");
      }
    };
  }, [data]);

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
    <div className={styles["body-wrapper"]} ref={bodyWrapperRef}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />

      <main className={styles["discord-blog-container"]}>
        <section className={styles["featured-section"]}>
          {blog && blog.length > 0 ? (
            // <article className={styles["featured-card"]}>
            //     <div className={styles["featured-image"]}>
            //         <div className={styles["img-placeholder"]}></div>
            //     </div>
            //     <div className={styles["featured-content"]}>
            //         <span className={styles["category"]}>Обновление</span>
            //         <h2>Встречайте глобальный апгрейд интерфейса и новые фичи</h2>
            //         <p>Мы полностью переработали логику работы с динамическими макетами, добавили поддержку кастомных шейдеров и ускорили рендеринг страниц на мобильных устройствах в два раза. Читайте подробный разбор изменений.</p>
            //         <div className={styles["card-footer"]}>
            //             <span className={styles["date"]}>16 июля, 2026</span>
            //             <a href="#" className={styles["read-more-btn"]}>Читать статью</a>
            //         </div>
            //     </div>
            // </article>

            <article className={styles["featured-card"]}>
              <div className={styles["featured-image"]}>
                {blog[0].cover.length > 0 ? (
                  <img
                    src={`${api.API_BASE_URL}/${blog[0].cover}`}
                    loading="lazy"
                    className={styles["img-placeholder"]}
                  />
                ) : (
                  <div
                    className={`${styles["img-placeholder"]} ${styles[blog[0].category]}`}
                  ></div>
                )}
              </div>
              <div className={styles["featured-content"]}>
                <span className={styles["category"]}>
                  {categorySettings(blog[0].category)}
                </span>
                <h2>
                  {blog[0].title.length > 62
                    ? blog[0].title.slice(0, 62) + "..."
                    : blog[0].title}
                </h2>
                <p>
                  {blog[0].description.length > 240
                    ? blog[0].description.slice(0, 240) + "..."
                    : blog[0].description}
                </p>
                <div className={styles["card-footer"]}>
                  <span className={styles["date"]}>
                    {dateSettings(blog[0].date)}
                  </span>
                  <Link
                    to={`/blog/${blog[0].id}`}
                    className={styles["read-more-btn"]}
                  >
                    Читать статью
                  </Link>
                </div>
              </div>
            </article>
          ) : null}
        </section>

        <section className={styles["posts-grid-section"]}>
          {blog && blog.length > 0 ? (
            blog.slice(1).map((bd, index) => {
              return (
                <article key={index} className={styles["grid-card"]}>
                  <div className={styles["card-image"]}>
                    {bd.cover.length > 0 ? (
                      <img
                        src={`${api.API_BASE_URL}/${bd.cover}`}
                        loading="lazy"
                        className={styles["img-placeholder"]}
                      />
                    ) : (
                      <div
                        className={`${styles["img-placeholder"]} ${styles[bd.category]}`}
                      ></div>
                    )}
                  </div>
                  <div className={styles["card-body"]}>
                    <span className={styles["category"]}>
                      {categorySettings(bd.category)}
                    </span>
                    <h3>
                      {bd.title.length > 63
                        ? bd.title.slice(0, 63) + "..."
                        : bd.title}
                    </h3>
                    <p>
                      {bd.description.length > 110
                        ? bd.description.slice(0, 110) + "..."
                        : bd.description}
                    </p>
                    <div className={styles["card-footer"]}>
                      <span className={styles["date"]}>
                        {dateSettings(bd.date)}
                      </span>
                      <Link
                        to={`/blog/${bd.id}`}
                        className={`${styles["read-more-btn"]} ${styles["small"]}`}
                      >
                        Читать статью
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className={styles["category-not-found"]}>
              <div className={styles["grid-card"]}>
                <div className={styles["card-body"]}>
                  <h3>Что-то пошло не так!</h3>
                  <p>
                    На данный момент информация в этой категории отсутствует.
                    Попробуйте поискать её в других категориях.
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link
                      to="/category/community"
                      className={`${styles["read-more-btn"]} ${styles["small"]}`}
                    >
                      Сообщество
                    </Link>
                    <Link
                      to="/category/development"
                      className={`${styles["read-more-btn"]} ${styles["small"]}`}
                    >
                      Разработка
                    </Link>
                    <Link
                      to="/category/functions"
                      className={`${styles["read-more-btn"]} ${styles["small"]}`}
                    >
                      Функции
                    </Link>
                    <Link
                      to="/category/safety"
                      className={`${styles["read-more-btn"]} ${styles["small"]}`}
                    >
                      Безопасность
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*<article className={styles["grid-card"]}>*/}
          {/*    <div className={styles["card-image"]}>*/}
          {/*         <div className={styles["img-placeholder"]} style={{ background: "linear-gradient(135deg, #0066ff, #ff007f)" }}></div>*/}
          {/*    </div>*/}
          {/*    <div className={styles["card-body"]}>*/}
          {/*        <span className={styles["category"]}>CSS</span>*/}
          {/*        <h3>Погружение в Dynamic Viewport Units</h3>*/}
          {/*        <p>Как единицы измерения вроде dvh и dvw помогают решать старые проблемы с отображением сайтов.</p>*/}
          {/*        <div className={styles["card-footer"]}>*/}
          {/*            <span className={styles["date"]}>14 июля, 2026</span>*/}
          {/*            <a href="#" className={`${styles["read-more-btn"]} ${styles["small"]}`}>Читать статью</a>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*</article>*/}

          {/*<article className={styles["grid-card"]}>*/}
          {/*    <div className={styles["card-image"]}>*/}
          {/*        <div*/}
          {/*            className={styles["img-placeholder"]}*/}
          {/*            style={{ background: "linear-gradient(135deg, #7289da, #150931)" }}*/}
          {/*        ></div>*/}
          {/*    </div>*/}
          {/*    <div className={styles["card-body"]}>*/}
          {/*        <span className={styles["category"]}>Дизайн</span>*/}
          {/*        <h3>Магия сложных градиентов в современном UI</h3>*/}
          {/*        <p>Создаем глубокие космические фоны с помощью многослойных радиальных градиентов.</p>*/}
          {/*        <div className={styles["card-footer"]}>*/}
          {/*            <span className={styles["date"]}>10 июля, 2026</span>*/}
          {/*            <a href="#" className={`${styles["read-more-btn"]} ${styles["small"]}`}>Читать статью</a>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*</article>*/}

          {/*<article className={styles["grid-card"]}>*/}
          {/*    <div className={styles["card-image"]}>*/}
          {/*        <div*/}
          {/*            className={styles["img-placeholder"]}*/}
          {/*            style={{ background: "linear-gradient(135deg, #ff007f, #0b0518)" }}*/}
          {/*        ></div>*/}
          {/*    </div>*/}
          {/*    <div className={styles["card-body"]}>*/}
          {/*        <span className={styles["category"]}>Разработка</span>*/}
          {/*        <h3>Нативные веб-компоненты в 2026</h3>*/}
          {/*        <p>Стоит ли отказываться от тяжелых фреймворков в пользу стандартных решений браузера?</p>*/}
          {/*        <div className={styles["card-footer"]}>*/}
          {/*            <span className={styles["date"]}>05 июля, 2026</span>*/}
          {/*            <a href="#" className={`${styles["read-more-btn"]} ${styles["small"]}`}>Читать статью</a>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*</article>*/}
        </section>

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </main>

      <Footer links={footerLinks} />
    </div>
  );
};
