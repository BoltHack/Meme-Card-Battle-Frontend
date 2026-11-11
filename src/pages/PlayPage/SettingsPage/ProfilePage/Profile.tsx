import { ChangeEvent, useEffect, useRef, useState } from "react";

import settings_styles from "../SettingsPanel/Card.Settings.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import useContentRender from "../../../../tools/ContentRender.ts";
import { ErrorPage } from "../../../../components/ErrorPage/Error.tsx";
import { ContentLoading } from "../../../../components/LoadingPage/ContentLoading.tsx";

import toast from "react-hot-toast";

import { SoundFunctions } from "../../../../tools/global_scripts/SoundsPlayer.tsx";

export const ProfilePage = () => {
  const [formData, setFormData] = useState({
    aboutMe: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [idolFile, setIdolFile] = useState<File | string>("");
  const [isDeleteFile, setIsDeleteFile] = useState<boolean | false>(false);

  const dir_about_me_ref = useRef<HTMLTextAreaElement>(null);

  const { contentData, contentLoading, contentError } = useContentRender(
    `/play/settings/profile`,
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
        `/play/save-settings/profile`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Данные успешно добавлены:", response.data);

      if (response.data.success) {
        // setFormData({
        //   aboutMe: "",
        // });

        setFile(null);

        SoundFunctions.PlaySound_Play("success_notification");
        toast.success(response.data.success);
      }

      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!contentData || !contentData.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        contentData,
      );
      return;
    }

    setFormData({
      aboutMe: contentData.renderData.aboutMe,
    });

    setIdolFile(
      contentData?.renderData?.avatar !== "" &&
        `/${contentData.renderData.avatar}`,
    );
  }, [contentData]);

  if (contentLoading) return <ContentLoading />;
  if (contentError) return <ErrorPage error={contentError} />;

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
              Рекомендуется SVG, PNG или JPG не менее 100x80px
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
        {/* <button
          className={`${settings_styles["btn"]} ${settings_styles["btn-secondary"]}`}
        >
          Сбросить
        </button> */}
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
