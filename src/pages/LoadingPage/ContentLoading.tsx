import styles from "./Card.ContentLoading.module.css";

export const ContentLoading = () => {

    return (
        <div className={styles["loader"]}>
            <div className={styles["circle"]}>
                <div className={styles["dot"]}></div>
                <div className={styles["outline"]}></div>
            </div>
            <div className={styles["circle"]}>
                <div className={styles["dot"]}></div>
                <div className={styles["outline"]}></div>
            </div>
            <div className={styles["circle"]}>
                <div className={styles["dot"]}></div>
                <div className={styles["outline"]}></div>
            </div>
            <div className={styles["circle"]}>
                <div className={styles["dot"]}></div>
                <div className={styles["outline"]}></div>
            </div>
        </div>
    );
};
