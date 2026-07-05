import { Helmet } from "react-helmet-async";
import ReactMarkdown from 'react-markdown';

import styles from './Card.Rules.module.css';

import api from "../../api/api.ts";

import usePageRender from "../../tools/PageRender.ts";
import { LoadingPage } from "../LoadingPage/Loading.tsx";

import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";
import { Header } from "../../tools/PageTools/header_footer/Header.tsx";
import {useEffect, useRef, useState} from "react";
import {ErrorPage} from "../ErrorPage/Error.tsx";

interface PlayerData {
    name: string;
    id: string;
}

export const PrivacyPolicy = ({ title }) => {

    const articleSectionsContainer= useRef(null);
    const [articleList, setArticleList] = useState([]);

    const { data, loading, error, socket } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/api/privacy-policy`
    );

    useEffect(() => {
        if (!loading && data?.content && articleSectionsContainer.current) {

            setTimeout(() => {
                if (!articleSectionsContainer.current) return;

                const h2Elements = articleSectionsContainer.current.querySelectorAll("h2");

                const tempArticles: Array<{ id: string; article: string | null }> = [];

                h2Elements.forEach((h2, index) => {
                    const headingText = h2.textContent;
                    const sectionId = (index + 1).toString();

                    h2.id = sectionId;

                    tempArticles.push({
                        id: sectionId,
                        article: headingText
                    });
                });

                setArticleList(tempArticles);

            }, 0)

        }
    }, [loading, data?.content]);

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage error={error} />

    return (
        <div className={styles["body-wrapper"]}>

            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Header />

            {/*<div className={styles["parallax-body"]}></div>*/}

            <div className={styles["container"]}>

                <article className={styles["article-main"]} ref={articleSectionsContainer}>

                    <header>
                        <h1>Политика конфиденциальности</h1>
                        <p className={styles["subtitle"]}>Последнее обновление: 22 июня 2026 г.</p>
                    </header>

                    {data.content && data.content.length > 0 ? (
                        <section className={styles["article-section"]}>
                            <ReactMarkdown>{data.content}</ReactMarkdown>
                        </section>
                    ) : null}

                </article>

                <article className={styles["article-tools"]}>

                    <header>
                        <h3>В этой статье</h3>
                    </header>

                    <br/>

                    {articleList && articleList.length > 0 ? (
                        articleList.map((item) => (
                            <section key={item.id}>
                                <a href={`#${item.id}`}>{item.article}</a>
                            </section>
                        ))
                    ): null}

                </article>

            </div>

            <Footer/>

        </div>
    );
};