declare module '@docusaurus/BrowserOnly' {
  import type { ReactNode } from 'react';

  export interface BrowserOnlyProps {
    /**
     * Children can be a React node or a render function that only runs on the client.
     */
    children?: ReactNode | (() => ReactNode);
    /**
     * Optional fallback content to render during SSR.
     */
    fallback?: ReactNode;
  }

  const BrowserOnly: (props: BrowserOnlyProps) => JSX.Element;
  export default BrowserOnly;
}

