import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

import styles from "./Card.Loading.module.css";

import usePageRender from "../../tools/PageRender.ts";
import api from "../../api/api.ts";

interface PlayerData {
    name: string;
    id: string;
}

export const LoadingPage = () => {

    // console.log('setLoading', setLoading);
    // const location = useLocation();
    // const pageLocation = `${api.API_BASE_URL}/api${location.pathname}`;
    //
    // const { refetch } = usePageRender<PlayerData>(pageLocation);
    // console.log('setLoading', setLoading);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         console.log('Запрашиваем новые данные...');
    //         refetch()
    //     }, 5000);
    //
    //     return () => {
    //         clearInterval(interval);
    //     }
    // }, [loading, refetch]);

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
};
