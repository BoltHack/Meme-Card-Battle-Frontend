import { useEffect, useState } from "react";

import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";
import styles from "./Card.CaseList.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";

import usePageRender from "../../../../tools/PageRender.ts";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import { DefaultLoading } from "../../../LoadingPage/DefaultLoading.tsx";
import { EditDataPage } from "../EditCasePage/EditData.tsx";
import { EditContentPage } from "../EditCasePage/EditContent.tsx";
// import toast from "react-hot-toast";

interface CasePost {
  id: string;
  name: string;
  rarity: string;
}

// interface CardResponse {
//   id?: string;
//   renderData: {
//     card: CardPost[];
//   };
// }

interface EditCaseType {
  id: string;
  type: string;
}

interface ResponseSettings {
  onBack: () => void;
}

export const CaseListPage = ({ onBack }: ResponseSettings) => {
  const [editCase, setEditCase] = useState<EditCaseType>({
    id: "",
    type: ""
  });

  const [caseList, setCaseList] = useState<CasePost[]>([]);

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/admin/case/list`,
  );

  useEffect(() => {
    if (!data || !Array.isArray(data.renderData.cases)) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setCaseList(data.renderData.cases);
  }, [data]);

  useEffect(() => {
    console.log("caseList обновился:", caseList);
  }, [caseList]);

  if (loading) return <DefaultLoading />;
  if (error) return <ErrorPage error={error} />;

  if (editCase.id !== null && editCase.type === "EditData") return <EditDataPage case_id={editCase.id} onBack={onBack} />;
  if (editCase.id !== null && editCase.type === "EditContent") return <EditContentPage case_id={editCase.id} onBack={onBack} />;

    return (
      <div
        id="case-list-page"
        className={`${admin_styles["page"]} ${admin_styles["active"]}`}
      >
        <header className={admin_styles["header"]}>
          <h1>Список кейсов</h1>
          <p>Управление кейсами и их содержимым.</p>
        </header>

        <a href="#" className={admin_styles["on-back"]} onClick={onBack}>
          ← Назад
        </a>

        <br />
        <br />
        <br />

        <section className={styles["posts-grid-section"]}>
          {caseList && caseList.length > 0
            ? caseList.map((caseItem, index) => {
                return (
                  <article key={index} className={styles["grid-card"]}>
                    <div className={styles["card-body"]}>
                      <h3>{caseItem.name}</h3>
                      <p>Тип: {caseItem.rarity}</p>
                      <ul className={styles["actions-menu"]}>
                        <li className={styles["actions-menu-btn"]}>
                          <button
                            type="button"
                            onClick={() =>
                              setEditCase({
                                id: caseItem._id.toString(),
                                type: "EditData",
                              })
                            }
                          >
                            Данные
                          </button>
                        </li>
                        <li className={styles["actions-menu-btn"]}>
                          <button
                            type="button"
                            onClick={() =>
                              setEditCase({
                                id: caseItem._id.toString(),
                                type: "EditContent",
                              })
                            }
                          >
                            Содержимое
                          </button>
                        </li>
                      </ul>
                    </div>
                  </article>
                );
              })
            : null}
        </section>
      </div>
    );
};