import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { InventoryProvider } from './context/InventoryContext';
import { AuthProvider } from './context/AuthContext';
import { AppThemeProvider } from './theme/ThemeProvider';

export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <InventoryProvider>
          <RouterProvider router={router} />
          <Toaster />
        </InventoryProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}