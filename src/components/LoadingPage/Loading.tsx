import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Cookies from "js-cookie";

import styles from "./Card.Loading.module.css";

import usePageRender from "../../tools/PageRender.ts";

export const LoadingPage = () => {
  const navigate = useNavigate();
  const pageLocation = useLocation();

  const [isRefetch, setIsRefetch] = useState<boolean | false>(false);
  const currentUrl = useRef<string | null>(null);

  const targetUrl = isRefetch ? `/api${pageLocation.pathname}` : null;

  const { data, loading, url, refetch } = usePageRender(
    currentUrl.current !== null ? currentUrl.current : targetUrl!,
  );

  const active_session = sessionStorage.getItem("active_session");
  const active_session_cookies = Cookies.get("active_session");

  currentUrl.current = url;

  useEffect(() => {
    const checkFetchStatus = setTimeout(() => {
      setIsRefetch(true);
    }, 5000);

    return () => clearTimeout(checkFetchStatus);
  }, [pageLocation.pathname]);

  useEffect(() => {
    // if (!isRefetch || data && !loading) return;
    if (!isRefetch) return;

    const interval = setInterval(() => {
      refetch();
      if (!active_session && !active_session_cookies) {
        const session_id = crypto.randomUUID();
        sessionStorage.setItem("active_session", session_id);
        Cookies.set("active_session", session_id, {
          expires: new Date(new Date().getTime() + 15 * 60 * 1000),
          path: "/",
          secure: true,
          sameSite: "strict",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRefetch, refetch]);

  useEffect(() => {
    if (data && !loading) {
      navigate(0);
    }
  }, [data, loading]);

  return (
    <div className={styles["body-wrapper"]}>
      <div className={styles["parallax-wrapper"]}>
        <Helmet>
          <title>
            {window.location.pathname === "/play"
              ? "Meme Card Battle"
              : "Загрузка"}
          </title>
        </Helmet>

        <div className={styles["smoke-glow smoke-red"]}></div>
        <div
          className={`${styles["smoke-glow"]} ${styles["smoke-blue"]}`}
        ></div>
        <div
          className={`${styles["smoke-glow"]} ${styles["smoke-purple"]}`}
        ></div>

        <div className={styles["halftone-overlay"]}></div>

        <div className={styles["star-particles"]}></div>

        <div className={`${styles["shard"]} ${styles["shard-1"]}`}></div>
        <div className={`${styles["shard"]} ${styles["shard-2"]}`}></div>

        <svg
          className={`${styles["lightning"]} ${styles["lightning-right"]}`}
          viewBox="0 0 24 24"
        >
          <path d="M19 9h-6l3-7L5 13h6l-3 9z" />
        </svg>

        <div className={styles["card-layer"]}>
          <div className={`${styles["premium-card"]} ${styles["card-king"]}`}>
            <div></div>
            <div className={styles["card-suit-center"]}>?</div>
            <div className={styles["card-suit-bottom"]}></div>
          </div>

          <div
            className={`${styles["premium-card"]} ${styles["card-ace-spades"]}`}
          >
            <div></div>
            <div className={styles["card-suit-center"]}>?</div>
            <div className={styles["card-suit-bottom"]}></div>
          </div>
          <div
            className={`${styles["premium-card"]} ${styles["card-ace-diamonds"]}`}
          >
            <div></div>
            <div className={styles["card-suit-center"]}>?</div>
            <div className={styles["card-suit-bottom"]}></div>
          </div>
        </div>

        <div className={styles["epic-title"]}>
          <h1>MCB</h1>
          <p>
            {!active_session && !active_session_cookies
              ? "Проверка браузера"
              : "Загрузка данных"}
          </p>
          <div className={styles["loader"]}></div>
        </div>
      </div>
    </div>
  );
};
