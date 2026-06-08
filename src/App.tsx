import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { MainPage } from './pages/MainPage/Main';
import { HowToPlayPage } from "./pages/HowToPlayPage/HowToPlay.tsx";
import { BotSettingsPage } from "./pages/BotSettingsPage/BotSettings.tsx";
import { GamePage } from "./pages/GamePage/Game.tsx";

import { CreateCardsPage } from "./pages/AdminPages/CreateCards.tsx";

import { SignInPage } from "./pages/AuthPage/SignIn.tsx";
function App() {
    return (
        <Router>
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
                <Routes>
                    <Route path="/" element={<MainPage title="MCB | Главная" />} />
                    <Route path="/how-to-play" element={<HowToPlayPage title="MCB | Как играть" />} />
                    <Route path="/bot-settings" element={<BotSettingsPage title="MCB | Настройки бота" />} />
                    <Route path="/game/:game_type/:game_key" element={<GamePage title="MCB | Бот" />} />

                    <Route path="/auth/sign-in" element={<SignInPage title="MCB | Аккаунт" /> } />

                    <Route path="/admin/create-cards" element={<CreateCardsPage title="Админка | Редактор" />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;