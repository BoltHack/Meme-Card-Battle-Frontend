import { ChangeEvent, useEffect, useState } from "react";

import styles from "./Card.Friends.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

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

interface Props {
  playerID?: string;
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

import useContentRender from "../../../tools/ContentRender.ts";

import { SoundFunctions } from "../../../tools/global_scripts/SoundsPlayer.tsx";

export const FriendListMenu = ({ playerID }: Props) => {
  // const [data, setData] = useState([]);
  const [friendsCategory, setFriendsCategory] = useState<string | "">("list");
  const [friendList, setFriendsList] = useState<FriendsPost[]>([]);
  const [listsLength, setListsLength] = useState({
    friendListLength: 0,
    requestsForMeListLength: 0,
  });
  const [formData, setFormData] = useState({
    requestName: "",
  });

  const { contentData, contentLoading } = useContentRender(
    `/play/friends/${friendsCategory}`,
  );

  // useEffect(() => {
  //   let isMounted = true;

  //   axios
  //     .get(`/play/friends/${friendsCategory}`, {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       if (!isMounted) return;
  //       const responseData = response.data;
  //       if (responseData && responseData.renderData) {
  //         setListsLength({
  //           friendListLength: responseData.renderData.friendListLength || 0,
  //           requestsForMeListLength:
  //             responseData.renderData.requestsForMeListLength || 0,
  //         });
  //         setFriendsList(responseData.renderData.list || []);
  //       }
  //     })
  //     .catch((error) => {
  //       if (!isMounted) return;
  //       console.log("Ошибка загрузки друзей:", error);
  //     });

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [friendsCategory]);

  useEffect(() => {
    friendListTools.handleRequestAction = async (
      requesterID: string,
      action: string,
    ) => {
      try {
        const response = await axios.post(
          `/play/friend/request/${requesterID}/${action}`,
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
        const response = await axios.post(`/play/friend/remove/${friendID}`);

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
          `/play/friend/cancelRequest`,
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
    SoundFunctions.PlaySound_Play("btn_click_v2");
    setFriendsCategory(category);
  };

  const handleSendRequest = async (e: ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.requestName || !playerID) return;
    setFormData({
      requestName: "",
    });

    const dataToSend = new FormData();

    dataToSend.append("requestName", formData.requestName);
    dataToSend.append("requesterID", playerID);

    try {
      const response = await axios.post(
        `/play/friend/sendRequest`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      if (Number(response.status) === 200) {
        toast.success(response.data.success);
        setFriendsList((prevState) => [...prevState, response.data.renderData]);
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

  useEffect(() => {
    if (!contentData || !Array.isArray(contentData.renderData.list)) {
      return;
    }

    setListsLength({
      friendListLength: contentData.renderData.friendListLength,
      requestsForMeListLength: contentData.renderData.requestsForMeListLength,
    });

    setFriendsList(contentData.renderData.list);
  }, [contentData]);

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
