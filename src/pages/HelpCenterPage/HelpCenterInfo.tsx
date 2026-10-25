import { Link, useOutletContext, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

// import styles from "./Card.HelpCenter.module.css";
// import styles from "../DocumentsPage/Card.Documents.module.css";
import styles from "./Card.HelpCenterInfo.module.css";

import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../components/LoadingPage/Loading.tsx";

import { Footer } from "../../components/Footer/Footer.tsx";
import { Header } from "../../components/Header/Header.tsx";

interface Params {
  help_request: string;
}

interface ArticleNavigationItem {
  id: string;
  article: string | null;
}

interface FooterLinksContext {
  footerLinks?: any;
}

export const HelpCenterInfoPage = () => {
  const { footerLinks } = useOutletContext<FooterLinksContext>() ?? {
    footerLinks: [],
  };

  const { help_request } = useParams<{ type: string }>() as Params;

  const articleSectionsContainer = useRef<HTMLDivElement>(null);
  const [articleList, setArticleList] = useState<ArticleNavigationItem[]>([]);
  // const [articleList, setArticleList] = useState<ArticlesData | []>([]);

  const { data, loading, error, socket } = usePageRender(
    `/api/help-center/${help_request}`,
  );

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

          tempArticles.push({
            id: sectionId,
            article: headingText,
          });
        });

        setArticleList(tempArticles);
      }, 0);

      console.log("data?.renderData", data?.renderData);
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
        <title>{data?.renderData.title}</title>
      </Helmet>

      <Header />

      {/*<div className={styles["parallax-body"]}></div>*/}

      <div className={styles["container"]}>
        <Link to="/help-center" className={styles["back-btn"]}>Справочный центр</Link>
        <article className={styles["article-header"]}>
          <h1>{data?.renderData.title}</h1>
        </article>

        <div className={styles["content-container"]}>
          <article
            className={styles["article-main"]}
            ref={articleSectionsContainer}
          >
            <header>
              {/* <h1>{data?.renderData.title}</h1> */}
              <h3>{data?.renderData.summary}</h3>
              {/* <p className={styles["subtitle"]}>{data?.renderData.summary}</p> */}
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
                  <a href={`#${item.id}`}>{item.article}</a>
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
