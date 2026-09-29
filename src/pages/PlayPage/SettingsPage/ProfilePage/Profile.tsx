import { ChangeEvent, useEffect, useRef, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import usePageRender from "../../../../tools/PageRender.ts";
import { ContentLoading } from "../../../LoadingPage/ContentLoading.tsx";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import toast from "react-hot-toast";

// import { settingsNavigator } from "../SettingsPanel/SettingsPanel.tsx";

export const ProfilePage = () => {
  // const [userInfo, setUserInfo] = useState({
  //   avatar: "",
  //   aboutMe: "",
  // });

  const [formData, setFormData] = useState({
    aboutMe: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [idolFile, setIdolFile] = useState<File | string>("");
  const [isDeleteFile, setIsDeleteFile] = useState<boolean | false>(false);

  const dir_about_me_ref = useRef<HTMLTextAreaElement>(null);

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/play/settings/profile`,
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);
      setIsDeleteFile(false);

      const reader = new FileReader();

      reader.onloadend = () => {
        setIdolFile(`${reader.result}`);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFileDelete = () => {
    setFile(null);
    setIdolFile("");
    setIsDeleteFile(true);
  };

  const handleSubmit = async (e: ChangeEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const dataToSend = new FormData();

    dataToSend.append("aboutMe", formData.aboutMe);

    if (file && !isDeleteFile) {
      dataToSend.append("avatar", file);
    }
    if (file === null && isDeleteFile) {
      dataToSend.append("isDelete", String(isDeleteFile));
    }
    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/play/save-settings/profile`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Данные успешно добавлены:", response.data);

      if (response.data.success) {
        setFormData({
          aboutMe: "",
        });

        setFile(null);

        toast.success(response.data.success);
      }

      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!data || !data.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setFormData({
      aboutMe: data.renderData.aboutMe,
    });

    setIdolFile(
      data?.renderData?.avatar !== "" &&
        `${api.API_BASE_URL}/${data.renderData.avatar}`,
    );

    console.log("data", data);
  }, [data]);

  if (loading) return <ContentLoading />;
  if (error) return <ErrorPage error={error} />;

  return (
    <>
      <header className={settings_styles["content-header"]}>
        <h1>Настройки профиля</h1>
        <p>
          Управляйте данными вашей учетной записи, безопасностью и внешним видом
        </p>
      </header>

      <section className={settings_styles["settings-section"]}>
        <h2>Личная информация</h2>

        <div className={settings_styles["avatar-upload-block"]}>
          {idolFile ? (
            <img src={idolFile} className={settings_styles["avatar-preview"]} />
          ) : (
            <div className={settings_styles["avatar-preview"]}></div>
          )}

          <div className={settings_styles["upload-controls"]}>
            <span className={settings_styles["setting-title"]}>
              Фото профиля
            </span>
            <span className={settings_styles["setting-desc"]}>
              Рекомендуется SVG, PNG или JPG не менее 400x400px
            </span>
            <div className={settings_styles["upload-buttons"]}>
              <label
                className={`${settings_styles["btn"]} ${settings_styles["btn-secondary"]} ${settings_styles["btn-sm"]}`}
              >
                Выбрать файл
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label>
              <button
                className={`${settings_styles["btn"]} ${settings_styles["btn-text-danger"]} ${settings_styles["btn-sm"]}`}
                onClick={handleFileDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </div>

        <div className={settings_styles["grid-form"]}>
          {/* <span>Дата регистрации</span> */}
          {/* <div className={settings_styles["input-group"]}>
            <label>Имя пользователя</label>
            <input type="text" placeholder="@username" />
          </div>
          <div className={settings_styles["input-group"]}>
            <label>Email</label>
            <input type="email" placeholder="email@domain.com" />
          </div>
          <div className={settings_styles["input-group"]}>
            <label>Номер телефона</label>
            <input type="tel" placeholder="+7..." />
          </div> */}
          <div
            className={`${settings_styles["input-group"]} ${settings_styles["full-width"]}`}
          >
            <label htmlFor="aboutMe">О себе</label>
            <textarea
              ref={dir_about_me_ref}
              onInput={handleChange}
              name="aboutMe"
              value={formData.aboutMe}
              maxLength={200}
              rows={3}
              placeholder="Краткая биография появится рядом с вашим аватаром."
            ></textarea>
            <span>{dir_about_me_ref.current?.value.length}/200</span>
          </div>
        </div>
      </section>

      <footer className={settings_styles["content-footer"]}>
        <button
          className={`${settings_styles["btn"]} ${settings_styles["btn-secondary"]}`}
        >
          Сбросить
        </button>
        <button
          className={`${settings_styles["btn"]} ${settings_styles["btn-primary"]}`}
          onClick={handleSubmit}
        >
          Сохранить изменения
        </button>
      </footer>
    </>
  );
};
