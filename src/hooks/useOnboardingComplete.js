import { useEffect, useState } from 'react';
import { getMyProfile } from '../api/mypage';
import { getAccessToken } from '../api/auth';

function useOnboardingComplete() {
  const [status, setStatus] = useState(() => (getAccessToken() ? 'checking' : 'complete'));

  useEffect(() => {
    if (status !== 'checking') return;

    getMyProfile()
      .then((profile) => setStatus(profile.birthDate ? 'complete' : 'incomplete'))
      .catch(() => setStatus('error'));
  }, [status]);

  return {
    status,
    loading: status === 'checking',
    onboardingComplete: status === 'complete',
  };
}

export default useOnboardingComplete;
