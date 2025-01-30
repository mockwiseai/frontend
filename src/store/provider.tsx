'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { ToastProvider } from '@radix-ui/react-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <ToastProvider duration={5000}>
      {children}
    </ToastProvider>
  </Provider>;
}