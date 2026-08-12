import { ChangeEvent, useEffect, useState } from "react";
import { sanitize } from "isomorphic-dompurify";
import { marked } from "marked";

import styles from './Card.EditBlog.module.css';
import admin_styles from '../../AdminPanel/Card.AdminPanel.module.css';

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import toast from "react-hot-toast";

import usePageRender from "../../../../tools/PageRender.ts";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import { DefaultLoading } from "../../../LoadingPage/DefaultLoading.tsx";

// interface BlogId {
//     blog_id: string
// }

interface BlogPost {
    title: string;
    description: string;
    cover: string;
    category: string;

    post_title: string;
    post_description: string;
    post_cover: string;
    post_category: string;
    content: string;
}

interface IdProps {
    blog_id: string;
}

export const EditBlogPage = ({ blog_id }: IdProps ) => {
    // const blog_id = useState<IdProps | null>(null);

    const [formData, setFormData] = useState({
        post_title: "",
        post_description: "",
        post_category: "community",
        post_cover: "",
        content: ""
    });

    const [file, setFile] = useState<File | null>(null);
    const [isFileDelete, setIsFileDelete] = useState<boolean | false>(false);

    const [editorText, setEditorText] = useState("");

    const { data, loading, error } = usePageRender<{ blog: BlogPost }>(
        `${api.API_BASE_URL}/admin/blog/${blog_id}/edit`
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

    async function setCoverFromUrl(url: string) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], "cover.jpg", { type: blob.type });
            setFile(file);
        } catch (error) {
            console.error("Не удалось загрузить файл по ссылке", error);
            setFile(null);
        }
    }

    const handleFileRemove = () => {
        setFile(null);
        setIsFileDelete(true);
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const dataToSend = new FormData();

        dataToSend.append("post_title", formData.post_title);
        dataToSend.append("post_description", formData.post_description);
        dataToSend.append("post_category", formData.post_category);
        // dataToSend.append("isFileDelete", isFileDelete);
        dataToSend.append("content", editorText);

        if (file) {
            console.log('cover', file);
            dataToSend.append("post_cover", file);
        }
        if (isFileDelete) {
            dataToSend.append("post_cover", `${isFileDelete}`);
        }
        // if (file === null && formData.post_cover.length < 1) {
        //     dataToSend.append("post_cover", "");
        // }

        try {
            const response = await axios.post(`${api.API_BASE_URL}/admin/blog/${blog_id}/edit`, dataToSend, {
                withCredentials: true
            });

            console.log('Данные успешно добавлены:', response.data);

            setFormData({
                post_title: formData.post_title,
                post_description: formData.post_description,
                post_category: formData.post_category,
                post_cover: formData.post_cover,
                content: formData.content
            });

            setFile(null);

            toast.success(response.data.success);
            setIsFileDelete(false);
            setTimeout(() => getBlogData(formData.post_cover), 500);

            return response.data;
        } catch (error) {
            console.log('error', error);
        }
    }

    const getBlogData = async (cover: string) => {
        if (cover.length > 0) {
            await setCoverFromUrl(formData.post_cover);
        }
    }

    useEffect(() => {
        if (!data) {
            console.log('Данные еще не загрузились или структура не совпадает:', data);
            return;
        }

        const blog = (data as { blog: BlogPost }).blog;

        const formattedBlogs = {
            post_title: blog?.title || "",
            post_description: blog?.description || "",
            post_cover: blog?.cover || "",
            post_category: blog?.category || "",
            // content: (blog.content || "").replace(/\r\n|\n|\r/g, '\n')
            content: (blog.content || "").replace(/<[^>]*>/g, '')
        }

        setFormData(formattedBlogs);

        getBlogData(blog?.cover);

    }, [data]);

    if (loading) return <DefaultLoading />;
    if (error) return <ErrorPage error={error} />;

    return (
        // <div id="edit-blog-page" className={`${admin_styles["page"]} ${admin_styles["active"]}`}>
        <div id="edit-blog-page" className={`${admin_styles["page"]} ${admin_styles["active"]}`}>
            <header className={admin_styles["header"]}>
                <h1>Редактирование публикаций (блогов)</h1>
                <p>Напишите свои мысли, выберите желаемую категорию и отредактируйте блог.</p>
            </header>

            <div className={styles["editor-container"]}>
                <h1 className={styles["editor-title"]}>Создание новой публикации</h1>

                <form className={styles["editor-form"]} onSubmit={handleSubmit}>

                    <div className={styles["editor-left-side"]}>
                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="post_title">Название статьи</label>
                            <input
                                type="text" name="post_title" id="post_title"
                                onChange={handleChange} value={formData.post_title}
                                className={styles["form-input"]}
                                placeholder="Введите броский заголовок..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="post_description">Краткое содержание</label>
                            <input
                                type="text" name="post_description" id="post_description"
                                onChange={handleChange} value={formData.post_description}
                                className={styles["form-input"]}
                                placeholder="Введите желаемый текст..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="post_category">Категория</label>
                            <select
                                name="post_category" id="post_category"
                                onChange={handleChange} value={formData.post_category}
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
                                    ): <span>Перетащите изображение сюда или <strong>выберите файл</strong></span>
                                    }
                                </div>
                            </label>
                            {file !== null && (
                                <a className={styles["delete-file-btn"]} onClick={handleFileRemove}>Нажмите, чтобы удалить файл</a>
                            )}
                        </div>
                    </div>

                    <div className={styles["editor-right-side"]}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: sanitize(marked.parse(formData?.content ?? "") as string)
                                    .replace(/<[^>]*>/g, '<br/>')
                                    .replace(/^(<br\s*\/?>\s*)+/i, "")
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
                        <button type="submit" className={styles["submit-btn"]}>Сохранить статью</button>
                    </div>
                </form>
            </div>
        </div>
    );
}