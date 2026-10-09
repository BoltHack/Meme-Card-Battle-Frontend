import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

import styles from "./Card.Pagination.module.css";

interface TitleSettings {
  currentPage: number | 1;
  setCurrentPage: Dispatch<SetStateAction<number>>;

  totalPages: number | 1;
}

export const Pagination = ({
  currentPage,
  setCurrentPage,

  totalPages,
}: TitleSettings) => {
  let maxPagesToShow = 4;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pagesCount: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pagesCount.push(i);
  }

  const handleChangeCurrentPage = (page: number) => {
    setCurrentPage(page);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 500);
  };

  return (
    <>
      <nav className={styles["pagination"]} aria-label="Постраничная навигация">
        {currentPage > 1 ? (
          <Link
            onClick={() => handleChangeCurrentPage(currentPage - 1)}
            to={`?page=${currentPage - 1}`}
            className={`${styles["pagination__item"]} ${styles["pagination__item--arrow"]}`}
            aria-label="Предыдущая страница"
          >
            &larr; Назад
          </Link>
        ) : (
          <Link
            to="#"
            className={`${styles["pagination__item"]} ${styles["pagination__item--arrow"]} ${styles["pagination__item--disable"]}`}
            aria-label="Предыдущая страница недоступна"
          >
            &larr; Назад
          </Link>
        )}

        {startPage > 1 && (
          <Link
            onClick={() => handleChangeCurrentPage(1)}
            to="?page=1"
            className={styles["pagination__item"]}
          >
            1
          </Link>
        )}

        {startPage > 2 && (
          <span className={styles["pagination__dots"]}>...</span>
        )}

        {pagesCount.map((page) => {
          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              to={`?page=${page}`}
              onClick={() => handleChangeCurrentPage(page)}
              className={`${styles["pagination__item"]} ${isActive ? styles["is-active"] : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </Link>
          );
        })}

        {endPage < totalPages - 1 && (
          <span className={styles["pagination__dots"]}>...</span>
        )}

        {endPage < totalPages && (
          <Link
            to={`?page=${totalPages}`}
            className={styles["pagination__item"]}
            onClick={() => handleChangeCurrentPage(totalPages)}
          >
            {totalPages}
          </Link>
        )}

        {currentPage < totalPages ? (
          <Link
            onClick={() => handleChangeCurrentPage(currentPage + 1)}
            to={`?page=${currentPage + 1}`}
            className={`${styles["pagination__item"]} ${styles["pagination__item--arrow"]}`}
            aria-label="Следующая страница"
          >
            Вперед &rarr;
          </Link>
        ) : (
          <Link
            to={`?page=${currentPage}`}
            className={`${styles["pagination__item"]} ${styles["pagination__item--arrow"]} ${styles["pagination__item--disable"]}`}
            aria-label="Следующая страница недоступна"
          >
            Вперед &rarr;
          </Link>
        )}
      </nav>
    </>
  );
};
