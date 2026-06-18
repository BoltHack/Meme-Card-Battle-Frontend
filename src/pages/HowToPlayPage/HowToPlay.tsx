import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../api/api.ts";
import usePageRender from "../../tools/PageRender.ts";

interface PlayerData {
    name: string;
}

export const HowToPlayPage = ({ title }) => {
    const navigate = useNavigate();

    const { data, loading, error } = usePageRender<PlayerData>(
        `${api.API_BASE_URL}/api/how-to-play`
    );

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Link to="/">Home</Link>
        </>
    );
};
