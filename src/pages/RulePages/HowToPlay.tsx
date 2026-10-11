import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";

import styles from "./Card.Rules.module.css";

import api from "../../api/api.ts";
import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../../сomponents/ErrorPage/Error.tsx";
import { LoadingPage } from "../../сomponents/LoadingPage/Loading.tsx";

import { Footer } from "../../сomponents/Footer/Footer.tsx";
import { Header } from "../../сomponents/Header/Header.tsx";

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

interface FooterLinksContext {
  footerLinks?: any;
}

export const HowToPlayPage = ({ title }: TitleSettings) => {
  const { footerLinks } = useOutletContext<FooterLinksContext>() ?? {
    footerLinks: [],
  };

  const articleSectionsContainer = useRef<HTMLDivElement>(null);
  const [articleList, setArticleList] = useState<ArticleNavigationItem[]>([]);
  // const [articleList, setArticleList] = useState<ArticlesData | []>([]);

  const { data, loading, error, socket } = usePageRender<ArticlesData>(
    `${api.API_BASE_URL}/api/how-to-play`,
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

      {/*<div className={styles["parallax-body"]}></div>*/}

      <div className={styles["container"]}>
        {/*<article className={styles["article-header"]}>*/}
        {/*    <h1>Как играть?</h1>*/}
        {/*</article>*/}

        <div className={styles["content-container"]}>
          <article
            className={styles["article-main"]}
            ref={articleSectionsContainer}
          >
            <header>
              <h1>Как играть в MEME CARD BATTLE</h1>
              <p className={styles["subtitle"]}>
                Добро пожаловать в карточную стратегию, где исход битвы решают
                не деньги, а ваш тактический расчет! Здесь нет слепого везения —
                только чистый блеф, холодный расчет и синергия карт.Ниже
                представлены базовые правила, которые помогут вам быстро
                освоиться на поле боя.
              </p>
            </header>

            {data?.renderData && data?.renderData.length > 0 ? (
              <section className={styles["article-section"]}>
                <ReactMarkdown>{data?.renderData}</ReactMarkdown>
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

      <Footer links={footerLinks} />
    </div>
  );
};
