import { useEffect, useState } from 'react';
import { getMyProfile } from '../api/mypage';
import { getAccessToken } from '../api/auth';

function useOnboardingComplete() {
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      setOnboardingComplete(true);
      return;
    }

    setLoading(true);
    getMyProfile()
      .then((profile) => setOnboardingComplete(Boolean(profile.birthDate)))
      .catch(() => setOnboardingComplete(true))
      .finally(() => setLoading(false));
  }, []);

  return { onboardingComplete, loading };
}

export default useOnboardingComplete;
