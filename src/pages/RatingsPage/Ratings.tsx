import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

import styles from "./Card.Ratings.module.css";

import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../components/LoadingPage/Loading.tsx";

import { Footer } from "../../components/Footer/Footer.tsx";
import { Header } from "../../components/Header/Header.tsx";

import { RatingBoard } from "./RatingBoard.tsx";

interface TitleSettings {
  title: string;
}

interface FooterLinksContext {
  footerLinks?: any;
}

export const RatingsPage = ({ title }: TitleSettings) => {
  const { footerLinks } = useOutletContext<FooterLinksContext>() ?? {
    footerLinks: [],
  };

  const [ratingCategory, setRatingCategory] = useState<string | "">("wins");

  const { loading, error, socket } = usePageRender(`/api/ratings`);

  useEffect(() => {
    const socketDisconnect = () => {
      if (socket.connected) socket.disconnect();
    };

    const timerId = setTimeout(socketDisconnect, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [socket]);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />

      <div className={styles["container"]}>
        <header className={styles["header"]}>
          <h1 className={styles["title"]}>Глобальный Топ-100</h1>
          <p className={styles["subtitle"]}>Рейтинги самых лучших игроков</p>
        </header>

        <div className={styles["tabs-container"]}>
          <button
            className={`${styles["tab-btn"]} ${styles[ratingCategory === "wins" ? "active" : ""]}`}
            onClick={() => setRatingCategory("wins")}
          >
            🏆 По победам
          </button>
          <button
            className={`${styles["tab-btn"]} ${styles[ratingCategory === "balance" ? "active" : ""]}`}
            onClick={() => setRatingCategory("balance")}
          >
            💰 По богатству
          </button>
          <button
            className={`${styles["tab-btn"]} ${styles[ratingCategory === "xp" ? "active" : ""]}`}
            onClick={() => setRatingCategory("xp")}
          >
            ⭐ По опыту
          </button>
        </div>

        <div className={styles["search-container"]}>
          <input
            type="text"
            className={styles["search-input"]}
            placeholder="Поиск игрока по нику..."
          />
        </div>

        <div className={styles["table-wrapper"]}>
          <table className={styles["rating-table"]}>
            <thead>
              <tr>
                <th className={styles["col-rank"]}>Ранг</th>
                <th className={styles["col-title"]}>Никнейм</th>
                {/* <th className={styles["col-clan"]}>Клан</th> */}
                <th className={styles["col-stat"]}>
                  {ratingCategory === "wins"
                    ? "Победы"
                    : ratingCategory === "balance"
                      ? "Богатства"
                      : ratingCategory === "xp"
                        ? "Опыт"
                        : ""}
                </th>
              </tr>
            </thead>
            <RatingBoard ratingCategory={ratingCategory} />
          </table>
        </div>
      </div>

      <Footer links={footerLinks} />
    </div>
  );
};
