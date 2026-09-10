import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import styles from "./Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import usePageRender from "../../../tools/PageRender.ts";
import { ErrorPage } from "../../ErrorPage/Error.tsx";
import { LoadingPage } from "../../LoadingPage/Loading.tsx";

import { TeamPage } from "../TeamPage/Team.tsx";
import { ToolsPage } from "../ToolsPage/Tools.tsx";
import { LogsPage } from "../LogsPage/Logs.tsx";



import { SettingsPage } from "../SettingsPage/Settings.tsx";

import { BlogSettingsPage } from "../BlogRedaction/BlogSettingsPage/BlogSettings.tsx";
import { BlogListPage } from "../BlogRedaction/BlogListPage/BlogList.tsx";
import { CreateBlogPage } from "../BlogRedaction/CreateBlogPage/CreateBlog.tsx";

import { CardSettingsPage } from "../CardRedaction/CardSettingsPage/CardSettings.tsx";
import { CardListPage } from "../CardRedaction/CardListPage/CardList.tsx";
import { CreateCardPage } from "../CardRedaction/CreateCardPage/CreateCard.tsx";

import { CaseSettingsPage } from "../CaseRedaction/CaseSettingsPage/CaseSettings.tsx";
import { CaseListPage } from "../CaseRedaction/CaseListPage/CaseList.tsx";
import { CreateCasePage } from "../CaseRedaction/CreateCasePage/CreateCase.tsx";
import { EditDataPage } from "../CaseRedaction/EditCasePage/EditData.tsx";
import { EditContentPage } from "../CaseRedaction/EditCasePage/EditContent.tsx";
import { EditBlogPage } from "../BlogRedaction/EditBlog/EditBlog.tsx";

interface titleSettings {
  title: string;
}

type AdminPageType =
  | "ToolsPage"
  | "TeamPage"
  | "CardSettingsPage"
  | "BlogSettingsPage"
  | "LogsPage"
  | "SettingsPage"
  | "BlogListPage"
  | "CaseSettingsPage"
  | "CardListPage";

let edit_id: string = "";

const BlogRedaction = ["blog:settings", "blog:list", "blog:create", "blog:edit"];

const CardRedaction = ["card:settings", "card:list", "card:create"];

const CaseRedaction = [
  "case:settings",
  "case:list",
  "case:create",
  "case:editData",
  "case:editContent",
];

export const adminNavigator = {
  handleChangeTab: (tab: string) => {},
};

export const AdminPanelPage = ({ title }: titleSettings) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("ToolsPage");

  const { loading, error } = usePageRender(`${api.API_BASE_URL}/admin/panel`);

  useEffect(() => {
    adminNavigator.handleChangeTab = (tab: string) => {
      // console.log("edit_id 1", edit_id);
      setActiveTab((prevTab) => {
        console.log("Предыдущая вкладка:", prevTab);
        console.log("Новая вкладка:", tab);

        if (tab.includes("id_")) {
          edit_id = tab.slice(-24);
          tab = tab.slice(-tab.length, -28);
        }

        return tab;
      });
    };

    return () => {
      adminNavigator.handleChangeTab = () => {};
      edit_id = "";
    };
  }, [activeTab]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <aside className={styles["sidebar"]}>
        <div className={styles["logo"]}>ADMIN // PANEL</div>
        <nav>
          <ul className={styles["menu-list"]}>
            <li>
              <div
                className={`${styles["menu-link"]} ${activeTab === "ToolsPage" && styles["active"]}`}
                onClick={() => setActiveTab("ToolsPage")}
              >
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
                Инструменты
              </div>
            </li>
            <li>
              <div
                className={`${styles["menu-link"]} ${activeTab === "TeamPage" && styles["active"]}`}
                onClick={() => setActiveTab("TeamPage")}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Команда (Админы)
              </div>
            </li>
            <li>
              <div
                className={`${styles["menu-link"]} ${CardRedaction.includes(activeTab) && styles["active"]}`}
                onClick={() => setActiveTab(CardRedaction[0])}
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
                  className="lucide lucide-playing-cards-fan-icon lucide-playing-cards-fan"
                >
                  <path d="M12.65 7.65a2 2 0 012.629-1.046l5.51 2.374a2 2 0 011.046 2.628l-3.957 9.184a2 2 0 01-2.628 1.046l-5.51-2.374a2 2 0 01-1.046-2.628z" />
                  <path d="M18 7.777V4a2 2 0 00-2-2h-6a2 2 0 00-2 2v10a2 2 0 001.137 1.805" />
                  <path d="m8 4.389-4.364.809a2 2 0 00-1.602 2.33l1.822 9.833a2 2 0 002.331 1.602l2.542-.47" />
                </svg>
                Карты (Настройка)
              </div>
            </li>
            <li>
              <div
                className={`${styles["menu-link"]} ${BlogRedaction.includes(activeTab) && styles["active"]}`}
                onClick={() => setActiveTab(BlogRedaction[0])}
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
                  className="lucide lucide-newspaper"
                >
                  <path d="M15 18h-5" />
                  <path d="M18 14h-8" />
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
                  <rect width="8" height="4" x="10" y="6" rx="1" />
                </svg>
                Блог (Настройка)
              </div>
            </li>
            <li>
              <div
                className={`${styles["menu-link"]} ${CaseRedaction.includes(activeTab) && styles["active"]}`}
                onClick={() => setActiveTab(CaseRedaction[0])}
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
                  className="lucide lucide-key-square-icon lucide-key-square"
                >
                  <path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z" />
                  <path d="m14 7 3 3" />
                  <path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814" />
                </svg>
                Кейсы (Настройка)
              </div>
            </li>
            <li>
              <div
                className={`${styles["menu-link"]} ${activeTab === "LogsPage" && styles["active"]}`}
                onClick={() => setActiveTab("LogsPage")}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Логи системы
              </div>
            </li>
            <li>
              <div
                className={`${styles["menu-link"]} ${activeTab === "SettingsPage" && styles["active"]}`}
                onClick={() => setActiveTab("SettingsPage")}
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Настройки
              </div>
            </li>

            <li
              style={{
                position: "absolute",
                bottom: "0",
                width: "85%",
                padding: "20px 0",
              }}
            >
              <div
                className={styles["menu-link"]}
                onClick={() => navigate("/")}
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
                  className="lucide lucide-house-icon lucide-house"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                На главную
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={styles["main-content"]}>
        {activeTab === "ToolsPage" && <ToolsPage setActiveTab={setActiveTab} />}
        {activeTab === "TeamPage" && <TeamPage />}

        {activeTab === CardRedaction[0] && <CardSettingsPage />}
        {activeTab === CardRedaction[1] && <CardListPage />}
        {activeTab === CardRedaction[2] && <CreateCardPage />}

        {activeTab === BlogRedaction[0] && <BlogSettingsPage />}
        {activeTab === BlogRedaction[1] && <BlogListPage />}
        {activeTab === BlogRedaction[2] && <CreateBlogPage />}
        {activeTab === BlogRedaction[3] && <EditBlogPage blog_id={edit_id} />}

        {activeTab === CaseRedaction[0] && <CaseSettingsPage />}
        {activeTab === CaseRedaction[1] && <CaseListPage />}
        {activeTab === CaseRedaction[2] && <CreateCasePage />}
        {activeTab === CaseRedaction[3] && <EditDataPage case_id={edit_id} />}
        {activeTab === CaseRedaction[4] && (
          <EditContentPage case_id={edit_id} />
        )}

        {activeTab === "LogsPage" && <LogsPage />}
        {activeTab === "SettingsPage" && <SettingsPage />}
      </main>
    </div>
  );
};
