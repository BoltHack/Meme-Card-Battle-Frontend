import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { Config } from 'dompurify';
import { marked, Tokens, TokenizerThis, RendererThis } from 'marked';
import { sanitize } from "isomorphic-dompurify";

import styles from './Card.BlogRead.module.css';

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";

import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../ErrorPage/Error.tsx";
import { LoadingPage } from "../LoadingPage/Loading.tsx";

import { Header } from "../../tools/PageTools/header_footer/Header.tsx";
import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";

interface BlogAuthor {
    id: string;
    name: string;
}

interface BlogPost {
    author: BlogAuthor;
    // main_content: BlogMainContent;
    // category: string;
    // content: string;
    // date: string;
    // id: string;
    // id: string;
    // name: string;
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

    const blog_state = JSON.parse(sessionStorage.getItem('blog_state') || '{}');

    const { data, loading, error } = usePageRender<BlogResponse>(
        `${api.API_BASE_URL}/api/blog/${blog_id}`
    );

    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.removeItem("blog_state");
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const dateSettings = (date: string) => {
        return new Date(date).toLocaleString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour12: false
        });
    }

    const galleryItemSettings = (element: string, className: string, textElement: string, content: string) => {
        const cleanText = content.replace(/<[^>]*>/g, '').trim();
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        const text = cleanText.replace(urlRegex, '').trim();

        const matchUrl = cleanText.match(urlRegex)?.[0];

        if (!matchUrl) return text;

        return `
            <${element} class="${styles[className]}">
                <img src="${matchUrl}" onclick="window.open('${matchUrl}', '_blank')" />
                ${text ? `<${textElement}>${text}</${textElement}>` : ''}
            </${element}>
                `;
    }

    const multiBoxExtension = {
        name: "multiBox",
        level: "block" as const,

        // start(src: string) {
        start(src: string) {
            // return src.match(/[\$%@#]/)?.index;
            // return src.match(/^[\$%@#]/m)?.index;
            // return src.match(/^[\$%@#[]GI/m)?.index;
            // return src.match(/(?:^|[\n])(?:\{1\}|\{2\}|\{3\}|\[G\]|\[I\]|[\$%@#])/)?.index;
            // return src.match(/[\$%@]/)?.index;

            // const match = src.match(/^(?:\{1\}|\{2\}|\{3\}|\[G\]|\[I\]|[\$%@#])/m);
            // return match ? match.index : undefined;

            const match = src.match(/^(?:\{1\}|\{2\}|\{3\}|\[G\]|\[I\]|\[F\]|[\$%@#])/m);
            return match ? match.index : undefined;
        },

        // tokenizer(src: string) {
        tokenizer(this: TokenizerThis, src: string) {
            // const rule = /^([\$%@#])([^\$%@#\n]+)\1/;
            // const rule = /^([\$%@#])([^\$%@#\n]+)\1(?:\n|$)/;
            // const rule = /^((?:\{1\}|\{2\}|\{3\}|\[G\]|\[I\]|[\$%@#]))([^\$%@#\n]+)\1(?:\n|$)/;
            // const rule = /^((?:\{1\}|\{2\}|\{3\}|\[G\]|\[I\]|[\$%@#]))((?:(?!\1)[^\n])+)\1(?:\n|$)/;

            // const rule = /^((?:\{1\}|\{2\}|\{3\}|\[G\]|\[I\]|[\$%@#]))\s*([\s\S]*?)\s*\1(?:\n|$)/;
            // const match = rule.exec(src);

            const rule = /^((?:\{1\}|\{2\}|\{3\}|\[G\]|\[I\]|\[F\]|[\$%@#]))\s*([\s\S]*?)\s*\1(?:\n|$)/;
            const match = rule.exec(src);

            if (match) {
                const marker = match[1];
                const text = match[2].trim();

                let boxType = 'default';

                switch (marker) {
                    case '{1}':
                        boxType = 'heading1';
                        break;
                    case '{2}':
                        boxType = 'heading2';
                        break;
                    case '$':
                        boxType = 'blockquote';
                        break;
                    case '[G]':
                        boxType = 'postImageGallery';
                        break;
                    case '[I]':
                        boxType = 'galleryItem';
                        break;
                    case '[F]':
                        boxType = 'postInlineImage';
                        break;
                    // case '{i}':
                    //     boxType = 'image';
                    //     break;
                    case '%':
                        boxType = 'span';
                        break;
                }

                // if (!marker) boxType = 'default';
                // if (marker === '#') boxType = 'heading2';
                // if (marker === '{1}') boxType = 'heading1';
                // if (marker === '$') boxType = 'blockquote';
                // if (marker === '%') boxType = 'span';

                return {
                    type: 'multiBox',
                    raw: match[0],
                    text: text,
                    boxType: boxType,
                    tokens: this.lexer.blockTokens(text, [])
                }
            }
        },
        // renderer(token: any) {
        //     if (token.boxType === "heading1") {
        //         return `<h1>${token.text}</h1>`;
        //     }
        //     if (token.boxType === "heading2") {
        //         return `<h2>${token.text}</h2>`;
        //     }
        //     if (token.boxType === "blockquote") {
        //         return `<blockquote>${token.text}</blockquote>`;
        //     }
        //     if (token.boxType === "span") {
        //         return `<span>${token.text}</span>`;
        //     }
        //     return "";
        // }
        renderer(this: RendererThis, token: any) {
            let content = this.parser.parse(token.tokens);

            content = content.replace(/^<div>([\s\S]*?)<\/div>$/, '$1');
            content = content.replace(/^<p>([\s\S]*?)<\/p>$/, '$1');

            // content = content.replace(/(?<=<\/div>)\s*[^<>\s][^<>]*\s*/g, '');

            switch (token.boxType) {
                case "heading1":
                    return `<h1>${content.replace(/<[^>]*>/g, '')}</h1>`;
                case "heading2":
                    return `<h2>${content.replace(/<[^>]*>/g, '')}</h2>`;
                case "blockquote":
                    return `<blockquote>${content.replace(/<[^>]*>/g, '')}</blockquote>`;
                case "postImageGallery":
                    return `<div class="${styles['post-image-gallery']}">${content}</div>`;
                case "galleryItem":
                    return galleryItemSettings('div', 'gallery-item', 'span', content.replace(/(?<=<\/div>)\s*[^<>\s][^<>]*\s*/g, ''));
                case "postInlineImage":
                    return galleryItemSettings('figure', 'post-inline-image', 'figcaption', content);
                // case "image":
                //     return `<img src="${content}" />`;
                case "span":
                    return `<span>${content.replace(/<[^>]*>/g, '')}</span>`;
                default:
                    return `<div>${content}</div>`;
            }
        }
    }

    const sanitizeConfig: Config = {
        ALLOWED_ATTR: ['class', 'src', 'alt', 'title', 'href', 'id', 'start', 'loading', 'onclick', 'target', 'rel']
    };

    const customRenderer = {
        // text(token: any): string {
        //     // const rawText = token.text || '';
        //     const { text } = token;
        //
        //     const sendText = text.length > 2 ? `<p>${text}</p>` : "";
        //
        //     return sendText;
        // },

        link(token: Tokens.Link) {
            const { href, title, text } = token;
            const isExternal = href.startsWith("http") || href.startsWith("https");

            const targetAttr = isExternal ? 'target="_blank"' : "";
            const titleAttr = title ? `title="${title}"` : "";

            return `<a href="${href}" ${targetAttr} ${titleAttr} rel="noopener noreferrer" class="blog-link">${text}</a>`;
        }
    }

    // marked.use({ renderer: customRenderer });
    // marked.use({ extensions: [multiBoxExtension] });
    marked.use({
        renderer: customRenderer,
        extensions: [multiBoxExtension]
    });

    // let cleanHTMLText = (rawHTML: string) => {
    //     return rawHTML
    //         .replace(/<(p|div|blockquote)[^>]*>(?:\s|<br[^>]*>|&nbsp;)*<\/\1>/gi, '\n')
    //         .replace(/<\/p>|<\/div>|<\/blockquote>|<\/h[1-6]>/gi, '\n')
    //         .replace(/<br\s*\/?>/gi, '\n')
    //         .replace(/<\/?[^>]+(>|$)/g, "")
    //         .replace(/&nbsp;/gi, ' ')
    //         .trim();
    // }

    useEffect(() => {
        if (!data) {
            console.log('Данные еще не загрузились или структура не совпадает:', data);
            return;
        }

        const blog = data.renderData;

        const title = data.renderData.title;

        setTitle(title);

        const formattedBlogs= {
            author: {
                id: blog?.author?.id,
                name: blog?.author?.name
            },
            title: blog?.title || "",
            description: blog?.description || "",
            cover: blog?.cover || "",
            category: blog.category || "community",
            // content: blog.content.replace(/\n/g, ' \n ') || "",
            // content: blog.content.replace(/\r?\n/g, ' <br/> ') || "",
            // content: blog.content.replace(/\r\n|\n|\r/g, '\n') || "",
            // content: blog.content.replace(/\r\n|\n|\r/g, '\n') || "",
            content: (blog.content || "").replace(/\r\n|\n|\r/g, '\n'),
            // content: (blog.content || "").replace(/<p>\s*<\/p>/gi, ''),

            // content: blog.content || "",
            date: blog.date || "",
        }

        console.log('formattedBlogs', formattedBlogs);

        setBlog(formattedBlogs);

        // return () => {
        //     window.addEventListener("unload", () => {
        //         console.log('test');
        //     });
        // }

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

                <Link to={`/${blog_state.category ? "category/" + blog_state.category : "blog"}${blog_state.page ? "?page=" + blog_state.page : ""}`} className={styles["back-to-blog"]}>← Назад в блог</Link>

                {blog ? (
                    <article className={styles["full-post-container"]}>

                        <header className={styles["post-page-header"]}>
                            <span className={styles["category"]}>{blog.category}</span>
                            <h1>{blog.title}</h1>

                            <div className={styles["post-page-meta"]}>
                                <div className={styles["author-info"]}>
                                    {/*<div className={styles["avatar"]}></div>*/}
                                    <img src={`${api.API_BASE_URL}/uploads/UserCovers/${blog?.author?.id}/UserProfile.jpg`} className={styles["avatar"]} />
                                    <div>
                                        <div className={styles["name"]}>{blog?.author?.name}</div>
                                        <div className={styles["role"]}>Frontend Architect</div>
                                    </div>
                                </div>
                                <span className={styles["date"]}>{dateSettings(blog.date)}</span>
                            </div>
                        </header>

                        <div className={styles["post-page-image"]}>
                            {blog.cover ? (
                                <img src={`${api.API_BASE_URL}/${blog.cover}`} loading="lazy" className={styles["img-placeholder"]} />
                            ) : <div className={styles["img-placeholder"]}></div> }
                        </div>

                        {/*<div className={styles["post-page-body"]}>*/}
                        {/*    <p className={styles["lead"]}>{blog.description}</p>*/}
                        {/*    <div dangerouslySetInnerHTML={{__html: sanitize(marked.parse(blog?.content ?? "") as string, sanitizeConfig)}}></div>*/}
                        {/*</div>*/}

                        <p className={styles["lead"]}>{blog.description}</p>
                        <div className={styles["post-page-body"]}
                             dangerouslySetInnerHTML={{__html: sanitize(marked.parse(blog?.content ?? "") as string, sanitizeConfig)}}
                        >
                        </div>

                        {/*<div className={styles["post-page-body"]}>*/}
                        {/*    <div className={styles["post-image-gallery"]}>*/}
                        {/*        <div className={styles["gallery-item"]}>*/}
                        {/*            <img src="https://static.yani.tv/posters/huge/1636933340.avif" alt="Старый подход к верстке" />*/}
                        {/*            <span>Старый подход (Grid v1)</span>*/}
                        {/*        </div>*/}
                        {/*        <div className={styles["gallery-item"]}>*/}
                        {/*            <img src="https://static.yani.tv/posters/huge/1636894511.avif" alt="Новый подход к верстке" />*/}
                        {/*            <span>Новый подход (Advanced Subgrid)</span>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*<div className={styles["post-image-gallery"]}>*/}
                        {/*    gfd4g654df*/}
                        {/*</div>*/}

                        {/*            <figure className={styles["post-inline-image"]}>*/}
                        {/*                <img src="" alt="Панорамный концепт-арт интерфейса" />*/}
                        {/*                <figcaption>Геометрический паттерн распределения элементов в ультра-широких разрешениях</figcaption>*/}
                        {/*            </figure>*/}

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