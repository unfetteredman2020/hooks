import React from 'react';

interface BrowserOnlyProps {
  children: () => React.ReactNode;
}

const BrowserOnly: React.FC<BrowserOnlyProps> = ({ children }) => {
  const [isBrowser, setIsBrowser] = React.useState(false);

  React.useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    return null;
  }

  return <>{children()}</>;
};

export default BrowserOnly;