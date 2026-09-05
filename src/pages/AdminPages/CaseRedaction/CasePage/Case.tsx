import { useState } from "react";

import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import { CaseListPage } from "../CaseListPage/CaseList";
import { CreateCasePage } from "../CreateCasePage/CreateCase";

type CaseAction = "List" | "Create" | null;

export const CasePage = () => {
  const [currentAction, setCurrentAction] = useState<CaseAction>(null);

  const handleBack = () => setCurrentAction(null);

  if (currentAction === "List") return <CaseListPage onBack={handleBack} />;
  if (currentAction === "Create") return <CreateCasePage onBack={handleBack} />;

  return (
    <div
      id="case-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Список кейсов</h1>
        <p>Управление кейсами и их данными.</p>
      </header>

      <div className={admin_styles["container-grid"]}>
        <div
          className={`${admin_styles["tool-card"]} ${admin_styles["accent"]}`}
          onClick={() => setCurrentAction("List")}
        >
          <div className={admin_styles["tool-icon"]}>
            <svg viewBox="0 0 24 24">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h3>Список кейсов</h3>
          <p>Список созданных кейсов.</p>
        </div>

        <div
          className={`${admin_styles["tool-card"]}`}
          onClick={() => setCurrentAction("Create")}
        >
          <div className={admin_styles["tool-icon"]}>
            <svg viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <h3>Создать кейс</h3>
          <p>Создать новый, уникальный кейс.</p>
        </div>
      </div>
    </div>
  );
};
