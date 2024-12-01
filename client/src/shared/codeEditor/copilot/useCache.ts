import { useCallback, useState } from 'react';
import { CACHE_SIZE } from './constants';

export const useCache = () => {
  const [cache, setCache] = useState<[param: string, value: string][]>([]);

  const get = useCallback((param: string) => {
    const exactMatch = cache.findIndex(([key]) => key === param);
    if (exactMatch !== -1) {
      return cache[exactMatch][1];
    }
    const partialMatch = cache.findIndex(([key, value]) => {
      return (key + value).startsWith(param) && !key.startsWith(param);
    });
    if (partialMatch !== -1) {
      return cache[partialMatch].join('').replace(param, '');
    }
    return null;
  }, [cache]);

  const set = useCallback((param: string, value: string) => {
    setCache(cache => {
      if (cache.length >= CACHE_SIZE) {
        return [
          ...cache.slice(1),
          [param, value],
        ];
      }
      return [
        ...cache,
        [param, value],
      ];
    });
  }, [cache, setCache]);

  return { get, set } as const;
};
