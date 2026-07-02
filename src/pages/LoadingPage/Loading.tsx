import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import styles from "./Card.Loading.module.css";

export const LoadingPage = () => {

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
                        <div>K</div>
                        <div className={styles["card-suit-center"]}>♥</div>
                        <div className={styles["card-suit-bottom"]}>K</div>
                    </div>

                    <div className={`${styles["premium-card"]} ${styles["card-ace-spades"]}`}>
                        <div>A</div>
                        <div className={styles["card-suit-center"]}>♠</div>
                        <div className={styles["card-suit-bottom"]}>A</div>
                    </div>
                    <div className={`${styles["premium-card"]} ${styles["card-ace-diamonds"]}`}>

                        <div>A</div>
                        <div className={styles["card-suit-center"]}>♦</div>
                        <div className={styles["card-suit-bottom"]}>A</div>
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
