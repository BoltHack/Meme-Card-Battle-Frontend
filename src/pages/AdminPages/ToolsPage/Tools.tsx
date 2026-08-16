import styles from "../AdminPanel/Card.AdminPanel.module.css";
import {Dispatch, SetStateAction} from "react";

type AdminPageType =
    "ToolsPage" | "TeamPage" | "CreateCardPage" |
    "CreateBlogPage" | "LogsPage" | "SettingsPage" |
    "BlogListPage" | "CardListPage";

interface TitleSettings {
    setActiveTab: Dispatch<SetStateAction<AdminPageType>>;
}

export const ToolsPage = ({ setActiveTab }: TitleSettings) => {

    return (
        <div id="tools-page" className={`${styles["page"]} ${styles["active"]}`}>
            <header className={styles["header"]}>
                <h1>Панель управления</h1>
                <p>Выберите необходимый инструмент администрирования.</p>
            </header>

            <div className={styles["container-grid"]}>

                <div className={styles["tool-card"]} onClick={() => setActiveTab("TeamPage")}>
                    <div className={styles["tool-icon"]}>
                        <svg viewBox="0 0 24 24">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <h3>Управление администраторами</h3>
                    <p>Просмотр текущего состава команды, выдача прав, назначение модераторов.</p>
                </div>

                <div className={`${styles["tool-card"]} ${styles["accent"]}`} onClick={() => setActiveTab("CreateBlogPage")}>
                    <div className={styles["tool-icon"]}>
                        <svg viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        </svg>
                    </div>
                    <h3>Редактор блогов</h3>
                    <p>Публикация новых статей, редактирование существующих материалов и блогов.</p>
                </div>

                <div className={styles["tool-card"]} onClick={() => setActiveTab("LogsPage")}>
                    <div className={styles["tool-icon"]}>
                        <svg viewBox="0 0 24 24">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        </svg>
                    </div>
                    <h3>Журнал ошибок</h3>
                    <p>Мониторинг логов сервера, отслеживание сбоев и подозрительной активности.</p>
                </div>

                <div className={`${styles["tool-card"]} ${styles["accent"]}`} onClick={() => setActiveTab("BlogListPage")}>
                    <div className={styles["tool-icon"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-newspaper-icon lucide-newspaper">
                            <path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="10" y="6" rx="1"/>
                        </svg>
                    </div>
                    <h3>Журнал блога</h3>
                    <p>Редактирование и удаление опубликованных и скрытых публикаций.</p>
                </div>

                <div className={styles["tool-card"]} onClick={() => setActiveTab("CardListPage")}>
                    <div className={styles["tool-icon"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gamepad-directional-icon lucide-gamepad-directional"><path d="M11.146 15.854a1.207 1.207 0 0 1 1.708 0l1.56 1.56A2 2 0 0 1 15 18.828V21a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.172a2 2 0 0 1 .586-1.414z"/><path d="M18.828 15a2 2 0 0 1-1.414-.586l-1.56-1.56a1.207 1.207 0 0 1 0-1.708l1.56-1.56A2 2 0 0 1 18.828 9H21a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"/>
                            <path d="M6.586 14.414A2 2 0 0 1 5.172 15H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.172a2 2 0 0 1 1.414.586l1.56 1.56a1.207 1.207 0 0 1 0 1.708z"/><path d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2.172a2 2 0 0 1-.586 1.414l-1.56 1.56a1.207 1.207 0 0 1-1.708 0l-1.56-1.56A2 2 0 0 1 9 5.172z"/>
                        </svg>
                    </div>
                    <h3>Список карт</h3>
                    <p>Редактирование игровых карт.</p>
                </div>

            </div>
        </div>
    );

};