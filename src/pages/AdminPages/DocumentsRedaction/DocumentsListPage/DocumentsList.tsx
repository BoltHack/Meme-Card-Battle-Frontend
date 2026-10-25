import { ChangeEvent, useEffect, useState } from "react";

import styles from "./Card.DocumentsList.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

interface ItemsPost {
  id: string;
  path_name: string;
  title: string;
  summary: string;
  isVisibility: string;
}

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";
import toast from "react-hot-toast";

export const DocumentsListPage = () => {
  const [itemList, setItemList] = useState<ItemsPost[]>([]);
  const [isItemDeleteMenu, setIsItemDeleteMenu] = useState<string | null>(null);

  const { contentData, contentLoading, contentError } = useContentRender(
    `/admin/documents/list`,
  );

  const handleRemoveItem = async (
    removeId: string,
    e: ChangeEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/admin/documents/${removeId}/delete`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setItemList(itemList.filter((item) => item.id !== removeId));
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

    setItemList(contentData.renderData);
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="documents-list-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Список документов</h1>
        <p>Просматривайте, редактируйте и удаляйте данные.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("documents:settings")}
      >
        ← Назад
      </a>

      <br />
      <br />
      <br />

      <section className={styles["posts-grid-section"]}>
        {itemList && itemList.length > 0 ? (
          itemList.map((item, index) => {
            return (
              <article key={index} className={styles["grid-card"]}>
                <div className={styles["card-body"]}>
                  <h3>{item.title}</h3>
                  <p>Путь: {item.path_name}</p>
                  <p>ID: {item.id}</p>
                  <p>{item.summary}</p>
                  <p>Видимость: {String(item.isVisibility)}</p>
                  <ul className={styles["actions-menu"]}>
                    <li className={styles["actions-menu-btn"]}>
                      <button
                        type="button"
                        onClick={() =>
                          adminNavigator.handleChangeTab(
                            `documents:edit:id_${item.id}`,
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
                        onClick={() => setIsItemDeleteMenu(item.id)}
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
