import { useOutletContext, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import styles from "./Card.HelpCenter.module.css";

import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../components/LoadingPage/Loading.tsx";

import { Footer } from "../../components/Footer/Footer.tsx";
import { Header } from "../../components/Header/Header.tsx";

interface PlayerData {
  name: string;
  id: string;
  renderData: any;
}

interface CategoryData {
  // title: string;
  // summary: string;
  // icon: { svg: string; color: string; filter: string };
  // link: { title: string; href: string };
  title: string;
  summary: string;
  color: string;
  filter: string;
  link_title: string;
  link_href: string;
  link_path: string;
}

interface TitleSettings {
  title: string;
}

interface FooterLinksContext {
  footerLinks?: any;
}

export const HelpCenterPage = ({ title }: TitleSettings) => {
  const { footerLinks } = useOutletContext<FooterLinksContext>() ?? {
    footerLinks: [],
  };

  const navigate = useNavigate();

  // const [category, setCategory] = useState<CategoryData | null>(null);
  const [categoriesList, setCategoriesList] = useState<CategoryData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchURL, setSearchURL] = useState("");

  const categoryFound = useRef<boolean | false>(false);
  const anotherCategoryFound = useRef<boolean | false>(false);

  // const searchSettings = JSON.parse(sessionStorage.getItem('searchSettings') || '{}');
  const searchSettings = sessionStorage.getItem("searchSettings");

  const { data, loading, error, socket } =
    usePageRender<PlayerData>(`/api/help-center`);

  const handleSearchCategory = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  const handleSearchCategoryKeyDown = (e: any, value: string) => {
    if ((e.key === "Enter" || e.keyCode === 13) && value.length > 0) {
      searchCategory(value);
    }
  };

  const searchCategory = (value: string) => {
    if (value.length < 1) return;

    categoryFound.current = false;
    anotherCategoryFound.current = false;

    const searchValue = value.toLowerCase();

    const currentUrl = new URL(window.location.href);

    const searchCategory = document.querySelectorAll(
      "#categoriesGrid section",
    ) as NodeListOf<HTMLElement>;

    currentUrl.searchParams.set("category", searchValue);
    window.history.replaceState({}, "", currentUrl);

    Array.from(searchCategory).forEach((category: HTMLElement) => {
      const titleElement = category.querySelector("h3");

      const searchTitle = titleElement?.textContent?.toLowerCase() ?? "";

      if (searchTitle.includes(searchValue)) {
        categoryFound.current = true;
        anotherCategoryFound.current = false;
        category.style.display = "block";
      } else {
        category.style.display = "none";
      }

      const regex = new RegExp(searchTitle, "i");
      // const regex = new RegExp(searchTitle, 'g');

      if (!categoryFound.current && regex.test(searchValue)) {
        categoryFound.current = true;
        anotherCategoryFound.current = true;

        category.style.display = "block";
      }
      // else {
      //     category.style.display = "none";
      // }
    });

    sessionStorage.setItem("searchSettings", searchValue);
    setSearchURL(searchValue);
    setSearchInput("");
  };

  const clearSearchCategory = () => {
    setSearchInput("");
    setSearchURL("");
    sessionStorage.removeItem("searchSettings");
    categoryFound.current = false;
    anotherCategoryFound.current = false;

    const categoriesGrid = document.querySelectorAll(
      "#categoriesGrid section",
    ) as NodeListOf<HTMLElement>;
    categoriesGrid.forEach((cs: HTMLElement) => {
      cs.style.display = "block";
    });

    navigate("/help-center");
  };

  useEffect(() => {
    const searchSettingsCheck = setTimeout(() => {
      if (searchSettings) {
        searchCategory(searchSettings);
        return;
      }
    }, 100);

    return () => {
      clearInterval(searchSettingsCheck);
      if (!window.location.pathname.includes("/help-center")) {
        setSearchInput("");
        setSearchURL("");
        sessionStorage.removeItem("searchSettings");
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && data?.renderData && data.renderData?.length > 0) {
      const formattedCategories = data?.renderData.map((cat: any) => ({
        // title: cat.title || "",
        // summary: cat.summary || "",
        // icon: {
        //   svg: cat.icon?.svg || "",
        //   color: cat.icon?.color || "",
        //   filter: cat.icon?.filter || "",
        // },
        // link: {
        //   title: cat.link?.title || "",
        //   href: cat.link?.href || "",
        // },
        title: cat.title,
        summary: cat.summary,
        color: cat.color,
        filter: cat.flter,
        link_title: cat.link_title,
        link_href: cat.link_href,
        link_path: cat.link_path,
      }));

      setCategoriesList(formattedCategories);
    }
  }, [loading, data]);

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

      <header className={styles["help-header"]}>
        <div className={styles["container"]}>
          <h1>Чем мы можем помочь?</h1>
          <div className={styles["search-box"]}>
            <input
              type="text"
              placeholder="Поиск статей, инструкций и ответов..."
              onChange={handleSearchCategory}
              value={searchInput}
              onKeyDown={(e) =>
                searchInput.length > 0
                  ? handleSearchCategoryKeyDown(e, searchInput)
                  : null
              }
            />
            <button
              type="button"
              onClick={() =>
                searchInput.length > 0 ? searchCategory(searchInput) : null
              }
            >
              Найти
            </button>
          </div>
        </div>
      </header>

      <main className={styles["container"]}>
        {searchURL ? (
          <div className={styles["search-result-container"]}>
            <p
              className={styles["search-result-back"]}
              onClick={clearSearchCategory}
            >
              Справочный центр
            </p>
            <div className={styles["search-result-slash"]}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="m9.216 7.619 4.204 4.204a.25.25 0 0 1 0 .354l-4.204 4.204a.75.75 0 0 0 1.06 1.061l4.205-4.204a1.75 1.75 0 0 0 0-2.475l-4.204-4.205a.75.75 0 0 0-1.061 1.06"
                ></path>
              </svg>
            </div>
            <p className={styles["search-result"]}>{searchURL}</p>
          </div>
        ) : null}

        {anotherCategoryFound.current ? (
          <div className={styles["another-category-found"]}>
            <p>
              По запросу <strong>"{searchURL}"</strong> ничего не было найдено,
              но эти разделы могут помочь найти альтернативу:
            </p>
            {/*<span>Мы не нашли точного совпадения, но эти разделы могут помочь найти альтернативу:</span>*/}
          </div>
        ) : null}

        <div className={styles["categories-grid"]} id="categoriesGrid">
          {categoriesList && categoriesList.length > 0
            ? categoriesList.map((cat, index) => {
                return (
                  <section key={index} className={styles["category-card"]}>
                    <div className={`${styles["card-icon"]}`}>
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          color: cat.icon?.color || "inherit",
                          filter: cat.icon?.filter || "none",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: cat.icon?.svg || "",
                        }}
                      ></svg> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-message-circle-question-mark preview-icon"
                        style={{
                          color: cat.color || "inherit",
                          filter: cat.filter
                            ? // ? `drop-shadow(0 0 8px rgb(from ${cat.filter} r g b / 60%))`
                              `drop-shadow(0px 0px 8px rgb(from ${cat.filter} r g b / 60%))`
                            : "none",
                        }}
                      >
                        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                    </div>
                    <h3>{cat?.title}</h3>
                    <p>{cat?.summary}</p>
                    {cat.link_path.length > 0 ? (
                      <Link
                        to={`/help-center/${cat.link_path}`}
                        className={styles["card-link"]}
                      >
                        {cat.link_title} →
                      </Link>
                    ) : (
                      <Link to={cat.link_href} className={styles["card-link"]}>
                        {cat.link_title} →
                      </Link>
                    )}
                  </section>
                );
              })
            : null}

          {/*<div className={styles["category-card"]}>*/}
          {/*    <div className={`${styles["card-icon"]} ${styles["icon-purple"]}`}>*/}
          {/*        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">*/}
          {/*            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>*/}
          {/*        </svg>*/}
          {/*    </div>*/}
          {/*    <h3>Интеграции и API</h3>*/}
          {/*    <p>Настройка сторонних сервисов, плагинов и работа с API.</p>*/}
          {/*    <a href="#" className={styles["card-link"]}>Для разработчиков →</a>*/}
          {/*</div>*/}
        </div>

        {!categoryFound.current && searchURL.length > 0 ? (
          <div className={styles["search-result-error"]}>
            <p>
              По запросу <strong>"{searchURL}"</strong> ничего не было найдено.
            </p>
          </div>
        ) : null}

        <section className={styles["faq-section"]}>
          <h2>Популярные вопросы</h2>
          <ul className={styles["faq-list"]}>
            <li>
              <a href="#">
                Как восстановить доступ к аккаунту, если забыл пароль?
              </a>
            </li>
            <li>
              <a href="#">Что значит ошибка 503?</a>
            </li>
            <li>
              <a href="#">Что делать, если при нажатии на "ИГРАТЬ" игра не запускается?</a>
            </li>
          </ul>
        </section>
      </main>

      <div className={styles["help-footer"]}>
        <div className={styles["container"]}>
          <p>
            Не нашли ответ? <a href="#">Связаться с поддержкой</a>
          </p>
        </div>
      </div>

      <Footer links={footerLinks} />
    </div>
  );
};
