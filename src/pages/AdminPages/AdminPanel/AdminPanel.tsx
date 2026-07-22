import { useState } from "react";
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
import { CreateBlogPage } from "../CreateBlog/CreateBlogPage.tsx";
import {CreateCardPage} from "../CreateCard/CreateCardPage.tsx";

interface titleSettings {
    title: string;
}

type AdminPageType = "ToolsPage" | "TeamPage" | "CreateCardPage" | "CreateBlogPage" | "LogsPage" | "SettingsPage";

export const AdminPanelPage = ({ title }: titleSettings) => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<AdminPageType>("ToolsPage");

    const { loading, error } = usePageRender(
        `${api.API_BASE_URL}/admin/panel`
    );

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage error={error} />

    return (
        <div className={styles["body-wrapper"]}>

            <Helmet>
                <title>{title}</title>
            </Helmet>

            <aside className={styles["sidebar"]}>
                <div className={styles["logo"]} onClick={() => navigate("/")}>ADMIN // PANEL</div>
                <nav>
                    <ul className={styles["menu-list"]}>
                        <li>
                            <div className={`${styles["menu-link"]} ${activeTab === "ToolsPage" && styles["active"]}`} onClick={() => setActiveTab('ToolsPage')}>
                                <svg viewBox="0 0 24 24">
                                    <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
                                </svg>
                                Инструменты
                            </div>
                        </li>
                        <li>
                            <div className={`${styles["menu-link"]} ${activeTab === "TeamPage" && styles["active"]}`} onClick={() => setActiveTab('TeamPage')}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                </svg>
                                Команда (Админы)
                            </div>
                        </li>
                        <li>
                            <div className={`${styles["menu-link"]} ${activeTab === "CreateCardPage" && styles["active"]}`} onClick={() => setActiveTab('CreateCardPage')}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-gamepad-directional-icon lucide-gamepad-directional">
                                    <path d="M11.146 15.854a1.207 1.207 0 0 1 1.708 0l1.56 1.56A2 2 0 0 1 15 18.828V21a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.172a2 2 0 0 1 .586-1.414z"/><path d="M18.828 15a2 2 0 0 1-1.414-.586l-1.56-1.56a1.207 1.207 0 0 1 0-1.708l1.56-1.56A2 2 0 0 1 18.828 9H21a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"/><path d="M6.586 14.414A2 2 0 0 1 5.172 15H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.172a2 2 0 0 1 1.414.586l1.56 1.56a1.207 1.207 0 0 1 0 1.708z"/><path d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2.172a2 2 0 0 1-.586 1.414l-1.56 1.56a1.207 1.207 0 0 1-1.708 0l-1.56-1.56A2 2 0 0 1 9 5.172z"/>
                                </svg>
                                Создать новую карту
                            </div>
                        </li>
                        <li>
                            <div className={`${styles["menu-link"]} ${activeTab === "CreateBlogPage" && styles["active"]}`} onClick={() => setActiveTab('CreateBlogPage')}>
                                <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Создать статью (Блог)
                            </div>
                        </li>
                        <li>
                            <div className={`${styles["menu-link"]} ${activeTab === "LogsPage" && styles["active"]}`} onClick={() => setActiveTab('LogsPage')}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                                </svg>
                                Логи системы
                            </div>
                        </li>
                        <li>
                            <div className={`${styles["menu-link"]} ${activeTab === "SettingsPage" && styles["active"]}`} onClick={() => setActiveTab('SettingsPage')}>
                                <svg viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                </svg>
                                Настройки
                            </div>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className={styles["main-content"]}>

                {activeTab === "ToolsPage" && <ToolsPage setActiveTab={setActiveTab} />}
                {activeTab === "TeamPage" && <TeamPage />}
                {activeTab === "CreateCardPage" && <CreateCardPage />}
                {activeTab === "CreateBlogPage" && <CreateBlogPage />}
                {activeTab === "LogsPage" && <LogsPage />}
                {/*<div id="team-page" className={styles["page"]}>*/}
                {/*    <header className={styles["header"]}>*/}
                {/*        <h1>Состав администрации</h1>*/}
                {/*        <p>Управление уровнями доступа и модераторами проекта.</p>*/}
                {/*    </header>*/}

                {/*    <div className={styles["team-grid"]}>*/}

                {/*        <div className={`${styles["team-card"]} ${styles["admin"]}`}>*/}
                {/*            <div className={styles["team-avatar"]}>A</div>*/}
                {/*            <div className={styles["team-info"]}>*/}
                {/*                <h3 className={styles["team-name"]}>Alex_Creator</h3>*/}
                {/*                <span className={`${styles["role-badge"]} ${styles["admin-tag"]}`}>Главный Админ</span>*/}
                {/*            </div>*/}
                {/*            <button className={styles["action-btn"]} title="Настройки">*/}
                {/*                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>*/}
                {/*            </button>*/}
                {/*        </div>*/}

                {/*        <div className={`${styles["team-card"]} ${styles["moder"]}`}>*/}
                {/*            <div className={styles["team-avatar"]}>M</div>*/}
                {/*            <div className={styles["team-info"]}>*/}
                {/*                <h3 className={styles["team-name"]}>Dmitry_Mod</h3>*/}
                {/*                <span className={`${styles["role-badge"]} ${styles["moder-tag"]}`}>Модератор чата</span>*/}
                {/*            </div>*/}
                {/*            <button className={styles["action-btn"]} title="Настройки">*/}
                {/*                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>*/}
                {/*            </button>*/}
                {/*        </div>*/}

                {/*    </div>*/}
                {/*</div>*/}

                {/*<div id="editor-page" className={styles["page"]}>*/}
                {/*    <header className={styles["header"]}>*/}
                {/*        <h1>Создание новой публикации</h1>*/}
                {/*        <p>Заполните поля ниже, чтобы опубликовать новость на главную страницу сайта.</p>*/}
                {/*    </header>*/}

                {/*    <form className={styles["admin-form"]} onSubmit={(event) => { event.preventDefault(); alert('Статья успешно сохранена!'); }}>*/}
                {/*        <div className={styles["form-group"]}>*/}
                {/*            <label>Заголовок статьи</label>*/}
                {/*            <input type="text" placeholder="Введите броский заголовок..." required />*/}
                {/*        </div>*/}
                {/*        <div className={styles["form-group"]}>*/}
                {/*            <label>Категория публикации</label>*/}
                {/*            <select>*/}
                {/*                <option>Обновления системы</option>*/}
                {/*                <option>Ивенты и события</option>*/}
                {/*                <option>Важные объявления</option>*/}
                {/*            </select>*/}
                {/*        </div>*/}
                {/*        <div className={styles["form-group"]}>*/}
                {/*            <label>Текст новости (Markdown / HTML)</label>*/}
                {/*            <textarea rows="8" placeholder="Напишите здесь основной текст статьи..."></textarea>*/}
                {/*        </div>*/}
                {/*        <button type="submit" className={`${styles["submit-btn"]} ${styles["pink-btn"]}`}>Опубликовать материал</button>*/}
                {/*    </form>*/}
                {/*</div>*/}

                {/*<div id="logs-page" className={styles["page"]}>*/}
                {/*    <header className={styles["header"]}>*/}
                {/*        <h1>Системные логи</h1>*/}
                {/*        <p>Последние зафиксированные события и ошибки на сервере.</p>*/}
                {/*    </header>*/}

                {/*    <div className={styles["table-container"]}>*/}
                {/*        <table className={styles["admin-table"]}>*/}
                {/*            <thead>*/}
                {/*            <tr>*/}
                {/*                <th>Время</th>*/}
                {/*                <th>Тип</th>*/}
                {/*                <th>Сообщение</th>*/}
                {/*                <th>Статус</th>*/}
                {/*            </tr>*/}
                {/*            </thead>*/}
                {/*            <tbody>*/}
                {/*            <tr>*/}
                {/*                <td>22:45:12</td>*/}
                {/*                <td className={styles["type-error"]}>ERROR</td>*/}
                {/*                <td>Failed to connect to Database node_02 (Timeout)</td>*/}
                {/*                <td><span className={`${styles["status-badge"]} ${styles["status-critical"]}`}>Критическая</span></td>*/}
                {/*            </tr>*/}
                {/*            <tr>*/}
                {/*                <td>22:42:05</td>*/}
                {/*                <td className={styles["type-warning"]}>WARN</td>*/}
                {/*                <td>API Request from IP 192.168.1.45 exceeded rate limit</td>*/}
                {/*                <td><span className={`${styles["status-badge"]} ${styles["status-warning"]}`}>Внимание</span></td>*/}
                {/*            </tr>*/}
                {/*            <tr>*/}
                {/*                <td>22:38:19</td>*/}
                {/*                <td className={styles["type-info"]}>INFO</td>*/}
                {/*                <td>User Alex_Creator successfully logged in</td>*/}
                {/*                <td><span className={`${styles["status-badge"]} ${styles["status-ok"]}`}>Ок</span></td>*/}
                {/*            </tr>*/}
                {/*            </tbody>*/}
                {/*        </table>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div id="settings-page" className={styles["page"]}>*/}
                {/*    <header className={styles["header"]}>*/}
                {/*        <h1>Глобальные настройки</h1>*/}
                {/*        <p>Управление поведением платформы и безопасностью данных.</p>*/}
                {/*    </header>*/}

                {/*    <div className={styles["settings-box"]}>*/}

                {/*        <div className={styles["settings-row"]}>*/}
                {/*            <div className={styles["settings-text"]}>*/}
                {/*                <h3>Технический режим (Maintenance Mode)</h3>*/}
                {/*                <p>Закрывает доступ к сайту для обычных гостей на время обновления БД.</p>*/}
                {/*            </div>*/}
                {/*            <label className={styles["switch-toggle"]}>*/}
                {/*                <input type="checkbox" />*/}
                {/*                <span className={styles["slider"]}></span>*/}
                {/*            </label>*/}
                {/*        </div>*/}

                {/*        <div className={styles["settings-row"]}>*/}
                {/*            <div className={styles["settings-text"]}>*/}
                {/*                <h3>Двухфакторная аутентификация (2FA)</h3>*/}
                {/*                <p>Требовать одноразовый код от всех модераторов при входе.</p>*/}
                {/*            </div>*/}
                {/*            <label className={styles["switch-toggle"]}>*/}
                {/*                <input type="checkbox" defaultChecked />*/}
                {/*                <span className={styles["slider"]}></span>*/}
                {/*            </label>*/}
                {/*        </div>*/}

                {/*    </div>*/}
                {/*</div>*/}

            </main>

        </div>
    );
};
