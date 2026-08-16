import { useContext } from 'react';
import { NotificationContext } from '../components/NotificationProvider';

function useNotifications() {
  return useContext(NotificationContext);
}

export default useNotifications;
