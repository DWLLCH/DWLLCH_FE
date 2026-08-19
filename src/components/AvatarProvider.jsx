import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export const AvatarContext = createContext(null);

function AvatarProvider({ children }) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(
    () => () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    },
    [avatarUrl],
  );

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children || <Outlet />}
    </AvatarContext.Provider>
  );
}

export default AvatarProvider;
