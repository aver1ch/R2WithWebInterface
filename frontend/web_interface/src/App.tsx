import AppRouter from "./components/AppRouter";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="r2-ui-theme">
        <AppRouter />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
