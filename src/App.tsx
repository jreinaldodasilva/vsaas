import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { AppRoutes } from './routes';
import './styles/global.css';

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <AuthProvider>
            <TenantProvider>
              <AppRoutes />
            </TenantProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  );
}
