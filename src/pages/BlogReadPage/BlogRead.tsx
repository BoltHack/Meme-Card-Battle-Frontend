import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

import styles from './Card.BlogRead.module.css';

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";

import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../ErrorPage/Error.tsx";
import { LoadingPage } from "../LoadingPage/Loading.tsx";

import { Header } from "../../tools/PageTools/header_footer/Header.tsx";
import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";

interface BlogPost {
    // author: BlogAuthor;
    // main_content: BlogMainContent;
    // category: string;
    // content: string;
    // date: string;
    // id: string;
    author: string;
    title: string;
    description: string;
    cover: string;
    category: string;
    content: string;
    date: string;
}

interface BlogResponse {
    id?: string;
    renderData: BlogPost;
}

interface BlogId {
    blog_id: string
}

export const BlogReadPage = () => {
    const [title, setTitle] = useState("");

    const [blog, setBlog] = useState<BlogPost>({} as BlogPost);
    const { blog_id } = useParams<{ type: string }>() as BlogId;

    const { data, loading, error } = usePageRender<BlogResponse>(
        `${api.API_BASE_URL}/api/blog/${blog_id}`
    );

    const dateSettings = (date: string) => {
        return new Date(date).toLocaleString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour12: false
        });
    }

    useEffect(() => {
        if (!data) {
            console.log('Данные еще не загрузились или структура не совпадает:', data);
            return;
        }

        const blog = data.renderData;

        const title = data.renderData.title;

        setTitle(title);

        const formattedBlogs= {
            author: blog.author || "Аноним",
            title: blog?.title || "",
            description: blog?.description || "",
            cover: blog?.cover || "",
            category: blog.category || "community",
            content: blog.content.replace(/\n/g, '<br/>') || "",
            date: blog.date || "",
        }

        setBlog(formattedBlogs);
    }, [data]);

    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage error={error} />;

    return (
        <div className={styles["body-wrapper"]}>
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Header />

            <div className={styles["post-page-layout"]}>

                <Link to="/blog" className={styles["back-to-blog"]}>← Назад в блог</Link>

                {blog ? (
                    <article className={styles["full-post-container"]}>

                        <header className={styles["post-page-header"]}>
                            <span className={styles["category"]}>{blog.category}</span>
                            <h1>{blog.title}</h1>

                            <div className={styles["post-page-meta"]}>
                                <div className={styles["author-info"]}>
                                    <div className={styles["avatar"]}></div>
                                    <div>
                                        <div className={styles["name"]}>{blog.author}</div>
                                        <div className={styles["role"]}>Frontend Architect</div>
                                    </div>
                                </div>
                                <span className={styles["date"]}>{dateSettings(blog.date)}</span>
                            </div>
                        </header>

                        <div className={styles["post-page-image"]}>
                            {blog.cover ? (
                                <img src={`${api.API_BASE_URL}/${blog.cover}`} className={styles["img-placeholder"]} />
                            ) : <div className={styles["img-placeholder"]}></div> }
                        </div>

                        <div className={styles["post-page-body"]}>
                            <p className={styles["lead"]}>{blog.description}</p>
                            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                        </div>

                    </article>
                ): null}


                {/*{blog ? (*/}
                {/*    <article className={styles["full-post-container"]}>*/}

                {/*        <header className={styles["post-page-header"]}>*/}
                {/*            <span className={styles["category"]}>test</span>*/}
                {/*            <h1>Будущее веб-разработки в 2026 году</h1>*/}

                {/*            <div className={styles["post-page-meta"]}>*/}
                {/*                <div className={styles["author-info"]}>*/}
                {/*                    <div className={styles["avatar"]}></div>*/}
                {/*                    <div>*/}
                {/*                        <div className={styles["name"]}>Алексей Иванов</div>*/}
                {/*                        <div className={styles["role"]}>Frontend Architect</div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <span className={styles["date"]}>16 июля, 2026</span>*/}
                {/*            </div>*/}
                {/*        </header>*/}

                {/*        <div className={styles["post-page-image"]}>*/}
                {/*            <div className={styles["img-placeholder"]}></div>*/}
                {/*        </div>*/}

                {/*        <div className={styles["post-page-body"]}>*/}
                {/*            <p className={styles["lead"]}>Разбираемся, как новые стандарты CSS, генеративный UI и нативные веб-компоненты меняют привычный подход к созданию интерфейсов. Мир веб-технологий движется вперед с невероятной скоростью, и то, что казалось экспериментом вчера, сегодня становится стандартом.</p>*/}

                {/*            <h2>1. Генеративный UI наступает на пятки</h2>*/}
                {/*            <p>Современные интерфейсы перестают быть статичными слепками кода. Компоненты начинают адаптироваться под контекст пользователя в реальном времени, собирая структуру блоков «на лету» в зависимости от его поведения и предпочтений.</p>*/}

                {/*            <figure className={styles["post-inline-image"]}>*/}
                {/*                <img src="" alt="Пример интерфейса будущего" />*/}
                {/*                <figcaption>Рис 1. Пример адаптивного генеративного интерфейса на мобильных устройствах</figcaption>*/}
                {/*            </figure>*/}

                {/*            <blockquote>*/}
                {/*                «Будущее за интерфейсами, которые пишут себя сами на основе декларативных намерений пользователя, минимизируя рутинную работу верстальщика».*/}
                {/*            </blockquote>*/}

                {/*            <h2>2. Новые горизонты CSS</h2>*/}
                {/*            <p>Спецификации CSS развиваются быстрее, чем когда-либо. Появление новых функций работы со сложными сетками, нативного скролл-driven анимаций и контейнерных запросов позволяет создавать невероятно отзывчивый дизайн без единой строчки на JavaScript.</p>*/}

                {/*            <div className={styles["post-image-gallery"]}>*/}
                {/*                <div className={styles["gallery-item"]}>*/}
                {/*                    <img src="" alt="Старый подход к верстке" />*/}
                {/*                    <span>Старый подход (Grid v1)</span>*/}
                {/*                </div>*/}
                {/*                <div className={styles["gallery-item"]}>*/}
                {/*                    <img src="" alt="Новый подход к верстке" />*/}
                {/*                    <span>Новый подход (Advanced Subgrid)</span>*/}
                {/*                </div>*/}
                {/*            </div>*/}

                {/*            <figure className={styles["post-inline-image"]}>*/}
                {/*                <img src="" alt="Панорамный концепт-арт интерфейса" />*/}
                {/*                <figcaption>Геометрический паттерн распределения элементов в ультра-широких разрешениях</figcaption>*/}
                {/*            </figure>*/}

                {/*            <ul>*/}
                {/*                <li>Полная поддержка динамических единиц вьюпорта (dvh/dvw) на всех платформах.</li>*/}
                {/*                <li>Широкое распространение вложенности (CSS Nesting) без препроцессоров.</li>*/}
                {/*                <li>Аппаратное ускорение кастомных шейдеров для бэкграундов.</li>*/}
                {/*            </ul>*/}

                {/*            <p>Внедрение этих стандартов позволяет снизить вес конечной страницы, улучшить производительность (особенно на мобильных устройствах) и сделать код более поддерживаемым в долгосрочной перспективе.</p>*/}
                {/*        </div>*/}

                {/*    </article>*/}
                {/*): null}*/}

            </div>

            <Footer />
        </div>
    );
};