import { ChangeEvent, useState } from "react";
// import { Helmet } from "react-helmet-async";

import styles from './Card.CreateBlog.module.css';

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
// import toast from "react-hot-toast";

import usePageRender from "../../../tools/PageRender.ts";
import { ErrorPage } from "../../ErrorPage/Error.tsx";
import { DefaultLoading } from "../../LoadingPage/DefaultLoading.tsx";

interface PlayerData {
    name: string;
}

export const CreateBlogPage = () => {

    const [formData, setFormData] = useState({
        post_title: "",
        post_description: "",
        post_category: "community"
    });
    const [file, setFile] = useState<File | null>(null);

    const [editorText, setEditorText] = useState("");

    const { loading, error } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/admin/create/blog`
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

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const dataToSend = new FormData();
        // Object.entries(formData).forEach(([key, value]) => dataToSend.append(key, value));

        dataToSend.append("post_title", formData.post_title);
        dataToSend.append("post_description", formData.post_description);
        dataToSend.append("post_category", formData.post_category);
        dataToSend.append("content", editorText);

        console.log('editorText', editorText)

        if (file) {
            console.log('cover', file);
            dataToSend.append("post_cover", file);
        }

        try {
            const response = await axios.post(`${api.API_BASE_URL}/admin/add/blog`, dataToSend, {
                withCredentials: true
            });

            console.log('Данные успешно добавлены:', response.data);

            setFormData({
                post_title: "",
                post_description: "",
                post_category: "community"
            });
            setFile(null);
            setEditorText("");

            return response.data;
        } catch (error) {
            console.log('error', error);
        }
    }

    if (loading) return <DefaultLoading />
    if (error) return <ErrorPage error={error} />

    return (
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
                        onInput={handleInput}
                        className={styles["form-editor"]}
                        contentEditable="true"
                        spellCheck="false"
                        autoCorrect="off"
                        autoCapitalize="off"
                        translate="no"
                    ></div>
                    <button type="submit" className={styles["submit-btn"]}>Опубликовать статью</button>
                </div>

                {/*<div className={styles["form-group"]}>*/}
                {/*    <label className={styles["form-label"]} htmlFor="post-content">Текст статьи</label>*/}

                {/*    <div*/}
                {/*        onInput={handleInput}*/}
                {/*        className={styles["form-editor"]}*/}
                {/*        contentEditable="true"*/}
                {/*        spellCheck="false"*/}
                {/*        autoCorrect="off"*/}
                {/*        autoCapitalize="off"*/}
                {/*        // writingsuggestions="false"*/}
                {/*        translate="no"*/}
                {/*    ></div>*/}
                {/*</div>*/}

                {/*<button className={styles["submit-btn"]} type="submit">Опубликовать статью</button>*/}
            </form>
        </div>
    );
};