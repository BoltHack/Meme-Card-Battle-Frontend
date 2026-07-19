import { useEffect, useState } from "react";
import {Link, useParams} from 'react-router-dom';
import { Helmet } from "react-helmet-async";

import styles from '../BlogPage/Card.Blog.module.css';

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";

import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../ErrorPage/Error.tsx";
import { LoadingPage } from "../LoadingPage/Loading.tsx";

import { Header } from "../../tools/PageTools/header_footer/Header.tsx";
import { Footer } from "../../tools/PageTools/header_footer/Footer.tsx";

interface BlogPost {
    author: string;
    title: string;
    description: string,
    cover: string;
    category: string;
    date: string;
    id: string;
}

interface BlogResponse {
    id?: string;
    renderData: {
        blog: BlogPost[];
    }
}

interface BlogPageProps {
    title: string;
}

interface BlogCategory {
    blog_category: string;
}

export const BlogCategoryPage = ({ title }: BlogPageProps) => {
    // const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPost[]>([]);
    const { blog_category } = useParams<{ type: string }>() as BlogCategory;

    const { data, loading, error } = usePageRender<BlogResponse>(
        `${api.API_BASE_URL}/api/category/${blog_category}`
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
        if (!data || !Array.isArray(data.renderData.blog)) {
            console.log('Данные еще не загрузились или структура не совпадает:', data);
            return;
        }

        // const formattedBlogs = data.blog.map(blog => ({
        //     author: {
        //         name: blog.author?.name || "Аноним"
        //     },
        //     main_content: {
        //         title: blog.main_content?.title || "",
        //         description: blog.main_content?.description || "",
        //         cover: blog.main_content?.cover || "",
        //     },
        //     category: blog.category,
        //     content: blog.content,
        //     date: blog.date,
        //     id: blog._id.toString()
        // }));

        setBlog(data.renderData.blog);
    }, [data]);

    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage error={error} />;

    return (
        <div className={styles["body-wrapper"]}>
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Header />

            <main className={styles["discord-blog-container"]}>

                <section className={styles["featured-section"]}>

                    {blog && blog.length > 0 ? (

                        <article className={styles["featured-card"]}>
                            <div className={styles["featured-image"]}>
                                {blog[0].cover.length > 0 ? (
                                    <img src={`${api.API_BASE_URL}/${blog[0].cover}`} className={styles["img-placeholder"]} />
                                ): <div className={styles["img-placeholder"]}></div> }
                            </div>
                            <div className={styles["featured-content"]}>
                                <span className={styles["category"]}>{blog_category}</span>
                                <h2>{blog[0].title}</h2>
                                <p>{blog[0].description}</p>
                                <div className={styles["card-footer"]}>
                                    <span className={styles["date"]}>{dateSettings(blog[0].date)}</span>
                                    <Link to={`/blog/${blog[0].id}`} className={styles["read-more-btn"]}>Читать статью</Link>
                                </div>
                            </div>
                        </article>

                    ): <p>Категория не найдена</p>}

                </section>

                <section className={styles["posts-grid-section"]}>

                    {blog && blog.length > 0 ? (

                        blog.slice(1).map((bd, index) => {

                            return (
                                <article key={index} className={styles["grid-card"]}>
                                    <div className={styles["card-image"]}>
                                        {bd.cover.length > 0 ? (
                                            <img src={`${api.API_BASE_URL}/${bd.cover}`} className={styles["img-placeholder"]} />
                                        ): <div className={styles["img-placeholder"]} style={{ background: "linear-gradient(135deg, #0066ff, #ff007f)" }}></div> }
                                    </div>
                                    <div className={styles["card-body"]}>
                                        <span className={styles["category"]}>{blog_category}</span>
                                        <h3>{bd.title}</h3>
                                        <p>{bd.description}</p>
                                        <div className={styles["card-footer"]}>
                                            <span className={styles["date"]}>{dateSettings(bd.date)}</span>
                                            <Link to={`/blog/${bd.id}`} className={`${styles["read-more-btn"]} ${styles["small"]}`}>Читать статью</Link>
                                        </div>
                                    </div>
                                </article>
                            )
                        })
                    ): null}

                </section>

            </main>

            <Footer />
        </div>
    );
};