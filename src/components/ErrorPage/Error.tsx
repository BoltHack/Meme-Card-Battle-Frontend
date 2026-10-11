import { Helmet } from "react-helmet-async";
// import { Link } from "react-router-dom";

import styles from "./Card.Error.module.css";

interface ErrorDetails {
    code: string | number;
    message: string;
}

interface ErrorData {
    error: ErrorDetails;
}

export const ErrorPage = ({ error }: ErrorData) => {
    const { code, message } = error;

    return (
        <div className={styles["body-wrapper"]}>
            <Helmet>
                <title>Ошибка {code.toString()}</title>
            </Helmet>

            <div className={styles["container"]}>
                <h1>{code}</h1>
                <h2>Произошла ошибка</h2>
                <p>{message}</p>
                {/*<p>Похоже, эта страница вышла из игры или её никогда не существовало. Давайте вернемся в главное меню.</p>*/}
                <a href="/">На главную</a>
            </div>

        </div>
    );
};