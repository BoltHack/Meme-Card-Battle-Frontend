import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { SignInPage } from "./pages/AuthPage/SignIn.tsx";

import { MainPage } from "./pages/MainPage/Main.tsx";

import { HelpCenterPage } from "./pages/HelpCenterPage/HelpCenter.tsx";

// import { ProfilePage } from "./pages/PlayPage/ProfilePage/Profile.tsx";

import { BotSettingsPage } from "./pages/BotSettingsPage/BotSettings.tsx";

// import { GameSettingsPage } from "./pages/GameSettingsPage/GameSettings.tsx";
// import { GamePage } from "./pages/PlayPage/GamePage/Game.tsx";

import { HowToPlayPage } from "./pages/RulePages/HowToPlay.tsx";
import { TermsOfUsePage } from "./pages/RulePages/TermsOfUse.tsx";
import { PrivacyPolicy } from "./pages/RulePages/PrivacyPolicy.tsx";
import { CookiePolicy } from "./pages/RulePages/CookiePolicy.tsx";

import { BlogPage } from "./pages/BlogPage/Blog.tsx";
import { BlogReadPage } from "./pages/BlogReadPage/BlogRead.tsx";
import { BlogCategoryPage } from "./pages/BlogPage/BlogCategory.tsx";

import { AdminPanelPage } from "./pages/AdminPages/AdminPanel/AdminPanel.tsx";

import { ErrorPage } from "./pages/ErrorPage/Error.tsx";
import { PlayPage } from "./pages/PlayPage/Play/Play.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage title="MCB | Главная" />,
  },
  {
    path: "/play",
    element: <PlayPage title="Meme Card Battle" />,
  },
  {
    path: "/auth/sign-in",
    element: <SignInPage title="MCB | Войдите в свою учётную запись" />,
  },
  {
    path: "/help-center",
    element: <HelpCenterPage title="MCB | Справочный центр" />,
  },
  {
    path: "/how-to-play",
    element: <HowToPlayPage title="MCB | Как играть" />,
  },
  {
    path: "/bot-settings",
    element: <BotSettingsPage title="MCB | Настройки бота" />,
  },
  {
    path: "/terms-of-use",
    element: <TermsOfUsePage title="MCB | Условия использования" />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy title="MCB | Политика конфиденциальности" />,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicy title="MCB | Политика Cookie файлов" />,
  },
  {
    path: "/blog",
    element: <BlogPage title="MCB | Блог" />,
  },
  {
    path: "/category/:blog_category",
    element: <BlogCategoryPage title="MCB | Блог" />,
  },
  {
    path: "/blog/:blog_id",
    element: <BlogReadPage />,
  },
  {
    path: "/admin/panel",
    element: <AdminPanelPage title="Админ панель" />,
  },
  {
    path: "*",
    element: <ErrorPage error={{ code: 404, message: "not found" }} />,
  },
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
          className: "custom-toast",
          success: {
            className: "custom-toast custom-toast-success",
            iconTheme: {
              primary: "#74c69d",
              secondary: "transparent",
            },
          },
          error: {
            className: "custom-toast custom-toast-error",
            iconTheme: {
              primary: "#d90429",
              secondary: "transparent",
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
