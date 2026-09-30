import { ChangeEvent, useEffect, useState } from "react";

import styles from "./Card.Friends.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import usePageRender from "../../../tools/PageRender.ts";
import toast from "react-hot-toast";

// import { ErrorPage } from "../../ErrorPage/Error.tsx";
// import { ContentLoading } from "../../LoadingPage/ContentLoading.tsx";

import { List } from "./List.tsx";
import { RequestsForMeList } from "./RequestsForMeList.tsx";

interface FriendsPost {
  id: string;
  name: string;
  lvl: number;
  gameInfo: string;
  isOnline: boolean;
}

export const friendListTools = {
  handleRequestAction: (action: string, requesterID: string) => {
    console.log(action, requesterID);
  },
  handleRemoveFriend: (friendID: string) => {
    console.log(friendID);
  },
  handleCancelRequest: (requestID: string) => {
    console.log(requestID);
  },
};

import { playFunctions } from "../Play/Play.tsx";
import { IsOnlineList } from "./IsOnlineList.tsx";
import { RequestsFromMeList } from "./RequestsFromMeList.tsx";

export const FriendListMenu = () => {
  const [friendsCategory, setFriendsCategory] = useState<string | "">("list");
  const [friendList, setFriendsList] = useState<FriendsPost[]>([]);
  const [listsLength, setListsLength] = useState({
    friendListLength: 0,
    requestsForMeListLength: 0,
  });
  const [formData, setFormData] = useState({
    requestName: "",
  });

  const [contentLoading, setContentLoading] = useState<boolean | true>(true);

  const { data } = usePageRender(
    `${api.API_BASE_URL}/play/friends/${friendsCategory}`,
  );

  useEffect(() => {
    friendListTools.handleRequestAction = async (
      requesterID: string,
      action: string,
    ) => {
      try {
        const response = await axios.post(
          `${api.API_BASE_URL}/play/friend/request/${requesterID}/${action}`,
        );

        if (Number(response.status) === 200) {
          setFriendsList((prevFriendsList) =>
            prevFriendsList.filter((fr) => fr.id !== requesterID),
          );

          setListsLength((prevListsLength) => ({
            ...prevListsLength,
            friendListLength:
              action === "accept"
                ? prevListsLength.friendListLength + 1
                : prevListsLength.friendListLength,
            requestsForMeListLength:
              prevListsLength.requestsForMeListLength - 1,
          }));
        }

        return response.data;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.error;
        console.log("error", error);
        if (errorMessage) {
          setFriendsList((prevFriendsList) =>
            prevFriendsList.filter((fr) => fr.id !== requesterID),
          );

          setListsLength((prevListsLength) => ({
            ...prevListsLength,
            requestsForMeListLength:
              prevListsLength.requestsForMeListLength - 1,
          }));
          toast.error(errorMessage);
        }
      }
    };

    return () => {
      friendListTools.handleRequestAction = () => {};
    };
  }, []);

  useEffect(() => {
    friendListTools.handleRemoveFriend = async (friendID: string) => {
      try {
        const response = await axios.post(
          `${api.API_BASE_URL}/play/friend/remove/${friendID}`,
        );

        if (Number(response.status) === 200) {
          setFriendsList((prevFriendsList) =>
            prevFriendsList.filter((fr) => fr.id !== friendID),
          );

          setListsLength((prevListsLength) => ({
            ...prevListsLength,
            friendListLength: prevListsLength.friendListLength - 1,
          }));
          toast.success(response.data.success);
        }

        return response.data;
      } catch (error) {
        console.log("error", error);
      }
    };

    return () => {
      friendListTools.handleRemoveFriend = () => {};
    };
  }, []);

  useEffect(() => {
    friendListTools.handleCancelRequest = async (requestID: string) => {
      if (!requestID) return;

      const dataToSend = new FormData();

      dataToSend.append("requestID", requestID);

      try {
        const response = await axios.post(
          `${api.API_BASE_URL}/play/friend/cancelRequest`,
          dataToSend,
          {
            withCredentials: true,
          },
        );

        if (Number(response.status) === 200) {
          setFriendsList((prevFriendsList) =>
            prevFriendsList.filter((fr) => fr.id !== requestID),
          );
        }

        return response.data;
      } catch (error: any) {
        console.log("error", error);
        const errorMessage = error?.response?.data?.error;
        if (errorMessage) {
          toast.error(errorMessage);
        }
      }
    };

    return () => {
      friendListTools.handleCancelRequest = () => {};
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeFriendsCategory = async (category: string) => {
    setContentLoading(true);
    // if (String(category) === String(friendsCategory)) return;
    setFriendsCategory(category);
    // try {
    //   const response = await axios.post(
    //     `${api.API_BASE_URL}/play/friends/${category}`,
    //     {
    //       withCredentials: true,
    //     },
    //   );

    //   if (Number(response.status) === 200) {
    //     setFriends(response.data.renderData);
    //     console.log("renderData", response.data.renderData);
    //     setTimeout(() => setContentLoading(false), 500);
    //   }

    //   return response.data;
    // } catch (error) {
    //   console.log("error", error);
    // }
  };

  const handleSendRequest = async (e: ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.requestName || !data?.id) return;
    setFormData({
      requestName: "",
    });

    setContentLoading(true);

    const dataToSend = new FormData();

    dataToSend.append("requestName", formData.requestName);
    dataToSend.append("requesterID", data?.id);

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/play/friend/sendRequest`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      if (Number(response.status) === 200) {
        toast.success(response.data.success);
        setFriendsList((prevState) => [...prevState, response.data.renderData]);
      }

      setContentLoading(false);
      return response.data;
    } catch (error: any) {
      console.log("error", error);
      setContentLoading(false);
      const errorMessage = error?.response?.data?.error;
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (!data || !Array.isArray(data.renderData.list)) {
      return;
    }

    setListsLength({
      friendListLength: data.renderData.friendListLength,
      requestsForMeListLength: data.renderData.requestsForMeListLength,
    });

    setFriendsList(data.renderData.list);

    setTimeout(() => setContentLoading(false), 500);

    console.log("friends render", data.renderData.list);
  }, [data]);

  // if (loading) return <ContentLoading />
  // if (error) return <ErrorPage error={error} />

  return (
    <>
      <div className={styles["menu-wrapper"]}>
        <div className={styles["friends-window"]}>
          <div className={styles["window-header"]}>
            <div className={styles["header-action"]}>Друзья</div>
            <div
              className={styles["header-action"]}
              style={{ marginLeft: "auto", cursor: "pointer" }}
              onClick={() => playFunctions.toggleFriendsMenu(false)}
            >
              Закрыть
            </div>
          </div>

          <div className={styles["tabs"]}>
            <div
              className={`${styles["tab"]} ${styles[friendsCategory === "list" ? "active" : ""]}`}
              onClick={() =>
                friendsCategory !== "list" &&
                handleChangeFriendsCategory("list")
              }
            >
              Друзья ({listsLength.friendListLength})
            </div>
            <div
              className={`${styles["tab"]} ${styles[friendsCategory === "RequestsForMeList" ? "active" : ""]}`}
              onClick={() =>
                friendsCategory !== "RequestsForMeList" &&
                handleChangeFriendsCategory("RequestsForMeList")
              }
            >
              Заявки ({listsLength.requestsForMeListLength})
            </div>
            <div
              className={`${styles["tab"]} ${styles[friendsCategory === "IsOnlineList" ? "active" : ""]}`}
              onClick={() =>
                friendsCategory !== "IsOnlineList" &&
                handleChangeFriendsCategory("IsOnlineList")
              }
            >
              В сети
            </div>
          </div>

          <div className={styles["friends-content"]}>
            {contentLoading && (
              <div className={styles["loader3"]}>
                <div className={styles["circle1"]}></div>
                <div className={styles["circle1"]}></div>
                <div className={styles["circle1"]}></div>
                <div className={styles["circle1"]}></div>
                <div className={styles["circle1"]}></div>
              </div>
            )}

            {friendsCategory === "list" && (
              <List friendList={friendList} contentLoading={contentLoading} />
            )}
            {friendsCategory === "RequestsForMeList" && (
              <RequestsForMeList
                friendList={friendList}
                contentLoading={contentLoading}
              />
            )}
            {friendsCategory === "IsOnlineList" && (
              <IsOnlineList
                friendList={friendList}
                contentLoading={contentLoading}
              />
            )}
            {friendsCategory === "RequestsFromMeList" && (
              <RequestsFromMeList
                friendList={friendList}
                contentLoading={contentLoading}
              />
            )}
          </div>

          {friendsCategory === "RequestsFromMeList" ? (
            <div className={styles["window-footer"]}>
              <input
                type="text"
                name="requestName"
                value={formData.requestName}
                onChange={handleChange}
                className={styles["search-input"]}
                placeholder="Отправить заявку в друзья"
                autoComplete="off"
                required
              />
              <button
                className={`${styles["btn"]} ${styles["btn-accept"]}`}
                onClick={handleSendRequest}
              >
                Добавить
              </button>
            </div>
          ) : (
            <div
              className={styles["tabs"]}
              style={{ borderTop: "2px solid #2b312b" }}
            >
              <div
                className={styles["tab"]}
                onClick={() =>
                  friendsCategory !== "RequestsFromMeList" &&
                  handleChangeFriendsCategory("RequestsFromMeList")
                }
              >
                Мои заявки
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
