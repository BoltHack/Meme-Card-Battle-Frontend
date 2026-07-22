import styles from "../AdminPanel/Card.AdminPanel.module.css";
import {Dispatch, SetStateAction} from "react";

interface TitleSettings {
    setActiveTab: Dispatch<SetStateAction<string>>;
}

export const ToolsPage = ({ setActiveTab }: TitleSettings) => {

    return (
        <div id="tools-page" className={`${styles["page"]} ${styles["active"]}`}>
            <header className={styles["header"]}>
                <h1>Панель управления</h1>
                <p>Выберите необходимый инструмент администрирования.</p>
            </header>

            <div className={styles["tools-grid"]}>
                <div className={styles["tool-card"]} onClick={() => setActiveTab("TeamPage")}>
                    <div className={styles["tool-icon"]}>
                        <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <h3>Управление администраторами</h3>
                    <p>Просмотр текущего состава команды, выдача прав, назначение модераторов.</p>
                </div>

                <div className={`${styles["tool-card"]} ${styles["accent"]}`} onClick={() => setActiveTab("CreateBlogPage")}>
                    <div className={styles["tool-icon"]}>
                        <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/></svg>
                    </div>
                    <h3>Редактор новостей</h3>
                    <p>Публикация новых статей, редактирование существующих материалов и блогов.</p>
                </div>

                <div className={styles["tool-card"]} onClick={() => setActiveTab("LogsPage")}>
                    <div className={styles["tool-icon"]}>
                        <svg viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
                    </div>
                    <h3>Журнал ошибок</h3>
                    <p>Мониторинг логов сервера, отслеживание сбоев и подозрительной активности.</p>
                </div>
            </div>
        </div>
    );

};