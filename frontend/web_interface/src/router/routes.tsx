// src/router/routes.tsx
import { RouteObject } from "react-router";
import Login from '../pages/Login';
import Register from '../pages/Register';

export const routes: RouteObject[] = [
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <Login /> },
];

