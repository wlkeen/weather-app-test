import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import '@/i18n';
import App from './App';
import '@/styles/main.scss';

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK_API !== 'true') {
    return;
  }

  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

async function bootstrap() {
  await enableMocking();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
}

void bootstrap();
