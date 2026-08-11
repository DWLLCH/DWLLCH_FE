import { useContext } from 'react';
import { OnboardingContext } from '../components/OnboardingProvider';

function useOnboarding() {
  return useContext(OnboardingContext);
}

export default useOnboarding;
