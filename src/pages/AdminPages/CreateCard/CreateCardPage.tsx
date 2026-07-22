import { ChangeEvent, useState } from "react";

import styles from "./Card.CreateCards.module.css";
import admin_styles from "../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import usePageRender from "../../../tools/PageRender.ts";
import { ErrorPage } from "../../ErrorPage/Error.tsx";
import { DefaultLoading } from "../../LoadingPage/DefaultLoading.tsx";

interface PlayerData {
    name: string;
}

export const CreateCardPage = () => {
    // const navigate = useNavigate();

    const { loading, error } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/admin/create/card`
    );

    const [formData, setFormData] = useState({
        card_name: '',
        card_description: '',
        card_damage: '',
        card_protection: '',
        lvl_number: '',
        lvl_name: 'DEFAULT',
    });
    const [file, setFile] = useState<File | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const dataToSend = new FormData();

        dataToSend.append("card_name", formData.card_name);
        dataToSend.append("card_description", formData.card_description);
        dataToSend.append("card_damage", formData.card_damage);
        dataToSend.append("card_protection", formData.card_protection);
        dataToSend.append("lvl_number", formData.lvl_number);
        dataToSend.append("lvl_name", formData.lvl_name);
        if (file) {
            console.log('file', file);
            dataToSend.append("card_cover", file);
        }
        try {
            const response = await axios.post(`${api.API_BASE_URL}/admin/add/card`, dataToSend, {
                withCredentials: true
            });

            console.log('Карта успешно создана:', response.data);

            setFormData({
                card_name: '',
                card_description: '',
                card_damage: '',
                card_protection: '',
                lvl_number: '',
                lvl_name: 'DEFAULT'
            });
            setFile(null);

            return response.data;
        } catch (error) {
            console.log('error', error);
        }
    }

    if (loading) return <DefaultLoading />
    if (error) return <ErrorPage error={error} />

    return (
        <div id="create-card-page" className={`${admin_styles["page"]} ${admin_styles["active"]}`}>
            <header className={admin_styles["header"]}>
                <h1>Создание игральных карт</h1>
                <p>Создайте себе карту, выбрав нужные характеристики.</p>
            </header>

            <div className={styles["editor-container"]}>
                <h1 className={styles["editor-title"]}>Создание новой карты</h1>

                <form className={styles["editor-form"]} onSubmit={handleSubmit}>
                    <div className={styles["editor-left-side"]}>
                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="card_name">Название карты</label>
                            <input
                                type="text" name="card_name" id="card_name"
                                onChange={handleChange} value={formData.card_name}
                                className={styles["form-input"]}
                                placeholder="Заполните форму..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="card_description">Описание</label>
                            <input
                                type="text" name="card_description" id="card_description"
                                onChange={handleChange} value={formData.card_description}
                                className={styles["form-input"]}
                                placeholder="Заполните форму..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="card_damage">Урон</label>
                            <input
                                type="text" name="card_damage" id="card_damage"
                                onChange={handleChange} value={formData.card_damage}
                                className={styles["form-input"]}
                                placeholder="Заполните форму..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="card_protection">Броня</label>
                            <input
                                type="text" name="card_protection" id="card_protection"
                                onChange={handleChange} value={formData.card_protection}
                                className={styles["form-input"]}
                                placeholder="Заполните форму..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="lvl_number">Уровень</label>
                            <input
                                type="text" name="lvl_number" id="lvl_number"
                                onChange={handleChange} value={formData.lvl_number}
                                className={styles["form-input"]}
                                placeholder="Заполните форму..."
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]} htmlFor="lvl_number">Редкость</label>
                            <select
                                name="lvl_name"
                                onChange={handleChange} value={formData.lvl_name}
                                className={styles["form-input"]}
                            >
                                <option value="DEFAULT">Default</option>
                                <option value="LEGENDARY">Legendary</option>
                            </select>
                        </div>

                        <div className={styles["form-group"]}>
                            <label className={styles["form-label"]}>Обложка</label>
                            <label className={styles["file-dropzone"]}>
                                <input
                                    onChange={handleFileChange}
                                    type="file" name="card_cover" accept="image/*"
                                />
                                <div className={styles["file-dropzone-text"]}>
                                    {file !== null ? (
                                        <span>Файл выбран <strong>{file.name}</strong></span>
                                    ): <span>Перетащите изображение сюда или <strong>выберите файл</strong></span>}
                                </div>
                            </label>
                            {file !== null && (
                                <a className={styles["delete-file-btn"]} onClick={() => setFile(null)}>Нажмите, чтобы удалить файл</a>
                            )}
                        </div>

                        <button type="submit" className={styles["submit-btn"]}>Создать карту</button>
                    </div>
                </form>
            </div>
        </div>
        // <div className={styles['body-wrapper']}>
        //     <form onSubmit={addNewCard}>
        //         <input
        //             type="text" name="card_name" placeholder="Название карты"
        //             onChange={handleChange} value={formData.card_name}
        //             required />
        //         <input
        //             type="text" name="card_description" placeholder="Описание"
        //             onChange={handleChange} value={formData.card_description}
        //             required />
        //         <input
        //             type="file" name="card_avatar"
        //             onChange={handleFileChange}
        //              />
        //         <input
        //             type="text" name="card_damage" placeholder="Урон"
        //             onChange={handleChange} value={formData.card_damage}
        //             required />
        //         <input
        //             type="text" name="card_protection" placeholder="Броня"
        //             onChange={handleChange} value={formData.card_protection}
        //             required />
        //         <input
        //             type="text" name="lvl_number" placeholder="Уровень"
        //             onChange={handleChange} value={formData.lvl_number}
        //             required />
        //         <select
        //             name="lvl_name"
        //             onChange={handleChange} value={formData.lvl_name}
        //         >
        //             <option value="DEFAULT">Default</option>
        //             <option value="LEGENDARY">Legendary</option>
        //         </select>
        //
        //         <button type="submit">Создать карту</button>
        //     </form>
        // </div>
    );
};
