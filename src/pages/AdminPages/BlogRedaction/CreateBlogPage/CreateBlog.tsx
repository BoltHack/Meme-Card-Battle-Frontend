import { ChangeEvent, useRef, useState } from "react";
// import { Helmet } from "react-helmet-async";

import styles from "./Card.CreateBlog.module.css";
import blog_styles from "../../../BlogReadPage/Card.BlogRead.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import toast from "react-hot-toast";

import usePageRender from "../../../../tools/PageRender.ts";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import { ContentLoading } from "../../../LoadingPage/ContentLoading.tsx";

interface PlayerData {
  name: string;
}

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";
import useContentRender from "../../../../tools/ContentRender.ts";

export const CreateBlogPage = () => {
  const [formData, setFormData] = useState({
    post_title: "",
    post_description: "",
    post_category: "community",
  });

  const [file, setFile] = useState<File | null>(null);
  const [galleryCover, setGalleryCover] = useState<File | null>(null);

  const [editorText, setEditorText] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  const [symbolsMenu, setSymbolsMenu] = useState<boolean | false>(false);

  const { contentLoading, contentError } = useContentRender<PlayerData>(
    `${api.API_BASE_URL}/admin/blog/create`,
  );

  let cleanHTMLText = (rawHTML: string) => {
    return (
      rawHTML
        // .replace(/<div>(?:\s|<br>|&nbsp;)*<\/div>/gi, '')
        // .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1')
        // .replace(/<br\s*\/?>/gi, '\n');

        // .replace(/<div>(?:\s|<br>|&nbsp;)*<\/div>/gi, '')
        // .replace(/<div>(.*?)<\/div>/gi, '$1\n')
        // .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1')
        // .replace(/<br\s*\/?>/gi, '\n')
        // .replace(/&nbsp;/gi, ' ');

        .replace(/<\/p>|<\/div>/gi, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&nbsp;/gi, " ")
        .trim()
    );

    // .replace(/<p>\s*<\/p>/gi, '')
    // .replace(/<\/p>|<\/div>/gi, '\n')
    // .replace(/<br\s*\/?>/gi, '\n')
    // .replace(/<\/?[^>]+(>|$)/g, "")
    // .replace(/&nbsp;/gi, ' ')
    // .replace(/\n{3,}/g, '\n\n')
    // .trim();

    // .replace(/<(p|div|blockquote)[^>]*>(?:\s|<br[^>]*>|&nbsp;)*<\/\1>/gi, '\n')
    // .replace(/<\/p>|<\/div>|<\/blockquote>|<\/h[1-6]>/gi, '\n')
    // .replace(/<br\s*\/?>/gi, '\n')
    // .replace(/<\/?[^>]+(>|$)/g, "")
    // .replace(/&nbsp;/gi, ' ')
    // // .replace(/\n{3,}/g, '\n\n')
    // .trim();
  };

  // const cleanTextBeforeSend = (text) => {
  //     if (!text) return "";
  //     return text
  //         .replace(/\r\n/g, '\n')
  //         .replace(/\n{3,}/g, '\n\n')
  //         .trim();
  // };

  // let cleanHTMLText = (rawHTML: string) => {
  //     if (!rawHTML) return "";
  //
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(rawHTML, 'text/html');
  //
  //     let text = doc.body.textContent || "";
  //
  //     return text.replace(/&nbsp;/gi, ' ').trim();
  // }

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

  // useEffect(() => {
  //     document.execCommand('defaultParagraphSeparator', false, 'br');
  // }, []);

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

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = new FormData();
    // Object.entries(formData).forEach(([key, value]) => dataToSend.append(key, value));

    dataToSend.append("post_title", formData.post_title);
    dataToSend.append("post_description", formData.post_description);
    dataToSend.append("post_category", formData.post_category);
    dataToSend.append("content", editorText);

    console.log("editorText", editorText);

    if (file) {
      console.log("cover", file);
      dataToSend.append("post_cover", file);
    }

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/blog/create`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Данные успешно добавлены:", response.data);

      setFormData({
        post_title: "",
        post_description: "",
        post_category: "community",
      });

      setFile(null);

      if (editorRef.current) {
        editorRef.current.textContent = "";
      }

      toast.success(response.data.success);

      return response.data;
    } catch (error) {
      console.error("error", error);
    }
  };

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="create-blog-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Создание публикаций (блогов)</h1>
        <p>
          Напишите свои мысли, выберите желаемую категорию и опубликуйте блог.
        </p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("blog:settings")}
      >
        ← Назад
      </a>

      <div className={styles["editor-container"]}>
        <h1 className={styles["editor-title"]}>Создание новой публикации</h1>

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
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]}>Обложка публикации</label>
              <label
                className={`${styles["file-dropzone"]} ${styles["tool-btn"]}`}
              >
                <input
                  onChange={handleFileChange}
                  type="file"
                  name="post_cover"
                  accept="image/*"
                />
                <div className={styles["file-dropzone-text"]}>
                  {file !== null ? (
                    <span>
                      Файл выбран <strong>{file.name}</strong>
                    </span>
                  ) : (
                    <span>
                      Перетащите изображение сюда или{" "}
                      <strong>выберите файл</strong>
                    </span>
                  )}
                </div>
              </label>
              {file !== null && (
                <a
                  className={styles["delete-file-btn"]}
                  onClick={() => setFile(null)}
                >
                  Нажмите, чтобы удалить файл
                </a>
              )}
            </div>
          </div>

          <div className={styles["editor-right-side"]}>
            {/* <label className={styles["form-label"]}>
              <span className={styles["code-text"]}>
                Используйте <kbd>$</kbd> что-бы создать "blockquote"
                <div className={styles["special-symbols-btn"]}>
                  Специальне символы. Нажмите, чтобы открыть список символов для
                  кастомизации.
                </div>
              </span>
            </label> */}
            <div
              className={`${styles["file-tool"]} ${styles["tool-btn"]}`}
              onClick={() => setSymbolsMenu(true)}
            >
              Список всех специальных символов для кастомизации
            </div>
            <br />
            <label className={styles["form-label"]}>Содержимое статьи</label>
            <div
              ref={editorRef}
              // children={editorText}
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
              Опубликовать статью
            </button>

            <div className={styles["file-tools"]}>
              <label className={`${styles["file-tool"]} ${styles["tool-btn"]}`}>
                <input
                  onChange={(e) => handleGalleryCoverChange("[I]", e)}
                  type="file"
                  name="gallery_cover"
                  accept="image/*"
                />
                <div className={styles["file-tool-text"]}>
                  <span>
                    Загрузить изображение в формате:{" "}
                    <strong>galleryItem</strong>
                  </span>
                </div>
              </label>

              <label className={`${styles["file-tool"]} ${styles["tool-btn"]}`}>
                <input
                  onChange={(e) => handleGalleryCoverChange("[F]", e)}
                  type="file"
                  name="gallery_cover"
                  accept="image/*"
                />
                <div className={styles["file-tool-text"]}>
                  <span>
                    Загрузить изображение в формате:{" "}
                    <strong>postInlineImage</strong>
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
