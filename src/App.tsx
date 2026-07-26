import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { SignInPage } from "./pages/AuthPage/SignIn.tsx";

import { MainPage } from './pages/MainPage/Main';

import { HelpCenterPage } from "./pages/HelpCenterPage/HelpCenter.tsx";

import { MyCardsPage } from "./pages/MyCardsPage/MyCards.tsx";

import { BotSettingsPage } from "./pages/BotSettingsPage/BotSettings.tsx";

import { GameSettingsPage } from "./pages/GameSettingsPage/GameSettings.tsx";
import { GamePage } from "./pages/GamePage/Game.tsx";

import { HowToPlayPage } from "./pages/RulePages/HowToPlay.tsx";
import { TermsOfUsePage } from "./pages/RulePages/TermsOfUse.tsx";
import { PrivacyPolicy } from "./pages/RulePages/PrivacyPolicy.tsx";

import { BlogPage } from "./pages/BlogPage/Blog.tsx";
import { BlogReadPage } from "./pages/BlogReadPage/BlogRead.tsx";
import { BlogCategoryPage } from "./pages/BlogPage/BlogCategory.tsx";

import { AdminPanelPage } from "./pages/AdminPages/AdminPanel/AdminPanel.tsx";
import { CreateCardPage } from "./pages/AdminPages/CreateCard/CreateCardPage.tsx";
// import { CreateBlogPage } from "./pages/AdminPages/CreateBlog/CreateBlogPage.tsx";
import { EditBlogPage } from "./pages/AdminPages/EditBlog/EditBlogPage.tsx";

import { ErrorPage } from "./pages/ErrorPage/Error.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage title="MCB | Главная" />
    },
    {
        path: "/help-center",
        element: <HelpCenterPage title="MCB | Справочный центр" />
    },
    {
        path: "/my-cards",
        element: <MyCardsPage title="MCB | Мои карты" />
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
        path: "/privacy-policy",
        element: <PrivacyPolicy title="MCB | Политика конфиденциальности" />
    },
    {
        path: "/blog",
        element: <BlogPage title="MCB | Блог" />
    },
    {
        path: "/category/:blog_category",
        element: <BlogCategoryPage title="MCB | Блог" />
    },
    {
        path: "/blog/:blog_id",
        element: <BlogReadPage />
    },
    {
        path: "/game/:game_type/:game_key",
        element: <GamePage />
    },
    {
        path: "/auth/sign-in",
        element: <SignInPage title="MCB | Аккаунт" />
    },
    {
        path: "/admin/panel",
        element: <AdminPanelPage title="Админ панель" />
    },
    {
        path: "/admin/create/card",
        element: <CreateCardPage />
    },
    // {
    //     path: "/admin/create/blog",
    //     element: <CreateBlogPage />
    // },
    {
        path: "/admin/edit/blog/:blog_id",
        element: <EditBlogPage title="Админка | edit блога" />
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
                // limit={1}
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