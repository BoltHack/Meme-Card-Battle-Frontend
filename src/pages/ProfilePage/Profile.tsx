import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

import styles from "./Card.Profile.module.css";

import usePageRender from "../../tools/PageRender.ts";
import { ErrorPage } from "../../components/ErrorPage/Error.tsx";
import { LoadingPage } from "../../components/LoadingPage/Loading.tsx";

import { Footer } from "../../components/Footer/Footer.tsx";
import { Header } from "../../components/Header/Header.tsx";

export const RatingsPage = () => {
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
        <title>Профиль</title>
      </Helmet>
    </div>
  );
};
