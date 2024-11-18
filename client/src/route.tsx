import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page.tsx";
import App from "./App.tsx";
import Notes from "./pages/Notes.tsx";
import SignUp from "./components/Auth/SignUp.tsx";
import SignIn from "./components/Auth/SignIn.tsx";
import ForgotPass from "./components/Auth/ForgotPass.tsx";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "About/",
        element: <About/>
      },
      {
        path: "Notes/",
        element: <Notes />,
      },
      {
        path: "Notes/:user/:category?",
        element: <Notes />,
      },
    ],
  },
  {
    path: "SignIn",
    element: <SignIn />,
    errorElement: <ErrorPage />,
  },
  {
    path: "SignUp",
    element: <SignUp />,
    errorElement: <ErrorPage />,
  },
  {
    path: "Forgot-password",
    element: <ForgotPass />,
    errorElement: <ErrorPage />,
  },
]);
