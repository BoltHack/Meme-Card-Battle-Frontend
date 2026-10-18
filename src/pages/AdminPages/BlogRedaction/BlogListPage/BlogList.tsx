import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import styles from "./Card.BlogList.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

import { Pagination } from "../../../../components/Pagination/Pagination.tsx";

import toast from "react-hot-toast";

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

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const BlogListPage = () => {
  const navigate = useNavigate();
  const bodyWrapperRef = useRef<HTMLDivElement | null>(null);

  const [articleType, setArticleType] = useState<string | "">("blog");

  const [blog, setBlog] = useState<BlogPost[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [searchParams] = useSearchParams();
  const getCurrentPage = Number(searchParams.get("page")) || 1;

  const blog_state = JSON.parse(sessionStorage.getItem("blog_state") || "{}");

  const initialBlogState = {
    author: "",
    title: "",
    description: "",
    cover: "",
    category: "",
    date: "",
    id: "",
  };
  const [removeBlogData, setRemoveBlogData] = useState(initialBlogState);

  const { contentData, contentLoading, contentError } =
    useContentRender<BlogResponse>(
      `/admin/article/${articleType}/list?page=${currentPage}`,
    );

  const handleRemoveBlog = async (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `/admin/blog/${removeBlogData.id}/delete`,
        {
          withCredentials: true,
        },
      );

      console.log("Публикация успешно удалена:", response.data);

      const updatedBlogList = blog.filter((item) => item.id !== id);
      setBlog(updatedBlogList);
      setRemoveBlogData(initialBlogState);

      toast.success(response.data.success);
      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  };

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
      case "news":
        setCategory = "Новости";
        break;
      default:
        setCategory = "";
    }
    return setCategory;
  };

  const handleChangeArticleType = (article: string) => {
    navigate("?page=1");
    setArticleType(article);
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
    if (!contentData || !Array.isArray(contentData.renderData.blog)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    setBlog(contentData.renderData.blog);

    setCurrentPage(getCurrentPage);
    setTotalPages(contentData.renderData.totalPages);

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
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="blog-list-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Список публикаций</h1>
        <p>Просматривайте, редактируйте и удаляйте публикации.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("blog:settings")}
      >
        ← Назад
      </a>

      <main className={styles["discord-blog-container"]}>
        <div className={styles["blog-articles"]}>
          <button
            onClick={() => handleChangeArticleType("blog")}
            className={`${styles["blog-article-btn"]} ${articleType === "blog" ? styles["active"] : ""}`}
          >
            Блог
          </button>
          <button
            onClick={() => handleChangeArticleType("news")}
            className={`${styles["blog-article-btn"]} ${articleType === "news" ? styles["active"] : ""}`}
          >
            Новости
          </button>
        </div>
        <section className={styles["featured-section"]}>
          {blog && blog.length > 0 ? (
            <article className={styles["featured-card"]}>
              <div className={styles["featured-image"]}>
                {blog[0].cover.length > 0 ? (
                  <img
                    src={`/${blog[0].cover}`}
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
                  <a
                    href={`/blog/${blog[0].id}`}
                    target="_blank"
                    className={styles["read-more-btn"]}
                  >
                    Читать статью
                  </a>
                </div>
                <ul className={styles["actions-menu"]}>
                  <li className={styles["actions-menu-btn"]}>
                    <button
                      type="button"
                      onClick={() =>
                        adminNavigator.handleChangeTab(
                          `blog:edit:id_${blog[0].id}`,
                        )
                      }
                    >
                      Редактировать
                    </button>
                  </li>
                  <li className={styles["remove-blog-btn"]}>
                    <button
                      type="button"
                      onClick={() =>
                        setRemoveBlogData({
                          id: blog[0].id,
                          author: blog[0].author,
                          cover: blog[0].cover,
                          category: blog[0].category,
                          title: blog[0].title.slice(0, 50),
                          description: blog[0].description.slice(0, 50),
                          date: dateSettings(blog[0].date),
                        })
                      }
                    >
                      Удалить
                    </button>
                  </li>
                </ul>
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
                        src={`/${bd.cover}`}
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
                      <a
                        href={`/blog/${bd.id}`}
                        target="_blank"
                        className={`${styles["read-more-btn"]} ${styles["small"]}`}
                      >
                        Читать статью
                      </a>
                    </div>
                    <ul className={styles["actions-menu"]}>
                      <li className={styles["actions-menu-btn"]}>
                        <button
                          type="button"
                          onClick={() =>
                            adminNavigator.handleChangeTab(
                              `blog:edit:id_${bd.id}`,
                            )
                          }
                        >
                          Редактировать
                        </button>
                      </li>
                      <li className={styles["remove-blog-btn"]}>
                        <button
                          type="button"
                          onClick={() =>
                            setRemoveBlogData({
                              id: bd.id,
                              author: bd.author,
                              cover: bd.cover,
                              category: bd.category,
                              title: bd.title.slice(0, 50),
                              description: bd.description.slice(0, 50),
                              date: dateSettings(bd.date),
                            })
                          }
                        >
                          Удалить
                        </button>
                      </li>
                    </ul>
                  </div>
                </article>
              );
            })
          ) : (
            <div className={styles["category-not-found"]}>
              <div className={styles["grid-card"]}>
                <div className={styles["card-body"]}>
                  <h3>Что-то пошло не так!</h3>
                  <p>Массив данных пуст</p>
                </div>
              </div>
            </div>
          )}
        </section>

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </main>

      {removeBlogData.id && (
        <div className={styles["menu-wrapper"]}>
          <div className={styles["action-menu"]}>
            <h2>Удалить публикацию</h2>
            <div className={styles["action-options"]}>
              <article className={styles["grid-card"]}>
                <div className={styles["card-image"]}>
                  {removeBlogData.cover.length > 0 ? (
                    <img
                      src={`/${removeBlogData.cover}`}
                      loading="lazy"
                      className={styles["img-placeholder"]}
                    />
                  ) : (
                    <div
                      className={`${styles["img-placeholder"]} ${styles[removeBlogData.category]}`}
                    ></div>
                  )}
                </div>
                <div className={styles["card-body"]}>
                  <span className={styles["category"]}>
                    {removeBlogData.category}
                  </span>
                  <h3>
                    {removeBlogData.title.length > 30
                      ? removeBlogData.title.slice(0, 30) + "..."
                      : removeBlogData.title}
                  </h3>
                  <p>
                    {removeBlogData.description.length > 45
                      ? removeBlogData.description.slice(0, 45) + "..."
                      : removeBlogData.description}
                  </p>
                  <div className={styles["card-footer"]}>
                    <span className={styles["date"]}>
                      {removeBlogData.date}
                    </span>
                  </div>
                </div>
              </article>
            </div>
            <br />
            <div className={styles["action-menu-btn"]}>
              <button onClick={(e) => handleRemoveBlog(removeBlogData.id, e)}>
                <span>Удалить</span>
              </button>
              <button onClick={() => setRemoveBlogData(initialBlogState)}>
                <span>Отмена</span>
              </button>
            </div>
            <br />
          </div>
        </div>
      )}
    </div>
  );
};
