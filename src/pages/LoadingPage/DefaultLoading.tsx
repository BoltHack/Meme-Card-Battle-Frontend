import styles from "./Card.DefaultLoading.module.css";

export const DefaultLoading = () => {

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
