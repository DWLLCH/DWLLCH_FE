import { useContext } from 'react';
import { AvatarContext } from '../components/AvatarProvider';

function useAvatar() {
  return useContext(AvatarContext);
}

export default useAvatar;
