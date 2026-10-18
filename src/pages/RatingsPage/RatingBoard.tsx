import { useEffect, useState } from "react";

import styles from "./Card.Ratings.module.css";

import useContentRender from "../../tools/ContentRender.ts";
import { ContentLoading } from "../../components/LoadingPage/ContentLoading.tsx";

interface RatingPost {
  lvl: number;
  name: string;
  value: string;
  // units: string;
}

interface Props {
  ratingCategory: string;
}

export const RatingBoard = ({ ratingCategory }: Props) => {
  const [ratingData, setRatingData] = useState<RatingPost[]>([]);

  // let categoryIcon = "";

  const { contentData, contentLoading, contentError } = useContentRender(
    `/api/ratings/${ratingCategory}`,
  );

  const formattedBalance = (count: number): string => {
    const formattedCount = new Intl.NumberFormat("de-DE", {
      notation: "standard",
      maximumFractionDigits: 1,
    }).format(count);
    return formattedCount.toLowerCase();
  };

  useEffect(() => {
    if (!contentData || !Array.isArray(contentData.renderData)) return;

    setRatingData(contentData.renderData);

    // categoryIcon = ratingCategory === "wins" ? "🏆" : ratingCategory === "balance" ? "💰" : ratingCategory === "xp" ? "⭐" : "";
  }, [contentData]);

  if (contentError) return <p>{contentError.message}</p>;

  return (
    <tbody>
      {contentLoading && (
        <td>
          <div className={styles["content-result"]}>
            <span>
              <ContentLoading />
            </span>
          </div>
        </td>
      )}
      {!contentLoading && ratingData && ratingData.length > 0
        ? ratingData.map((rating: any, index: number) => {
            const rank = index + 1;
            let rowClass = "";

            if (rank === 1) rowClass = "gold";
            else if (rank === 2) rowClass = "silver";
            else if (rank === 3) rowClass = "bronze";

            return (
              <tr
                key={index}
                className={`${styles["top-three"]} ${styles[rowClass]}`}
              >
                <td className={styles["col-rank"]}>
                  <span className={styles["rank-badge"]}>{rank}</span>
                </td>
                <td className={styles["col-title"]}>
                  <div className={styles["game-info"]}>
                    <span className={styles["game-name"]}>{rating.name}</span>
                    <span className={styles["game-meta"]}>
                      Уровень {rating.lvl}
                    </span>
                  </div>
                </td>
                {/* <td className={styles["col-clan"]}>${rating.clan}</td> */}
                <td className={styles["col-stat"]}>
                  <span
                    className={`${styles["stat-value"]} ${styles[ratingCategory]}`}
                  >
                    {formattedBalance(Number(rating.value))}
                  </span>
                </td>
              </tr>
            );
          })
        : !contentLoading && (
            <tr>
              <td colSpan={3}>
                <div className={styles["content-result"]}>
                  <span>Данный топ пуст</span>
                </div>
              </td>
            </tr>
          )}
    </tbody>
  );
};
