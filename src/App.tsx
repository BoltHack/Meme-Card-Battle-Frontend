import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { SignInPage } from "./pages/AuthPage/SignIn.tsx";

import { AdminPanelPage } from "./pages/AdminPages/AdminPanel/AdminPanel.tsx";

import { ErrorPage } from "./components/ErrorPage/Error.tsx";
import { PlayPage } from "./pages/PlayPage/Play/Play.tsx";

import { MainPage } from "./pages/MainPage/Main.tsx";

import { HelpCenterPage } from "./pages/HelpCenterPage/HelpCenter.tsx";
import { HelpCenterInfoPage } from "./pages/HelpCenterPage/HelpCenterInfo.tsx";

import { DocumentsPage } from "./pages/DocumentsPage/Documents.tsx";

import { BlogPage } from "./pages/BlogPage/Blog.tsx";
import { BlogReadPage } from "./pages/BlogReadPage/BlogRead.tsx";
import { BlogCategoryPage } from "./pages/BlogPage/BlogCategory.tsx";

import { RatingsPage } from "./pages/RatingsPage/Ratings.tsx";

import { PublicPanel } from "./tools/GetBasicData.tsx";

const router = createBrowserRouter([
  {
    path: "/auth/sign-in",
    element: <SignInPage title="Войдите в свою учётную запись MCB" />,
  },
  {
    path: "/admin/panel",
    element: <AdminPanelPage title="Админ панель" />,
  },
  {
    path: "/play",
    element: <PlayPage />,
  },
  {
    path: "/",
    element: <PublicPanel />,
    children: [
      {
        path: "",
        element: <MainPage title="Главная | MCB" />,
      },
      {
        path: "/help-center",
        element: <HelpCenterPage title="Справочный центр | MCD" />,
      },
      {
        path: "/help-center/:help_request",
        element: <HelpCenterInfoPage />,
      },
      {
        path: "/documents/:document",
        element: <DocumentsPage />,
      },
      {
        path: "/blog",
        element: <BlogPage title="Блог | MCB" />,
      },
      {
        path: "/category/:blog_category",
        element: <BlogCategoryPage title="Блог | MCB" />,
      },
      {
        path: "/blog/:blog_id",
        element: <BlogReadPage />,
      },
      {
        path: "/ratings",
        element: <RatingsPage title="Рейтинги | MCB" />,
      },
    ],
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
