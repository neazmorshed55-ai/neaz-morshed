import React from 'react';
import ReactDOM from 'react-dom/client';
import RootLayout from './app/layout';
import PortfolioPage from './app/page';

/**
 * Entry point for the environment.
 * Note: In your actual GitHub repo, Next.js handles this automatically via app/layout.tsx and app/page.tsx.
 * We maintain this here to ensure the local preview reflects your new structure accurately.
 */
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootLayout>
      <PortfolioPage />
    </RootLayout>
  </React.StrictMode>
);