// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { MainPage } from './pages/MainPage/Main';
import { HowToPlayPage } from "./pages/HowToPlayPage/HowToPlay.tsx";
import { BotSettingsPage } from "./pages/BotSettingsPage/BotSettings.tsx";
import { GameSettingsPage } from "./pages/GameSettingsPage/GameSettings.tsx";
import { TermsOfUsePage } from "./pages/RulePages/TermsOfUse.tsx";
import { GamePage } from "./pages/GamePage/Game.tsx";

import { CreateCardsPage } from "./pages/AdminPages/CreateCards.tsx";

import { SignInPage } from "./pages/AuthPage/SignIn.tsx";
import {ErrorPage} from "./pages/ErrorPage/Error.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage title="MCB | Главная" />
    },
    {
        path: "/how-to-play",
        element: <HowToPlayPage title="MCB | Как играть" />
    },
    {
        path: "/bot-settings",
        element: <BotSettingsPage title="MCB | Настройки бота" />
    },
    {
        path: "/game-settings",
        element: <GameSettingsPage title="MCB | Настройки игры" />
    },
    {
        path: "/terms-of-use",
        element: <TermsOfUsePage title="MCB | Условия использования" />
    },
    {
        path: "/game/:game_type/:game_key",
        element: <GamePage title="MCB | Бот" />
    },
    {
        path: "/auth/sign-in",
        element: <SignInPage title="MCB | Аккаунт" />
    },
    {
        path: "/admin/create-cards",
        element: <CreateCardsPage title="Админка | Редактор" />
    },
    {
        path: "*",
        element: <ErrorPage error={{ code: 404, message: "not found" }} />
    }
]);

function App() {
    return (
        <>
            <Toaster
                position="top-right"
                containerStyle={{
                    top: 20,
                    right: 20,
                }}
                toastOptions={{
                    className: 'custom-toast',
                    success: {
                        className: 'custom-toast custom-toast-success',
                        iconTheme: {
                            primary: '#74c69d',
                            secondary: 'transparent',
                        },
                    },
                    error: {
                        className: 'custom-toast custom-toast-error',
                        iconTheme: {
                            primary: '#d90429',
                            secondary: 'transparent',
                        },
                    },
                }}
            />
            <main>
                <RouterProvider router={router} />
            </main>
        </>
    );
}
export default App;