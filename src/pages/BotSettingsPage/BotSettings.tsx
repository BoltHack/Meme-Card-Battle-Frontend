import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

import styles from './Card.BotSettings.module.css';

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";
import toast from "react-hot-toast";
import usePageRender from "../../tools/PageRender.ts";

interface PlayerData {
    name: string;
}

export const BotSettingsPage = ({ title }) => {
    const navigate = useNavigate();

    const { data, loading, error } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/api/bot-settings`
    );

    const playGame = async (game_type) => {
        try {
            const response = await axios.post(`${api.API_BASE_URL}/api/play-game/${game_type}`);

            const data = response.data;

            navigate(`/game/${data.game_type}/${data.game_key}`);

            return data;
        } catch (err) {
            console.log('err', err);

            if (err.response && err.response.data) {
                const serverError = err.response.data.error;
                toast.error(serverError);
            }
        }
    }

    return (
        <div className={styles["body-wrapper"]}>
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <div className={styles['buttons-container']}>

                <div>
                    <div onClick={() => {playGame("player_bot")}} className={styles["btn"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-icon lucide-play">
                            <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
                        </svg>
                        <span>Easy mode</span>
                    </div>
                </div>

                <div>
                    <Link to="/" className={styles["btn"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-question-mark-icon lucide-message-circle-question-mark">
                            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
                        </svg>
                        <span>home</span>
                    </Link>
                </div>

            </div>
        </div>
    );
};
