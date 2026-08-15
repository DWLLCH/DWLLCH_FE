import { useContext } from 'react';
import { BookmarkContext } from '../components/BookmarkProvider';

function useBookmarks() {
  return useContext(BookmarkContext);
}

export default useBookmarks;
