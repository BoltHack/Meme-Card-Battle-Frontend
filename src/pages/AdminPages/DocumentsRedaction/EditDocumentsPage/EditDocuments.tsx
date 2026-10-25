import { ChangeEvent, useEffect, useRef, useState } from "react";

import styles from "../CreateDocumentsPage/Card.CreateDocuments.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

import toast from "react-hot-toast";

interface ResponseProps {
  document_id: string;
}

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const EditDocumentsPage = ({ document_id }: ResponseProps) => {
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    path_name: "",
    title: "",
    summary: "",
    content: "",
  });
  const [editorText, setEditorText] = useState<string>("");

  const { contentData, contentLoading, contentError } = useContentRender(
    `/admin/documents/${document_id}/edit`,
  );

  let cleanHTMLText = (rawHTML: string) => {
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

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = new FormData();

    dataToSend.append("path_name", formData.path_name);
    dataToSend.append("title", formData.title);
    dataToSend.append("summary", formData.summary);
    dataToSend.append("content", cleanHTMLText(editorRef?.current.innerHTML));

    try {
      const response = await axios.post(
        `/admin/documents/${document_id}/edit`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        toast.success(response.data.success);
      }

      setFormData({
        path_name: formData.path_name,
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
      });
      // setFormData({
      //   ...formData,
      //   content: editorText,
      // });

      return response.data;
    } catch (error: any) {
      console.log("error", error);
      const errorMessage = error?.response?.data.error;
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (!contentData || !contentData.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    console.log("data", contentData);

    const data = contentData.renderData;

    // setFormData(contentData.renderData);
    setFormData({
      path_name: data.path_name,
      title: data.title,
      summary: data.summary,
      content: data.content.replace(/<[^>]*>/g, ""),
    });
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="edit-documents-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Редактор данных</h1>
        <p>Редактируйте данные внутри публикации.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("documents:list")}
      >
        ← Назад
      </a>

      <div className={styles["editor-container"]}>
        <h1 className={styles["editor-title"]}>Редактор</h1>

        <form className={styles["editor-form"]} onSubmit={handleSubmit}>
          <div className={styles["editor-left-side"]}>
            <div className={styles["editor-left-side"]}>
              <div className={styles["form-group"]}>
                <label className={styles["form-label"]} htmlFor="path_name">
                  Путь файла (на английском)
                </label>
                <input
                  type="text"
                  name="path_name"
                  id="path_name"
                  onChange={handleChange}
                  value={formData.path_name}
                  className={styles["form-input"]}
                  placeholder="Введите желаемый текст..."
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label className={styles["form-label"]} htmlFor="title">
                  Название
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  onChange={handleChange}
                  value={formData.title}
                  className={styles["form-input"]}
                  placeholder="Введите желаемый текст..."
                  required
                />
              </div>

              <div className={styles["form-group"]}>
                <label className={styles["form-label"]} htmlFor="summary">
                  Краткое содержание
                </label>
                <input
                  type="text"
                  name="summary"
                  id="summary"
                  onChange={handleChange}
                  value={formData.summary}
                  className={styles["form-input"]}
                  placeholder="Введите желаемый текст..."
                  // required
                />
              </div>
            </div>
          </div>

          <div className={styles["editor-right-side"]}>
            <br />
            <label className={styles["form-label"]}>Содержимое</label>
            <div
              dangerouslySetInnerHTML={{
                __html: formData?.content
                  .replace(/<li[^>]*>/g, "- ")
                  .replace(/<\/li>/g, "<br/>")
                  .replace(/<[^>]*>/g, "")
                  .replace(/^(<br\s*\/?>\s*)+/i, ""),
              }}
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
              Опубликовать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
