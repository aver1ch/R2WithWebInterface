import { useRoutes } from "react-router";
import { routes } from "../router/routes";

const AppRouter = () => {
    return useRoutes(routes);
};

export default AppRouter;
