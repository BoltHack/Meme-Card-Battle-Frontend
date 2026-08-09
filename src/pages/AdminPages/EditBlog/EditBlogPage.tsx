import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sanitize } from "isomorphic-dompurify";
import { marked } from "marked";

import styles from './Card.EditBlog.module.css';
import admin_styles from './Card.EditBlog.module.css';

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";

import usePageRender from "../../../tools/PageRender.ts";
import { ErrorPage } from "../../ErrorPage/Error.tsx";
import { DefaultLoading } from "../../LoadingPage/DefaultLoading.tsx";

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

export const EditBlogPage = () => {
    const { blog_id } = useParams<{ type: string }>() as BlogId;

    const [formData, setFormData] = useState({
        edit_title: "",
        edit_description: "",
        edit_category: "community",
        content: ""
    });

    const [file, setFile] = useState<File | null>(null);

    const [editorText, setEditorText] = useState("");

    const { data, loading, error } = usePageRender<{ blog: BlogPost }>(
        `${api.API_BASE_URL}/admin/edit/blog/${blog_id}`
    );

    let cleanHTMLText = (rawHTML: string) => {
        return rawHTML
            .replace(/<\/p>|<\/div>/gi, '\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/&nbsp;/gi, ' ')
            .trim();
    }

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const rawContent = e.currentTarget.innerHTML;
        const cleaned = cleanHTMLText(rawContent);

        setEditorText(cleaned);
    }

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
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const dataToSend = new FormData();

        dataToSend.append("edit_title", formData.edit_title);
        dataToSend.append("edit_description", formData.edit_description);
        dataToSend.append("edit_category", formData.edit_category);
        dataToSend.append("content", editorText);

        if (file) {
            console.log('cover', file);
            dataToSend.append("edit_cover", file);
        }

        try {
            const response = await axios.post(`${api.API_BASE_URL}/admin/edit/blog/${blog_id}`, dataToSend, {
                withCredentials: true
            });

            console.log('Данные успешно добавлены:', response.data);

            setFormData({
                edit_title: "",
                edit_description: "",
                edit_category: "community",
                content: ""
            });

            setFile(null);
            setEditorText("");

            return response.data;
        } catch (error) {
            console.log('error', error);
        }
    }

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
            // content: (blog.content || "").replace(/\r\n|\n|\r/g, '\n')
            content: (blog.content || "").replace(/<[^>]*>/g, '')
        }

        setFormData(formattedBlogs);
        setFile(blog?.cover.length > 0 ? blog?.cover : null);

        console.log('formattedBlogs:', formattedBlogs);
        console.log('file:', file);
        console.log('cover:', blog?.cover.length > 0 ? blog?.cover : null);
    }, [data]);

    if (loading) return <DefaultLoading />
    if (error) return <ErrorPage error={error} />

    return (
        // <div id="edit-blog-page" className={`${admin_styles["page"]} ${admin_styles["active"]}`}>
        <div id="edit-blog-page" className={`${styles["body-wrapper"]}`}>
            <header className={admin_styles["header"]}>
                <h1>Создание публикаций (блогов)</h1>
                <p>Напишите свои мысли, выберите желаемую категорию и опубликуйте блог.</p>
            </header>

            <div className={styles["editor-container"]}>
                <h1 className={styles["editor-title"]}>Создание новой публикации</h1>

                <form className={styles["editor-form"]} onSubmit={handleSubmit}>

                    <div className={styles["editor-left-side"]}>
                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="post_title">Название статьи</label>
                            <input
                                type="text" name="post_title" id="post_title"
                                onChange={handleChange} value={formData.edit_title}
                                className={styles["form-input"]}
                                placeholder="Введите броский заголовок..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="post_description">Краткое содержание</label>
                            <input
                                type="text" name="post_description" id="post_description"
                                onChange={handleChange} value={formData.edit_description}
                                className={styles["form-input"]}
                                placeholder="Введите желаемый текст..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="post_category">Категория</label>
                            <select
                                name="post_category" id="post_category"
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
                            {file !== null && (
                                <a className={styles["delete-file-btn"]} onClick={() => setFile(null)}>Нажмите, чтобы удалить файл</a>
                            )}
                        </div>
                    </div>

                    <div className={styles["editor-right-side"]}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: sanitize(marked.parse(formData?.content ?? "") as string).replace(/<[^>]*>/g, '<br/>')
                            }}
                            // children={editorText}
                            onInput={handleInput}
                            onPaste={(e) => {
                                e.preventDefault();
                                const text = e.clipboardData.getData('text/plain');
                                document.execCommand('insertText', false, text);
                            }}
                            className={styles['form-editor']}
                            contentEditable={true}
                            spellCheck={false}
                            autoCorrect="off"
                            autoCapitalize="off"
                            translate="no"
                            suppressContentEditableWarning={true}
                        ></div>
                        <button type="submit" className={styles["submit-btn"]}>Опубликовать статью</button>
                    </div>
                </form>
            </div>
        </div>
    );
}