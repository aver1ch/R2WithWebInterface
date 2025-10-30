import AppRouter from './components/AppRouter'
import { BrowserRouter } from 'react-router-dom'
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';

const App = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App