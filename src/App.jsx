import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MobileFrame from './components/MobileFrame';
import OnboardingProvider from './components/OnboardingProvider';
import Splash from './pages/Splash';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import SignUpComplete from './pages/SignUpComplete';
import Onboarding1 from './pages/Onboarding1';
import Onboarding2 from './pages/Onboarding2';
import Onboarding3 from './pages/Onboarding3';
import Onboarding4 from './pages/Onboarding4';
import Onboarding5 from './pages/Onboarding5';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<MobileFrame />}>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/complete" element={<SignUpComplete />} />
          <Route element={<OnboardingProvider />}>
            <Route path="/onboarding/1" element={<Onboarding1 />} />
            <Route path="/onboarding/2" element={<Onboarding2 />} />
            <Route path="/onboarding/3" element={<Onboarding3 />} />
            <Route path="/onboarding/4" element={<Onboarding4 />} />
            <Route path="/onboarding/5" element={<Onboarding5 />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
