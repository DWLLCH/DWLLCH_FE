import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileFrame from './components/MobileFrame';
import Splash from './pages/Splash';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<MobileFrame />}>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
