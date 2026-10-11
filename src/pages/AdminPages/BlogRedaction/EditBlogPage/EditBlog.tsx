import { ChangeEvent, useEffect, useRef, useState } from "react";
import { sanitize } from "isomorphic-dompurify";
import { marked } from "marked";

import styles from "./Card.EditBlog.module.css";
import blog_styles from "../../../BlogReadPage/Card.BlogRead.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import toast from "react-hot-toast";

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

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

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const EditBlogPage = ({ blog_id }: IdProps) => {
  const [formData, setFormData] = useState({
    post_title: "",
    post_description: "",
    post_category: "community",
    post_cover: "",
    content: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [isFileDelete, setIsFileDelete] = useState<boolean | false>(false);

  const [galleryCover, setGalleryCover] = useState<File | null>(null);

  const [editorText, setEditorText] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  const [symbolsMenu, setSymbolsMenu] = useState<boolean | false>(false);

  const { contentData, contentLoading, contentError } = useContentRender<{
    renderData: BlogPost;
  }>(`${api.API_BASE_URL}/admin/blog/${blog_id}/edit`);

  const cleanHTMLText = (rawHTML: string) => {
    return rawHTML
      .replace(/<\/p>|<\/div>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/gi, " ")
      .trim();
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const rawContent = e.currentTarget.innerHTML;
    const cleaned = cleanHTMLText(rawContent);

    setEditorText(cleaned);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleGalleryCoverChange = (
    type: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      event.target.value = "";
      setGalleryCover(file);
      handleBlogCoverAdd(file, type);
    }
  };

  const insertText = (text: string) => {
    const selection = window.getSelection();

    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);

    if (!editorRef.current?.contains(range.commonAncestorContainer)) {
      console.log("editorRef не выбран");

      return;
    }

    range.deleteContents();

    const textNode = document.createTextNode(text);

    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);

    selection.removeAllRanges();
    selection.addRange(range);

    if (editorRef.current) {
      // setEditorText(editorRef.current.textContent || "");
      const event = new Event("input", { bubbles: true, cancelable: true });
      editorRef.current.dispatchEvent(event);
    }
  };

  const handleBlogCoverAdd = async (fileToSend?: File, type: string) => {
    const file = fileToSend || galleryCover;

    if (!file) {
      console.log("Файл пустой:", file);
      return;
    }

    const dataToSend = new FormData();

    dataToSend.append("gallery_cover", file);

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/blog/cover/add`,
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response?.data?.success) {
        insertText(
          `${type}\n${api.API_BASE_URL}/${response.data.cover}\n${type}`,
        );
        setGalleryCover(null);
      }

      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

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
    // setFile(null);
    setIsFileDelete(true);
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = new FormData();

    dataToSend.append("post_title", formData.post_title);
    dataToSend.append("post_description", formData.post_description);
    dataToSend.append("post_category", formData.post_category);
    dataToSend.append("content", editorText);

    console.log("isFileDelete", isFileDelete);

    if (file !== null && !isFileDelete) {
      console.log("cover", file);
      dataToSend.append("post_cover", file);
    }
    if (isFileDelete) {
      dataToSend.append("post_cover", `${isFileDelete}`);
    }

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/blog/${blog_id}/edit`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Данные успешно добавлены:", response.data);

      setFormData({
        post_title: formData.post_title,
        post_description: formData.post_description,
        post_category: formData.post_category,
        post_cover: formData.post_cover,
        content: formData.content,
      });

      setFile(null);

      toast.success(response.data.success);
      setIsFileDelete(false);

      // const cover = file?.name.toString();
      // setTimeout(() => getBlogData(cover ?? ""), 100);

      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  // const getBlogData = async (cover: string) => {
  //   if (cover && cover?.length > 0) {
  //     await setCoverFromUrl(cover);
  //   }
  // };

  useEffect(() => {
    if (!contentData || !contentData.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    const blog = (contentData as { renderData: BlogPost }).renderData;

    const formattedBlogs = {
      post_title: blog?.title || "",
      post_description: blog?.description || "",
      post_cover: blog?.cover || "",
      post_category: blog?.category || "",
      // content: (blog.content || "").replace(/\r\n|\n|\r/g, '\n')
      content: blog?.content.replace(/<[^>]*>/g, ""),
    };

    setFormData(formattedBlogs);

    // setTimeout(() => getBlogData(formattedBlogs.post_cover), 100);

    console.log("contentData", contentData);
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    // <div id="edit-blog-page" className={`${admin_styles["page"]} ${admin_styles["active"]}`}>
    <div
      id="edit-blog-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Редактирование публикаций (блогов)</h1>
        <p>
          Напишите свои мысли, выберите желаемую категорию и отредактируйте
          блог.
        </p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("blog:list")}
      >
        ← Назад
      </a>

      <div className={styles["editor-container"]}>
        <h1 className={styles["editor-title"]}>Редактирование публикации</h1>

        <form className={styles["editor-form"]} onSubmit={handleSubmit}>
          <div className={styles["editor-left-side"]}>
            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="post_title">
                Название статьи
              </label>
              <input
                type="text"
                name="post_title"
                id="post_title"
                onChange={handleChange}
                value={formData.post_title}
                className={styles["form-input"]}
                placeholder="Введите броский заголовок..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label
                className={styles["form-label"]}
                htmlFor="post_description"
              >
                Краткое содержание
              </label>
              <input
                type="text"
                name="post_description"
                id="post_description"
                onChange={handleChange}
                value={formData.post_description}
                className={styles["form-input"]}
                placeholder="Введите желаемый текст..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="post_category">
                Категория
              </label>
              <select
                name="post_category"
                id="post_category"
                onChange={handleChange}
                value={formData.post_category}
                className={styles["form-select"]}
              >
                <option value="community">Сообщество</option>
                <option value="development">Разработка</option>
                <option value="functions">Функции</option>
                <option value="safety">Безопасность</option>
                <option value="news">Новости</option>
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Обложка публикации</label>
              <label className={styles["file-dropzone"]}>
                <input
                  onChange={handleFileChange}
                  type="file"
                  name="post_cover"
                  accept="image/*"
                />
                <div className={styles["file-dropzone-text"]}>
                  {formData.post_cover && !isFileDelete ? (
                    <span>
                      Файл выбран <strong>cover.png</strong>
                    </span>
                  ) : (
                    <span>
                      Перетащите изображение сюда или{" "}
                      <strong>выберите файл</strong>
                    </span>
                  )}
                </div>
              </label>
              {formData.post_cover && !isFileDelete && (
                <a
                  className={styles["delete-file-btn"]}
                  onClick={handleFileRemove}
                >
                  Нажмите, чтобы удалить файл
                </a>
              )}
            </div>
          </div>

          <div className={styles["editor-right-side"]}>
            <div
              className={`${styles["file-tool"]} ${styles["tool-btn"]}`}
              onClick={() => setSymbolsMenu(true)}
            >
              Список всех специальных символов для кастомизации
            </div>
            <br />
            <label className={styles["form-label"]}>Содержимое статьи</label>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitize(
                  marked.parse(formData?.content ?? "") as string,
                )
                  // .replace(/<[^>]*>/g, '<br/>')

                  // .replace(/<[^>]*>/g, '')
                  // .replace(/^(<br\s*\/?>\s*)+/i, '')

                  // .replace(/<li>/g, '- ')
                  // .replace(/<\/li>/g, '<br/>')
                  // .replace(/<[^>]*>/g, '')
                  // .replace(/^(<br\s*\/?>\s*)+/i, '')

                  .replace(/<li[^>]*>/g, "- ")
                  .replace(/<\/li>/g, "<br/>")
                  .replace(/<[^>]*>/g, "")
                  .replace(/^(<br\s*\/?>\s*)+/i, ""),
              }}
              // children={editorText}
              ref={editorRef}
              style={{ whiteSpace: "pre-wrap" }}
              onInput={handleInput}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, text);
              }}
              className={styles["form-editor"]}
              contentEditable={true}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              translate="no"
              suppressContentEditableWarning={true}
            ></div>
            <button type="submit" className={styles["submit-btn"]}>
              Сохранить статью
            </button>

            <div className={styles["file-tools"]}>
              <label className={styles["file-tool"]}>
                <input
                  onChange={(e) => handleGalleryCoverChange("[I]", e)}
                  type="file"
                  name="gallery_cover"
                  accept="image/*"
                />
                <div className={styles["file-tool-text"]}>
                  <span>
                    Загрузить изображение в формате: <strong>[I]</strong>
                  </span>
                </div>
              </label>

              <label className={styles["file-tool"]}>
                <input
                  onChange={(e) => handleGalleryCoverChange("[F]", e)}
                  type="file"
                  name="gallery_cover"
                  accept="image/*"
                />
                <div className={styles["file-tool-text"]}>
                  <span>
                    Загрузить изображение в формате: <strong>[F]</strong>
                  </span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      {symbolsMenu && (
        <div className={styles["menu-wrapper"]}>
          <button
            className={styles["close-menu"]}
            onClick={() => setSymbolsMenu(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <div className={styles["table-container"]}>
            <table className={styles["custom-table"]}>
              <thead>
                <tr>
                  <th>Символ</th>
                  <th>Пример использования</th>
                  <th>Результат</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <kbd>[] + ()</kbd>
                  </td>
                  <td>
                    [
                    <span className={styles["table-muted-text"]}>
                      Желаемый текст
                    </span>
                    ](
                    <span className={styles["table-muted-text"]}>
                      ссылка на ресурс
                    </span>
                    )
                  </td>
                  <td>
                    <a
                      href="/"
                      target="_blank"
                      className={styles["preview-link"]}
                    >
                      Текст
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <kbd>{"{1}"}</kbd>
                  </td>
                  <td>
                    {"{1}"}{" "}
                    <span className={styles["table-muted-text"]}>
                      Желаемый текст
                    </span>{" "}
                    {"{1}"}
                  </td>
                  <td>
                    <h1 className={styles["preview-h1"]}>Текст</h1>
                  </td>
                </tr>
                <tr>
                  <td>
                    <kbd>{"{2}"}</kbd>
                  </td>
                  <td>
                    {"{2}"}{" "}
                    <span className={styles["table-muted-text"]}>
                      Желаемый текст
                    </span>{" "}
                    {"{2}"}
                  </td>
                  <td>
                    <h2 className={styles["preview-h2"]}>Текст</h2>
                  </td>
                </tr>
                <tr>
                  <td>
                    <kbd>$</kbd>
                  </td>
                  <td>
                    {"$"}{" "}
                    <span className={styles["table-muted-text"]}>
                      Желаемый текст
                    </span>{" "}
                    {"$"}
                  </td>
                  <td>
                    <div className={blog_styles["post-page-body"]}>
                      <blockquote>Текст</blockquote>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <kbd>[I]</kbd>
                  </td>
                  <td>
                    <span>[I]</span>
                    <br />
                    <span className={styles["table-muted-text"]}>
                      Ссылка на изображение
                    </span>
                    <br />
                    <span>[I]</span>
                  </td>
                  <td>
                    <div className={blog_styles["gallery-item"]}>
                      <img
                        className={styles["preview-img"]}
                        src="https://fastly.picsum.photos/id/1084/536/354.jpg?grayscale&hmac=Ux7nzg19e1q35mlUVZjhCLxqkR30cC-CarVg-nlIf60"
                        alt="Preview"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <kbd>[G] + [I]</kbd>
                  </td>
                  <td>
                    <span>[G]</span>
                    <br />
                    [I]
                    <span className={styles["table-muted-text"]}>
                      <br />
                      Первая ссылка на изображение
                      <br />
                      <span className={styles["table-muted-text"]}>
                        Желаемый текст (необязательно)
                      </span>
                    </span>
                    <br />
                    [I]
                    <br />
                    <br />
                    [I]
                    <span className={styles["table-muted-text"]}>
                      <br />
                      Вторая ссылка на изображение
                      <br />
                      <span className={styles["table-muted-text"]}>
                        Желаемый текст (необязательно)
                      </span>
                      <br />
                    </span>
                    [I]
                    <br />
                    <span>[G]</span>
                  </td>
                  <td>
                    <div className={blog_styles["post-image-gallery"]}>
                      <div className={blog_styles["post-inline-image"]}>
                        <img
                          className={styles["preview-img-gallery"]}
                          src="https://fastly.picsum.photos/id/1084/536/354.jpg?grayscale&hmac=Ux7nzg19e1q35mlUVZjhCLxqkR30cC-CarVg-nlIf60"
                          alt="Preview 1"
                        />
                        <figcaption className={styles["preview-caption"]}>
                          Текст 1
                        </figcaption>
                      </div>
                      <div className={blog_styles["post-inline-image"]}>
                        <img
                          className={styles["preview-img-gallery"]}
                          src="https://fastly.picsum.photos/id/1084/536/354.jpg?grayscale&hmac=Ux7nzg19e1q35mlUVZjhCLxqkR30cC-CarVg-nlIf60"
                          alt="Preview 2"
                        />
                        <figcaption className={styles["preview-caption"]}>
                          Текст 2
                        </figcaption>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <kbd>[F]</kbd>
                  </td>
                  <td>
                    {"[F]"}
                    <br />
                    <span className={styles["table-muted-text"]}>
                      Ссылка на изображение
                    </span>
                    <br />
                    <span className={styles["table-muted-text"]}>
                      Желаемый текст (необязательно)
                    </span>
                    <br />
                    {"[F]"}
                  </td>
                  <td>
                    <div className={blog_styles["gallery-item"]}>
                      <img
                        className={styles["preview-img"]}
                        style={{ maxWidth: "300px" }}
                        src="https://fastly.picsum.photos/id/1084/536/354.jpg?grayscale&hmac=Ux7nzg19e1q35mlUVZjhCLxqkR30cC-CarVg-nlIf60"
                        alt="Preview"
                      />
                      <figcaption className={styles["preview-caption"]}>
                        Текст
                      </figcaption>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
