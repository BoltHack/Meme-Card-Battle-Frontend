// import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import styles from "./Card.Error.module.css";

export const ErrorPage = ({ error }) => {
    const { code, message } = error;
    // const navigate = useNavigate();

    return (
        <div className={styles["body-wrapper"]}>
            <Helmet>
                <title>Ошибка {code.toString()}</title>
            </Helmet>

            <div className={styles["container"]}>
                <h1>{code}</h1>
                <h2>Произошла ошибка</h2>
                <p>{message}</p>
                {/*<h2>Страница не найдена</h2>*/}
                {/*<p>Похоже, эта страница вышла из игры или её никогда не существовало. Давайте вернемся в главное меню.</p>*/}
                <Link to="/">На главную</Link>
            </div>

        </div>
    );
};