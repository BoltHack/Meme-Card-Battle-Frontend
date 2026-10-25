import { ChangeEvent, useRef, useState } from "react";

import styles from "./Card.CreateHelp.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

import toast from "react-hot-toast";

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const CreateHelpPage = () => {
  const editorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    color: "",
    filter: "",
    link_title_description: "",
    link_title: "",
    link_href: "",
    link_path: "",
  });
  const [linkType, setLinkType] = useState<string | "">("href");
  const [editorText, setEditorText] = useState<string>("");

  const { contentLoading, contentError } =
    useContentRender(`/admin/help/create`);

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

    dataToSend.append("title", formData.title);
    dataToSend.append("summary", formData.summary);
    dataToSend.append("color", formData.color);
    dataToSend.append("filter", formData.filter);
    dataToSend.append("title_description", formData.link_title_description);
    dataToSend.append("link_title", formData.link_title);
    dataToSend.append(
      "link_href",
      linkType === "href" ? formData.link_href : "",
    );
    dataToSend.append(
      "link_path",
      linkType === "path" ? formData.link_path : "",
    );
    dataToSend.append("content", editorText);

    try {
      const response = await axios.post("/admin/help/create", dataToSend, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success(response.data.success);
        setFormData({
          title: "",
          summary: "",
          color: "",
          filter: "",
          link_title_description: "",
          link_title: "",
          link_href: "",
          link_path: "",
        });
        setEditorText("");
        if (editorRef.current) {
          editorRef.current.textContent = "";
        }
      }

      return response.data;
    } catch (error: any) {
      console.log("error", error);
      const errorMessage = error?.response?.data.error;
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="create-help-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Создание публикации</h1>
        <p>Создайте новую публикацию для справочного центра.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("help:settings")}
      >
        ← Назад
      </a>

      <div className={styles["editor-container"]}>
        <h1 className={styles["editor-title"]}>Создание новой публикации</h1>

        <form className={styles["editor-form"]} onSubmit={handleSubmit}>
          <div className={styles["editor-left-side"]}>
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
                placeholder="Введите броский заголовок..."
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
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <label className={styles["form-label"]} htmlFor="link_title">
                Название ссылки
              </label>
              <input
                type="text"
                name="link_title"
                id="link_title"
                onChange={handleChange}
                value={formData.link_title}
                className={styles["form-input"]}
                placeholder="Введите желаемый текст..."
                required
              />
            </div>

            <div className={styles["form-group"]}>
              <div style={{ marginTop: "5px", display: "flex", gap: "10px" }}>
                <label
                  className={styles["form-label"]}
                  htmlFor="href"
                  style={{ display: "flex", gap: "5px" }}
                >
                  Ссылка
                  <input
                    type="radio"
                    id="href"
                    checked={linkType === "href" ? true : false}
                    className={styles["liquid-radio"]}
                    onChange={() => setLinkType("href")}
                  />
                </label>
                <label
                  className={styles["form-label"]}
                  htmlFor="path"
                  style={{ marginLeft: "auto", display: "flex", gap: "5px" }}
                >
                  Путь
                  <input
                    type="radio"
                    id="path"
                    checked={linkType === "path" ? true : false}
                    className={styles["liquid-radio"]}
                    onChange={() => setLinkType("path")}
                  />
                </label>
              </div>
              {linkType === "href" ? (
                <>
                  <input
                    type="text"
                    name="link_href"
                    id="link_href"
                    onChange={handleChange}
                    value={formData.link_href}
                    className={styles["form-input"]}
                    placeholder="Введите желаемый текст..."
                    required
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="link_path"
                    id="link_path"
                    onChange={handleChange}
                    value={formData.link_path}
                    className={styles["form-input"]}
                    placeholder="Введите желаемый текст..."
                    required
                  />
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div className={styles["form-group"]} style={{ width: "50%" }}>
                <label className={styles["form-label"]} htmlFor="color">
                  Цвет иконки (color)
                </label>
                <input
                  style={{
                    height: "60px",
                  }}
                  type="color"
                  name="color"
                  id="color"
                  onChange={handleChange}
                  value={formData.color}
                  className={styles["form-input-color"]}
                  required
                />
              </div>

              <div className={styles["form-group"]} style={{ width: "50%" }}>
                <label className={styles["form-label"]} htmlFor="filter">
                  Блики (filter)
                </label>
                <input
                  style={{
                    height: "60px",
                  }}
                  type="color"
                  name="filter"
                  id="filter"
                  onChange={handleChange}
                  value={formData.filter}
                  className={styles["form-input-color"]}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles["editor-right-side"]}>
            <br />
            <label className={styles["form-label"]}>Содержимое</label>
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
              Опубликовать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
