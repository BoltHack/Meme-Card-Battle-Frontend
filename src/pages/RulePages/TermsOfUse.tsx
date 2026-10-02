import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";

import styles from "./Card.Rules.module.css";

import api from "../../api/api.ts";

import usePageRender from "../../tools/PageRender.ts";
import { LoadingPage } from "../LoadingPage/Loading.tsx";
import { ErrorPage } from "../ErrorPage/Error.tsx";

import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";
import { Header } from "../../tools/PageTools/header_footer/Header.tsx";
import useContentRender from "../../tools/ContentRender.ts";

interface ArticlesData {
  renderData: string;
}

interface ArticleNavigationItem {
  id: string;
  article: string | null;
}

interface TitleSettings {
  title: string;
}

export const TermsOfUsePage = ({ title }: TitleSettings) => {
  const articleSectionsContainer = useRef<HTMLDivElement>(null);
  const [articleList, setArticleList] = useState<ArticleNavigationItem[]>([]);

  const { contentData, contentLoading, contentError } =
    useContentRender<ArticlesData>(`${api.API_BASE_URL}/api/terms-of-use`);

  useEffect(() => {
    console.log("contentData", contentData);

    if (
      !contentLoading &&
      contentData?.renderData &&
      articleSectionsContainer.current
    ) {
      setTimeout(() => {
        if (!articleSectionsContainer.current) return;

        const h2Elements =
          articleSectionsContainer.current.querySelectorAll("h2");

        const tempArticles: Array<{ id: string; article: string | null }> = [];

        h2Elements.forEach((h2: HTMLHeadingElement, index: number) => {
          const headingText = h2.textContent;
          const sectionId = (index + 1).toString();

          h2.id = sectionId;

          tempArticles.push({
            id: sectionId,
            article: headingText,
          });
        });

        setArticleList(tempArticles);
      }, 0);
    }
  }, [contentLoading, contentData?.renderData]);

  if (contentLoading) return <LoadingPage />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />

      {/*<div className={styles["parallax-body"]}></div>*/}

      <div className={styles["container"]}>
        {/*<article className={styles["article-header"]}>*/}
        {/*    <h1>Условия использования</h1>*/}
        {/*</article>*/}

        <div className={styles["content-container"]}>
          <article
            className={styles["article-main"]}
            ref={articleSectionsContainer}
          >
            <header>
              <h1>Условия использования</h1>
              <p className={styles["subtitle"]}>
                Последнее обновление: 22 июня 2026 г.
              </p>
            </header>

            {contentData?.renderData && contentData?.renderData.length > 0 ? (
              <section className={styles["article-section"]}>
                <ReactMarkdown>{contentData?.renderData}</ReactMarkdown>
              </section>
            ) : null}
          </article>

          <article className={styles["article-tools"]}>
            <header>
              <h3>В этой статье</h3>
            </header>

            <br />

            {articleList && articleList.length > 0
              ? articleList.map((item) => (
                  <section key={item.id}>
                    <a href={`#${item.id}`}>{item.article}</a>
                  </section>
                ))
              : null}
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
};
