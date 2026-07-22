import styles from "../AdminPanel/Card.AdminPanel.module.css";

export const LogsPage = () => {

    return (
        <div id="logs-page" className={`${styles["page"]} ${styles["active"]}`}>
            <header className={styles["header"]}>
                <h1>Системные логи</h1>
                <p>Последние зафиксированные события и ошибки на сервере.</p>
            </header>

            <div className={styles["table-container"]}>
                <table className={styles["admin-table"]}>
                    <thead>
                    <tr>
                        <th>Время</th>
                        <th>Тип</th>
                        <th>Сообщение</th>
                        <th>Статус</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>22:45:12</td>
                        <td className={styles["type-error"]}>ERROR</td>
                        <td>Failed to connect to Database node_02 (Timeout)</td>
                        <td><span className={`${styles["status-badge"]} ${styles["status-critical"]}`}>Критическая</span></td>
                    </tr>
                    <tr>
                        <td>22:42:05</td>
                        <td className={styles["type-warning"]}>WARN</td>
                        <td>API Request from IP 192.168.1.45 exceeded rate limit</td>
                        <td><span className={`${styles["status-badge"]} ${styles["status-warning"]}`}>Внимание</span></td>
                    </tr>
                    <tr>
                        <td>22:38:19</td>
                        <td className={styles["type-info"]}>INFO</td>
                        <td>User Alex_Creator successfully logged in</td>
                        <td><span className={`${styles["status-badge"]} ${styles["status-ok"]}`}>Ок</span></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

};