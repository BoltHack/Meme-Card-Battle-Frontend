import { useOutletContext, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

import styles from "./Card.Documents.module.css";

import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../components/LoadingPage/Loading.tsx";

import { Footer } from "../../components/Footer/Footer.tsx";
import { Header } from "../../components/Header/Header.tsx";

interface Params {
  document: string;
}

interface ArticleNavigationItem {
  id: string;
  article: string | null;
}

interface FooterLinksContext {
  footerLinks?: any;
}

export const DocumentsPage = () => {
  const { footerLinks } = useOutletContext<FooterLinksContext>() ?? {
    footerLinks: [],
  };

  const { document } = useParams<{ type: string }>() as Params;

  const articleSectionsContainer = useRef<HTMLDivElement>(null);
  const [articleList, setArticleList] = useState<ArticleNavigationItem[]>([]);

  const { data, loading, error, socket } = usePageRender(
    `/api/documents/${document}`,
  );

  const dateSettings = (date: string) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour12: false,
    });
  };

  const handleMarkArticle = (articleId: string) => {
    const article = articleList.find(
      (al) => al.id.toString() === articleId.toString(),
    );
    if (article) {
      const getElement = articleSectionsContainer.current?.querySelector(
        `#${CSS.escape(articleId)}`
      );
      
      setTimeout(() => {
        getElement?.classList.add(styles["article-marker"]);
      }, 500);
      
      setTimeout(() => {
        getElement?.classList.remove(styles["article-marker"]);
      }, 3000);
    }
  };

  useEffect(() => {
    if (!loading && data?.renderData && articleSectionsContainer.current) {
      setTimeout(() => {
        if (!articleSectionsContainer.current) return;

        const h2Elements =
          articleSectionsContainer.current.querySelectorAll("h2");

        const tempArticles: Array<{ id: string; article: string | null }> = [];

        h2Elements.forEach((h2: HTMLHeadingElement, index: number) => {
          const headingText = h2.textContent;
          const sectionId = (index + 1).toString();

          h2.id = sectionId;
          // h2.onclick = () => {
          //   handleMarkArticle(h2.id);
          // };

          tempArticles.push({
            id: sectionId,
            article: headingText,
          });
        });

        setArticleList(tempArticles);
      }, 0);
    }
  }, [loading, data]);

  // useEffect(() => {
  //   if (articleList.length < 1) return;

  //   console.log("articleList", articleList);

  // }, [articleList]);

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
        <title>{data?.renderData.title} | MCB</title>
      </Helmet>

      <Header />

      <div className={styles["container"]}>
        {/* <article className={styles["article-header"]}>
          <h1>{data?.renderData.title}</h1>
        </article> */}
        <div className={styles["content-container"]}>
          <article
            className={styles["article-main"]}
            ref={articleSectionsContainer}
          >
            <header>
              <h1>{data?.renderData.title}</h1>
              <div className={styles["subtitle-container"]}>
                <span className={styles["subtitle"]}>
                  {data?.renderData.summary}
                </span>
                <p className={styles["subtitle-date"]}>
                  Последнее обновление: {dateSettings(data?.renderData.date)}
                </p>
              </div>
            </header>

            {data?.renderData.content && data?.renderData.content.length > 0 ? (
              <section className={styles["article-section"]}>
                <Markdown>{data?.renderData.content}</Markdown>
              </section>
            ) : null}
          </article>

          {articleList && articleList.length > 0 ? (
            <article className={styles["article-tools"]}>
              <header>
                <h3>В этой статье</h3>
              </header>

              <br />

              {articleList.map((item) => (
                <section key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => handleMarkArticle(item.id)}
                  >
                    {item.article}
                  </a>
                </section>
              ))}
            </article>
          ) : null}
        </div>
      </div>

      <Footer links={footerLinks} />
    </div>
  );
};
