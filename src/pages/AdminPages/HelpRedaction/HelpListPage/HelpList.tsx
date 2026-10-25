import { ChangeEvent, useEffect, useState } from "react";

import styles from "./Card.HelpList.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

interface HelpPost {
  id: string;
  title: string;
  summary: string;
  isVisibility: string;
}

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";
import toast from "react-hot-toast";

export const HelpListPage = () => {
  const [helpList, setHelpList] = useState<HelpPost[]>([]);
  const [isItemDeleteMenu, setIsItemDeleteMenu] = useState<string | null>(null);

  //   const initialBlogState = {
  //     author: "",
  //     title: "",
  //     description: "",
  //     cover: "",
  //     category: "",
  //     date: "",
  //     id: "",
  //   };
  //   const [removeBlogData, setRemoveBlogData] = useState(initialBlogState);

  const { contentData, contentLoading, contentError } =
    useContentRender(`/admin/help/list`);

  const handleRemoveItem = async (
    removeId: string,
    e: ChangeEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/admin/help/${removeId}/delete`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setHelpList(helpList.filter((item) => item.id !== removeId));
        setIsItemDeleteMenu(null);
        toast.success(response.data.success);
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

  useEffect(() => {
    if (!contentData || !Array.isArray(contentData.renderData)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    console.log("data", contentData);

    setHelpList(contentData.renderData);
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="help-list-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Список справочного центра</h1>
        <p>Просматривайте, редактируйте и удаляйте данные.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("help:settings")}
      >
        ← Назад
      </a>

      <br />
      <br />
      <br />

      <section className={styles["posts-grid-section"]}>
        {helpList && helpList.length > 0 ? (
          helpList.map((item, index) => {
            return (
              <article key={index} className={styles["grid-card"]}>
                <div className={styles["card-body"]}>
                  <h3>{item.title}</h3>
                  <p>ID: {item.id}</p>
                  <p>{item.summary}</p>
                  <p>Видимость: {String(item.isVisibility)}</p>
                  <ul className={styles["actions-menu"]}>
                    <li className={styles["actions-menu-btn"]}>
                      <button
                        type="button"
                        onClick={() =>
                          adminNavigator.handleChangeTab(
                            `help:edit:id_${item.id}`,
                          )
                        }
                      >
                        Редактировать
                      </button>
                    </li>

                    <li
                      className={`${styles["actions-menu-btn"]} ${styles["remove-btn"]}`}
                    >
                      <button
                        type="button"
                        onClick={(e) => setIsItemDeleteMenu(item.id)}
                      >
                        Удалить
                      </button>
                    </li>
                  </ul>
                </div>
              </article>
            );
          })
        ) : (
          <p>База данных кейсов пуста.</p>
        )}
      </section>

      {isItemDeleteMenu !== null && (
        <div className={styles["menu-wrapper"]}>
          <div className={styles["action-menu"]}>
            <h2>Удалить элемент</h2>
            <div className={styles["action-options"]}>
              <div className={styles["options-group"]}>
                Удалить элемент с ID: {isItemDeleteMenu}?
              </div>
            </div>
            <br />
            <div className={styles["action-menu-btn"]}>
              <button onClick={(e) => handleRemoveItem(isItemDeleteMenu, e)}>
                {/* <button> */}
                <span>Удалить</span>
              </button>
              <button onClick={() => setIsItemDeleteMenu(null)}>
                <span>Отмена</span>
              </button>
            </div>
            <br />
          </div>
        </div>
      )}
    </div>
  );
};
