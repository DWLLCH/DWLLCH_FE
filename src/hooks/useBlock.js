import { useContext } from 'react';
import { BlockContext } from '../components/BlockProvider';

function useBlock() {
  return useContext(BlockContext);
}

export default useBlock;
