// src/router/routes.tsx
import { RouteObject } from "react-router";
import Welcome from '../pages/Welcome';
import Register from '../pages/Register';
import Login from '../pages/Login';
import MainPage from '../pages/MainPage';
import ResultPage from "../pages/ResultPage";

export const routes: RouteObject[] = [
  { path: "/", element: <Welcome /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/mainpage", element: <MainPage /> },
  { path: "/result", element: <ResultPage /> },
  { path: "*", element: <Welcome /> },
];

