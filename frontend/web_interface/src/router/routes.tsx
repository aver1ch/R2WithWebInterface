// src/router/routes.tsx
import { RouteObject } from "react-router";
import Welcome from '../pages/Welcome';
import Register from '../pages/Register';
import Login from '../pages/Login';

export const routes: RouteObject[] = [
  { path: "/", element: <Welcome /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <Welcome /> },
];

