import { useEffect, useState } from "react";

import styles from "../AdminPanel/Card.AdminPanel.module.css";

import useContentRender from "../../../tools/ContentRender";
import { ContentLoading } from "../../../components/LoadingPage/ContentLoading";
import { ErrorPage } from "../../../components/ErrorPage/Error";

interface LogsPost {
  date: string;
  time: string;
  level: string;
  message: string;
}

export const LogsPage = () => {
  const [logsType, setLogsType] = useState<string>("all");
  const [logs, setLogs] = useState<LogsPost[]>([]);

  const { contentData, contentLoading, contentError } =
    useContentRender(`/admin/logs`);

  useEffect(() => {
    if (!contentData) return;

    const logString = contentData.renderData;

    // const logRegex =
    //   /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [\s\(\S\)]*?(?=\s*\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}|\$)/g;

    // const logArray = logString.match(logRegex) || [];

    const logArray = logString
      .split("\n")
      .filter((line: string) => line.trim() !== "");

    const formattedLogs = logArray.map((log: any) => {
      const parts = log.split(" ");

      const [year, month, day] = parts[0].split("-");

      const setDate = `${day}.${month}.${year}`;

      return {
        date: setDate,
        time: parts[1],
        level: parts[2].slice(1, -2).toLowerCase(),
        message: parts.slice(3).join(" "),
      };
    });

    setLogs(formattedLogs);
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

  return (
    <div id="logs-page" className={`${styles["page"]} ${styles["active"]}`}>
      <header className={styles["header"]}>
        <h1>Системные логи</h1>
        <p>Последние зафиксированные события и ошибки на сервере.</p>
      </header>

      <div className={styles["card-actions"]}>
        <button
          onClick={() => setLogsType("all")}
          className={`${styles["card-action-btn"]} ${logsType === "all" ? styles["active"] : ""}`}
        >
          Все
        </button>
        <button
          onClick={() => setLogsType("info")}
          className={`${styles["card-action-btn"]} ${logsType === "info" ? styles["active"] : ""}`}
        >
          ОК
        </button>
        <button
          onClick={() => setLogsType("warn")}
          className={`${styles["card-action-btn"]} ${logsType === "warn" ? styles["active"] : ""}`}
        >
          Внимание
        </button>
        <button
          onClick={() => setLogsType("error")}
          className={`${styles["card-action-btn"]} ${logsType === "error" ? styles["active"] : ""}`}
        >
          Критическая
        </button>
      </div>

      <div className={styles["table-container"]}>
        {logs && logs.length > 0 ? (
          <table className={styles["admin-table"]}>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Время</th>
                <th>Тип</th>
                <th>Сообщение</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {logs
                .filter((log) => {
                  if (logsType === "all") {
                    return true;
                  }
                  return log.level === logsType;
                })
                .map((log: any, index: number) => {
                  const status = log.level;
                  return (
                    <tr key={index}>
                      <td style={{ whiteSpace: "nowrap" }}>{log.date}</td>
                      <td>{log.time}</td>
                      <td
                        className={
                          styles[
                            status === "info"
                              ? "type-info"
                              : status === "warn"
                                ? "type-warning"
                                : "type-error"
                          ]
                        }
                      >
                        {log.level.toUpperCase()}
                      </td>
                      <td className={styles["status-message"]}>
                        {log.message}
                      </td>
                      <td>
                        <span
                          className={`${styles["status-badge"]} ${styles[status === "info" ? "status-ok" : status === "warn" ? "status-warning" : "status-critical"]}`}
                        >
                          {status === "info"
                            ? "ОК"
                            : status === "warn"
                              ? "Внимание"
                              : "Критическая"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : null}
        {/* <table className={styles["admin-table"]}>
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
              <td className={styles["status-message"]}>
                Failed to connect to Database node_02 (Timeout)
              </td>
              <td>
                <span
                  className={`${styles["status-badge"]} ${styles["status-critical"]}`}
                >
                  Критическая
                </span>
              </td>
            </tr>
            <tr>
              <td>22:42:05</td>
              <td className={styles["type-warning"]}>WARN</td>
              <td className={styles["status-message"]}>
                API Request from IP 192.168.1.45 exceeded rate limit
              </td>
              <td>
                <span
                  className={`${styles["status-badge"]} ${styles["status-warning"]}`}
                >
                  Внимание
                </span>
              </td>
            </tr>
            <tr>
              <td>22:38:19</td>
              <td className={styles["type-info"]}>INFO</td>
              <td className={styles["status-message"]}>
                User Alex_Creator successfully logged in
              </td>
              <td>
                <span
                  className={`${styles["status-badge"]} ${styles["status-ok"]}`}
                >
                  Ок
                </span>
              </td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
};
