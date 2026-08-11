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
import Onboarding6 from './pages/Onboarding6';
import Onboarding7 from './pages/Onboarding7';
import Onboarding8 from './pages/Onboarding8';
import Onboarding9 from './pages/Onboarding9';
import Onboarding10 from './pages/Onboarding10';
import Onboarding11 from './pages/Onboarding11';
import OnboardingComplete from './pages/OnboardingComplete';

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
            <Route path="/onboarding/6" element={<Onboarding6 />} />
            <Route path="/onboarding/7" element={<Onboarding7 />} />
            <Route path="/onboarding/8" element={<Onboarding8 />} />
            <Route path="/onboarding/9" element={<Onboarding9 />} />
            <Route path="/onboarding/10" element={<Onboarding10 />} />
            <Route path="/onboarding/11" element={<Onboarding11 />} />
            <Route path="/onboarding/complete" element={<OnboardingComplete />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
