import { useCallback, useEffect, useRef, useState } from 'react';

/*
  id가 바뀔 때 fetchFn(id)를 한 번만 호출하는 공용 훅
  StrictMode 개발 모드에서 effect가 두 번 실행돼서 가드 없이 부르면
  GET을 두 번 보내는 문제가 있었는데 이를 막기 위함
*/
function useFetchOnce(id, fetchFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchedIdRef = useRef(null);
  const requestIdRef = useRef(0);

  const refetch = useCallback(() => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(false);
    setNotFound(false);
    fetchFn(id)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        setData(result);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        if (err.response?.status === 404) setNotFound(true);
        else setError(true);
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        setLoading(false);
      });
  }, [id, fetchFn]);

  useEffect(() => {
    if (fetchedIdRef.current === id) return;
    fetchedIdRef.current = id;
    refetch();
  }, [id, refetch]);

  // id가 막 바뀐 렌더에서는 아직 이전 id의 data/loading 상태가 남아있어서
  // (effect는 렌더 이후에 실행되므로) 반환 직전에 한 번 더 동기화해서 이전 데이터가 잠깐 보이는 걸 막음
  if (fetchedIdRef.current !== id) {
    return { data: null, loading: true, error: false, notFound: false, refetch };
  }

  return { data, loading, error, notFound, refetch };
}

export default useFetchOnce;
