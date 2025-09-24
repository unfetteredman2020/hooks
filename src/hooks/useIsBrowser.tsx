import { useState, useEffect } from 'react';

const useIsBrowser = (): boolean => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return isBrowser;
};

export default useIsBrowser;