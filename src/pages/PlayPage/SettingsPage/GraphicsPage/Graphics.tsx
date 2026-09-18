// import { useEffect, useState } from "react";

// import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

// import api from "../../../api/api.ts";
// import usePageRender from "../../../tools/PageRender.ts";
// import { LoadingPage } from "../../LoadingPage/Loading.tsx";
// import { ErrorPage } from "../../ErrorPage/Error.tsx";

// import { settingsNavigator } from "../SettingsPanel/SettingsPanel.tsx";

export const GraphicsPage = () => {
  //   const [userInfo, setUserInfo] = useState({
  //     name: "",
  //     avatar: "",
  //     role: "",
  //   });

  //   const { data, loading, error } = usePageRender(
  //     `${api.API_BASE_URL}/api/settings/profile`,
  //   );

  //   useEffect(() => {
  //     if (!data || !data.renderData) {
  //       console.log(
  //         "Данные еще не загрузились или структура не совпадает:",
  //         data,
  //       );
  //       return;
  //     }

  //     setUserInfo({
  //       name: data.renderData.name,
  //       avatar: data.renderData.avatar,
  //       role: data.renderData.role,
  //     });

  //     console.log("data", data);
  //   }, [data]);

  //   if (loading || !data) return <LoadingPage />;
  //   if (error) return <ErrorPage error={error} />;

  return <></>;
};