import { useNavigate } from 'react-router-dom';

export const ErrorPage = ({ error }) => {
    const navigate = useNavigate();

    return (
        <>
            <p>{error}</p>
            <b onClick={() => navigate("/")}>Home</b>
        </>
    );
};