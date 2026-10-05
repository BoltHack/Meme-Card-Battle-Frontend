import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import styles from "./Card.ScreenClick.module.css";

import { PlayPage } from "../Play/Play.tsx";

export const ScreenClickPage = () => {
  const [isClicked, setIsClicked] = useState<boolean>(() => {
    return sessionStorage.getItem("screen_click") === "true";
  });

  useEffect(() => {
    if (isClicked) return;

    const handleAction = (e: Event) => {
      if (e.type === "contextmenu") e.preventDefault();

      sessionStorage.setItem("screen_click", "true");
      setIsClicked(true);
    };

    window.addEventListener("click", handleAction);
    window.addEventListener("contextmenu", handleAction);
    window.addEventListener("keydown", handleAction);

    return () => {
      window.removeEventListener("click", handleAction);
      window.removeEventListener("contextmenu", handleAction);
      window.removeEventListener("keydown", handleAction);
    };
  }, [isClicked]);

  if (isClicked) return <PlayPage />;

  return (
    <div className={styles["body-wrapper"]}>
      <Helmet>
        <title>Проверка</title>
      </Helmet>
      <div className={styles["parallax-body"]}></div>
      <div className={styles["parallax-wrapper"]}></div>
      <div className={styles["screen-container"]}>
        <h1>
          MEME CARD
          <br />
          <span>BATTLE</span>
        </h1>
        <br />
        <div className={styles["screen-content"]}>
          <span>Нажмите любую кнопку, чтобы начать</span>
        </div>
      </div>
    </div>
  );
};
