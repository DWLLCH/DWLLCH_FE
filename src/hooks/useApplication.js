import { useContext } from 'react';
import { ApplicationContext } from '../components/ApplicationProvider';

function useApplication() {
  return useContext(ApplicationContext);
}

export default useApplication;
