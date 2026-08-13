import { useContext } from 'react';
import { MyInfoContext } from '../components/MyInfoProvider';

function useMyInfo() {
  return useContext(MyInfoContext);
}

export default useMyInfo;
