import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import styles from "./Card.Loading.module.css";

import usePageRender from "../../tools/PageRender.ts";
import api from "../../api/api.ts";

export const LoadingPage = () => {
    const navigate = useNavigate();
    const pageLocation = useLocation() as any;

    const [isRefetch, setIsRefetch] = useState<boolean | false>(false);

    const targetUrl = isRefetch
        ? `${api.API_BASE_URL}/api${pageLocation.pathname}`
        : null;

    const { data, loading, refetch } = usePageRender(targetUrl!);

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
                    <title>Загрузка</title>
                </Helmet>

                <div className={styles["smoke-glow smoke-red"]}></div>
                <div className={`${styles["smoke-glow"]} ${styles["smoke-blue"]}`}></div>
                <div className={`${styles["smoke-glow"]} ${styles["smoke-purple"]}`}></div>

                <div className={styles["halftone-overlay"]}></div>

                <div className={styles["star-particles"]}></div>

                <div className={`${styles["shard"]} ${styles["shard-1"]}`}></div>
                <div className={`${styles["shard"]} ${styles["shard-2"]}`}></div>

                <svg className={`${styles["lightning"]} ${styles["lightning-right"]}`} viewBox="0 0 24 24">
                    <path d="M19 9h-6l3-7L5 13h6l-3 9z"/>
                </svg>

                <div className={styles["card-layer"]}>

                    <div className={`${styles["premium-card"]} ${styles["card-king"]}`}>
                        <div></div>
                        <div className={styles["card-suit-center"]}>?</div>
                        <div className={styles["card-suit-bottom"]}></div>
                    </div>

                    <div className={`${styles["premium-card"]} ${styles["card-ace-spades"]}`}>
                        <div></div>
                        <div className={styles["card-suit-center"]}>?</div>
                        <div className={styles["card-suit-bottom"]}></div>
                    </div>
                    <div className={`${styles["premium-card"]} ${styles["card-ace-diamonds"]}`}>

                        <div></div>
                        <div className={styles["card-suit-center"]}>?</div>
                        <div className={styles["card-suit-bottom"]}></div>
                    </div>

                </div>

                <div className={styles["epic-title"]}>
                    <h1>MCB</h1>
                    <p>Пожалуйста, подождите...</p>
                    <div className={styles["loader"]}></div>
                </div>

            </div>
        </div>
    );
}