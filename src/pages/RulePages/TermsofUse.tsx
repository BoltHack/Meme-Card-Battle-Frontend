import { Helmet } from "react-helmet-async";

import styles from './Card.Rules.module.css';

import api from "../../api/api.ts";

import usePageRender from "../../tools/PageRender.ts";
import { LoadingPage } from "../LoadingPage/Loading.tsx";

import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";
import { Header } from "../../tools/PageTools/header_footer/Header.tsx";
import {useEffect, useRef, useState} from "react";

interface PlayerData {
    name: string;
    id: string;
}

export const TermsOfUsePage = ({ title }) => {

    const articleSectionsContainer= useRef(null);
    const [articleList, setArticleList] = useState([]);

    const { data, loading, error, socket } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/api/terms-of-use`
    );

    useEffect(() => {
        if (articleSectionsContainer.current) {
            const sections = articleSectionsContainer.current.querySelectorAll("section");

            const tempArticles = [];

            sections.forEach((s, index) => {
                const h2Element = s.querySelector("h2");

                if (h2Element) {
                    const headingText = h2Element.textContent;
                    const sectionId = (index + 1).toString();

                    s.id = sectionId;

                    tempArticles.push({
                        id: sectionId,
                        article: headingText
                    })
                }
            });
            setArticleList(tempArticles);
        }
    }, [loading]);

    if (loading) return <LoadingPage />

    return (
        <div className={styles["body-wrapper"]}>

            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Header name={data.name} />

            {/*<div className={styles["parallax-body"]}></div>*/}

            <div className={styles["container"]}>

                <article className={styles["article-main"]} ref={articleSectionsContainer}>

                    <header>
                        <h1>Условия использования</h1>
                        <p className={styles["subtitle"]}>Последнее обновление: 22 июня 2026 г.</p>
                    </header>

                    <section className={styles["article-section"]}>
                        <h2>1. Общие положения</h2>
                        <p>Добро пожаловать на наш ресурс. Получая доступ к данному сайту или используя его функции, вы автоматически соглашаетесь с настоящими Условиями использования. Если вы не согласны с какими-либо пунктами, пожалуйста, прекратите использование сайта.</p>
                    </section>

                    <section className={styles["article-section"]}>
                        <h2>2. Интеллектуальная собственность</h2>
                        <p>Весь контент, представленный на страницах проекта, включая текстовые материалы, элементы графического дизайна, логотипы и программный код, является собственностью правообладателей и защищен законами об авторском праве.</p>
                    </section>

                    <section className={styles["article-section"]}>
                        <h2>3. Ограничение ответственности</h2>
                        <p>Мы стремимся обеспечивать бесперебойную работу платформы, однако сервис предоставляется по принципу «как есть». Администрация не несёт ответственности за временные технические сбои, утерю данных или любые косвенные убытки, возникшие в процессе использования ресурса.</p>
                    </section>

                    <section className={styles["article-section"]}>
                        <h2>4. Изменение условий</h2>
                        <p>Мы оставляем за собой право обновлять и изменять данные правила в любое время без предварительного уведомления пользователей. Актуальная версия документа всегда доступна на этой странице.</p>
                    </section>

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

                    {/*<section>*/}
                    {/*    <a href="#1">Общие положения</a>*/}
                    {/*</section>*/}

                    {/*<section>*/}
                    {/*    <a href="#2">Интеллектуальная собственность</a>*/}
                    {/*</section>*/}

                    {/*<section>*/}
                    {/*    <a href="#3">Ограничение ответственности</a>*/}
                    {/*</section>*/}

                    {/*<section>*/}
                    {/*    <a href="#4">Изменение условий</a>*/}
                    {/*</section>*/}

                </article>

            </div>

            <Footer/>

        </div>
    );
};