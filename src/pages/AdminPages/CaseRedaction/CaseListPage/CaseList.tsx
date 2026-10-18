import { ChangeEvent, useEffect, useState } from "react";

import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";
import styles from "./Card.CaseList.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

import toast from "react-hot-toast";

interface CasePost {
  _id: string;
  name: string;
  rarity: string;
  priority: string;
}

// interface CardResponse {
//   id?: string;
//   renderData: {
//     card: CardPost[];
//   };
// }

// interface EditCaseType {
//   id: string;
//   type: string;
// }

import { adminNavigator } from "../../AdminPanel/AdminPanel.tsx";

export const CaseListPage = () => {
  const [caseList, setCaseList] = useState<CasePost[]>([]);

  const [isCaseDelete, setIsCaseDelete] = useState<string | null>(null);

  const { contentData, contentLoading, contentError } =
    useContentRender(`/admin/case/list`);

  const handleRemoveCase = async (
    case_id: string,
    e: ChangeEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/admin/case/${case_id}/delete`, {
        withCredentials: true,
      });

      if (response.data.success) {
        console.log("Кейс успешно удалён:", response.data);

        toast.success(response.data.success);

        const updatedCaseList = caseList.filter((item) => item._id !== case_id);

        setCaseList(updatedCaseList);
        setIsCaseDelete(null);
      }

      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!contentData || !Array.isArray(contentData.renderData.cases)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    console.log("contentData", contentData);

    setCaseList(contentData.renderData.cases);
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div
      id="case-list-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Список кейсов</h1>
        <p>Управление кейсами и их содержимым.</p>
      </header>

      <a
        className={admin_styles["on-back"]}
        onClick={() => adminNavigator.handleChangeTab("case:settings")}
      >
        ← Назад
      </a>

      <br />
      <br />
      <br />

      <section className={styles["posts-grid-section"]}>
        {caseList && caseList.length > 0 ? (
          caseList
            .sort((a, b) => a.priority.localeCompare(b.priority))
            .map((caseItem, index) => {
              return (
                <article key={index} className={styles["grid-card"]}>
                  <div className={styles["card-body"]}>
                    <h3>{caseItem.name}</h3>
                    <p>Тип: {caseItem.rarity}</p>
                    <p>id: {caseItem._id}</p>
                    <p>Приоритет: {caseItem.priority}</p>
                    <ul className={styles["actions-menu"]}>
                      <li className={styles["actions-menu-btn"]}>
                        <button
                          type="button"
                          onClick={() =>
                            adminNavigator.handleChangeTab(
                              `case:editData:id_${caseItem._id.toString()}`,
                            )
                          }
                        >
                          Данные
                        </button>
                      </li>
                      <li className={styles["actions-menu-btn"]}>
                        <button
                          type="button"
                          onClick={() =>
                            adminNavigator.handleChangeTab(
                              `case:editContent:id_${caseItem._id.toString()}`,
                            )
                          }
                        >
                          Содержимое
                        </button>
                      </li>
                      <li
                        className={`${styles["actions-menu-btn"]} ${styles["remove-case-btn"]}`}
                      >
                        <button
                          type="button"
                          onClick={(e) =>
                            setIsCaseDelete(caseItem._id.toString())
                          }
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

      {isCaseDelete !== null && (
        <div className={styles["menu-wrapper"]}>
          <div className={styles["action-menu"]}>
            <h2>Удалить кейс</h2>
            <div className={styles["action-options"]}>
              <div className={styles["options-group"]}>
                Удалить кейс с ID: {isCaseDelete}?
              </div>
            </div>
            <br />
            <div className={styles["action-menu-btn"]}>
              <button onClick={(e) => handleRemoveCase(isCaseDelete, e)}>
                <span>Удалить</span>
              </button>
              <button onClick={() => setIsCaseDelete(null)}>
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
