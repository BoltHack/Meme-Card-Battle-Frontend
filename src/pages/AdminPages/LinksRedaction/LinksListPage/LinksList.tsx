import { ChangeEvent, useEffect, useState } from "react";

import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";
import links_styles from "./Card.LinksList.module.css";
import styles from "../../CaseRedaction/CaseListPage/Card.CaseList.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";
import toast from "react-hot-toast";

interface LinksPost {
  id: string;
  name: string;
  link: string;
  icon: string;
  priority: number;
  main_priority: boolean;
}

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const LinksListPage = () => {
  const [linksList, setLinksList] = useState<LinksPost[]>([]);

  const [isLinkDelete, setIsListDelete] = useState<string | null>(null);

  const { contentData, contentLoading, contentError } = useContentRender(
    `${api.API_BASE_URL}/admin/links/list`,
  );

  const handleRemoveLink = async (
    link_id: string,
    e: ChangeEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/links/${link_id}/delete`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        console.log("Ссылка успешно удалена:", response.data);

        toast.success(response.data.success);

        const updatedCaseList = linksList.filter((item) => item.id !== link_id);

        setLinksList(updatedCaseList);
        setIsListDelete(null);
      }

      return response.data;
    } catch (error) {
      console.log("error", error);
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

    console.log("contentData", contentData);

    setLinksList(contentData.renderData);
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="links-list-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Список ссылок</h1>
        <p>Управление ссылками соц-сетей и их содержимым.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("links:settings")}
      >
        ← Назад
      </a>

      <br />
      <br />
      <br />

      <section className={styles["posts-grid-section"]}>
        {linksList && linksList.length > 0 ? (
          linksList
            .sort((a, b) =>
              a.priority.toString().localeCompare(b.priority.toString()),
            )
            .map((item, index) => {
              return (
                <article key={index} className={styles["grid-card"]}>
                  <div className={links_styles["link-container"]}>
                    <div className={links_styles["link-card"]}>
                      <div className={styles["featured-image"]}>
                        <img
                          loading="lazy"
                          className={styles["img-placeholder"]}
                          style={{
                            width: "100px",
                            height: "auto",
                          }}
                          src={`${api.API_BASE_URL}/${item.icon}`}
                          alt="Platform icon"
                        />
                      </div>
                      <div className={styles["card-body"]}>
                        <h3>{item.name}</h3>
                        <p>ID: {item.id}</p>
                        <p>Ссылка: {item.link}</p>
                        <p>Приоритет: {item.priority}</p>
                        <p>Main priority: {item.main_priority}</p>
                      </div>
                    </div>
                    <ul className={styles["actions-menu"]}>
                      <li className={styles["actions-menu-btn"]}>
                        <button
                          type="button"
                          onClick={() =>
                            adminNavigator.handleChangeTab(
                              `links:edit:id_${item.id}`,
                            )
                          }
                        >
                          Редактировать
                        </button>
                      </li>
                      <li
                        className={`${styles["actions-menu-btn"]} ${links_styles["remove-link-btn"]}`}
                      >
                        <button
                          type="button"
                          onClick={(e) => setIsListDelete(item.id, e)}
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

      {isLinkDelete !== null && (
        <div className={styles["menu-wrapper"]}>
          <div className={styles["action-menu"]}>
            <h2>Удалить ссылку</h2>
            <div className={styles["action-options"]}>
              <div className={styles["options-group"]}>
                Удалить ссылку с ID: {isLinkDelete}?
              </div>
            </div>
            <br />
            <div className={styles["action-menu-btn"]}>
              <button onClick={(e) => handleRemoveLink(isLinkDelete, e)}>
                <span>Удалить</span>
              </button>
              <button onClick={() => setIsListDelete(null)}>
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
