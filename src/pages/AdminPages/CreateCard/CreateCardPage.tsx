import { ChangeEvent, useState } from "react";
import { Helmet } from "react-helmet-async";

import styles from "./Card.CreateCards.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../api/api.ts";
import usePageRender from "../../../tools/PageRender.ts";
import { ErrorPage } from "../../ErrorPage/Error.tsx";
import { LoadingPage } from "../../LoadingPage/Loading.tsx";

interface PlayerData {
    name: string;
}

interface titleSettings {
    title: string;
}

export const CreateCardPage = ({ title }: titleSettings) => {
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

    const addNewCard = async (e: ChangeEvent<HTMLFormElement>) => {
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
            dataToSend.append("card_avatar", file);
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

    if (loading) return <LoadingPage />
    if (error) return <ErrorPage error={error} />

    return (
        <div className={styles['body-wrapper']}>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <form onSubmit={addNewCard}>
                <input
                    type="text" name="card_name" placeholder="Название карты"
                    onChange={handleChange} value={formData.card_name}
                    required />
                <input
                    type="text" name="card_description" placeholder="Описание"
                    onChange={handleChange} value={formData.card_description}
                    required />
                <input
                    type="file" name="card_avatar"
                    onChange={handleFileChange}
                     />
                <input
                    type="text" name="card_damage" placeholder="Урон"
                    onChange={handleChange} value={formData.card_damage}
                    required />
                <input
                    type="text" name="card_protection" placeholder="Броня"
                    onChange={handleChange} value={formData.card_protection}
                    required />
                <input
                    type="text" name="lvl_number" placeholder="Уровень"
                    onChange={handleChange} value={formData.lvl_number}
                    required />
                <select
                    name="lvl_name"
                    onChange={handleChange} value={formData.lvl_name}
                >
                    <option value="DEFAULT">Default</option>
                    <option value="LEGENDARY">Legendary</option>
                </select>

                <button type="submit">Создать карту</button>
            </form>
        </div>
    );
};
