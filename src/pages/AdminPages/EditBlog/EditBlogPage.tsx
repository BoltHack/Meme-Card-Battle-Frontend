import { ChangeEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import styles from './Card.EditBlog.module.css';

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
// import toast from "react-hot-toast";

import usePageRender from "../../../tools/PageRender.ts";
import { ErrorPage } from "../../ErrorPage/Error.tsx";
import { LoadingPage } from "../../LoadingPage/Loading.tsx";

import { Header } from "../../../tools/PageTools/header_footer/Header.tsx";
import { Footer } from "../../../tools/PageTools/header_footer/Footer.tsx";
import { useParams } from "react-router-dom";

interface BlogId {
    blog_id: string
}

interface BlogPost {
    title: string;
    description: string;
    cover: string;
    category: string;

    edit_title: string;
    edit_description: string;
    edit_cover: string;
    edit_category: string;
    content: string;
}

interface titleSettings {
    title: string;
}

export const EditBlogPage = ({ title }: titleSettings) => {
    const { blog_id } = useParams<{ type: string }>() as BlogId;

    const [formData, setFormData] = useState({
        edit_title: "",
        edit_description: "",
        edit_cover: "",
        edit_category: "",
        content: ""
    });
    const [file, setFile] = useState<File | null>(null);

    const [, setEditorText] = useState("");

    const { data, loading, error } = usePageRender<{ blog: BlogPost }>(
        `${api.API_BASE_URL}/admin/edit/blog/${blog_id}`
    );

    let cleanHTMLText = (rawHTML: string) => {
        return rawHTML
            .replace(/<div>(?:\s|<br>|&nbsp;)*<\/div>/gi, '')
            .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1')
            .replace(/<br\s*\/?>/gi, '\n');
    }

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const rawContent = e.currentTarget.innerHTML;
        const cleaned = cleanHTMLText(rawContent);

        setEditorText(cleaned);
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    useEffect(() => {
        if (!data) {
            console.log('Данные еще не загрузились или структура не совпадает:', data);
            return;
        }

        const blog = (data as { blog: BlogPost }).blog;

        const formattedBlogs = {
            edit_title: blog?.title || "",
            edit_description: blog?.description || "",
            edit_cover: blog?.cover || "",
            edit_category: blog?.category || "",
            content: blog?.content.replace(/\n/g, '<br/>') || "",
        }

        setFormData(formattedBlogs);
    }, [data]);

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage error={error} />

    return (
        <div className={styles["body-wrapper"]}>
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <Header />

            <div className={styles["editor-container"]}>
                <h1 className={styles["editor-title"]}>Редактирование публикации</h1>

                <form className={styles["editor-form"]}>

                    <div className={styles["editor-left-side"]}>
                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="edit_title">Название статьи</label>
                            <input
                                type="text" name="edit_title"
                                onChange={handleChange} value={formData.edit_title}
                                className={styles["form-input"]}
                                placeholder="Введите броский заголовок..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="edit_description">Краткое содержание</label>
                            <input
                                type="text" name="edit_description"
                                onChange={handleChange} value={formData.edit_description}
                                className={styles["form-input"]}
                                placeholder="Введите желаемый текст..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="edit_category">Категория</label>
                            <select
                                name="edit_category"
                                onChange={handleChange} value={formData.edit_category}
                                className={styles["form-select"]}
                            >
                                <option value="community">Сообщество</option>
                                <option value="development">Разработка</option>
                                <option value="functions">Функции</option>
                                <option value="safety">Безопасность</option>
                            </select>
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]}>Обложка публикации</label>
                            <label className={styles["file-dropzone"]}>
                                <input
                                    onChange={handleFileChange}
                                    type="file" name="post_cover" accept="image/*"
                                />
                                <div className={styles["file-dropzone-text"]}>
                                    {file !== null ? (
                                        <span>Файл выбран <strong>{file.name}</strong></span>
                                    ): <span>Перетащите изображение сюда или <strong>выберите файл</strong></span>}
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className={styles["editor-right-side"]}>
                        {/*<label className={styles["form-label"]} htmlFor="post-content">Текст статьи</label>*/}

                        <div
                            dangerouslySetInnerHTML={{ __html: formData.content }}
                            onInput={handleInput}
                            className={styles["form-editor"]}
                            contentEditable="true"
                            spellCheck="false"
                            autoCorrect="off"
                            autoCapitalize="off"
                            translate="no"
                        ></div>
                        <button className={styles["submit-btn"]} type="submit">Изменить статью</button>
                    </div>

                </form>
            </div>

            <Footer />
        </div>
    );
};