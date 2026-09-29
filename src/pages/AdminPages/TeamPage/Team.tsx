import { useEffect, useState } from "react";

import styles from "../AdminPanel/Card.AdminPanel.module.css";

import api from "../../../api/api.ts";

import usePageRender from "../../../tools/PageRender.ts";
import { ErrorPage } from "../../ErrorPage/Error.tsx";
import { ContentLoading } from "../../LoadingPage/ContentLoading.tsx";

interface TeamData {
  id: string;
  name: string;
  image: string;
  role: string;
}

export const TeamPage = () => {
  const [team, setTeam] = useState<TeamData[]>([]);

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/admin/team`,
  );

  useEffect(() => {
    if (data && data?.renderData) {
      setTimeout(() => {
        setTeam(data?.renderData);

        console.log("team", data?.renderData);
      }, 0);
    }
  }, [data]);

  if (loading) return <ContentLoading />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div id="team-page" className={`${styles["page"]} ${styles["active"]}`}>
      <header className={styles["header"]}>
        <h1>Состав администрации</h1>
        <p>Управление уровнями доступа и модераторами проекта.</p>
      </header>

      <div className={`${styles["container-grid"]} ${styles["team-grid"]}`}>
        {team && team.length > 0 ? (
          team.map((tm) => {
            return (
              <div
                key={tm.id}
                className={`${styles["team-card"]} ${styles["admin"]}`}
              >
                {tm.image.length > 0 ? (
                  <img
                    src={`${api.API_BASE_URL}/${tm.image}`}
                    className={styles["team-avatar"]}
                  />
                ) : (
                  <div className={styles["team-avatar"]}>
                    {tm.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className={styles["team-info"]}>
                  <h3 className={styles["team-name"]}>
                    {tm.name}{" "}
                    <span style={{ fontSize: "16px" }}>
                      {tm.id === data?.id && " (Вы)"}
                    </span>
                  </h3>
                  <span
                    className={`${styles["role-badge"]} ${styles["admin-tag"]}`}
                  >
                    {tm.role}
                  </span>
                </div>
                <button className={styles["action-btn"]} title="Настройки">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            );
          })
        ) : (
          <p>Пусто</p>
        )}

        {/*<div className={`${styles["team-card"]} ${styles["admin"]}`}>*/}
        {/*    <div className={styles["team-avatar"]}>A</div>*/}
        {/*    <div className={styles["team-info"]}>*/}
        {/*        <h3 className={styles["team-name"]}>Alex_Creator</h3>*/}
        {/*        <span className={`${styles["role-badge"]} ${styles["admin-tag"]}`}>Главный Админ</span>*/}
        {/*    </div>*/}
        {/*    <button className={styles["action-btn"]} title="Настройки">*/}
        {/*        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>*/}
        {/*    </button>*/}
        {/*</div>*/}

        {/*<div className={`${styles["team-card"]} ${styles["moder"]}`}>*/}
        {/*    <div className={styles["team-avatar"]}>M</div>*/}
        {/*    <div className={styles["team-info"]}>*/}
        {/*        <h3 className={styles["team-name"]}>Dmitry_Mod</h3>*/}
        {/*        <span className={`${styles["role-badge"]} ${styles["moder-tag"]}`}>Модератор чата</span>*/}
        {/*    </div>*/}
        {/*    <button className={styles["action-btn"]} title="Настройки">*/}
        {/*        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>*/}
        {/*    </button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};
