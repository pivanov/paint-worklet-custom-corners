import './styles.css';

import { App } from './app';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(<App />);


if ('paintWorklet' in CSS) {
  if (import.meta.env.DEV) {
    // In development mode, load the TypeScript file directly
    CSS.paintWorklet?.addModule('./src/worklet.ts');
  } else {
    // In production mode, load the compiled JavaScript file
    CSS.paintWorklet?.addModule('./worklet.js');
  }
}
