import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApiService } from './services/api';
import { STORAGE_KEYS } from './services/api/client';
import { setCredentials, clearCredentials } from './store/slices/authSlice';
import type { RootState } from './store';
import type { SignUpDto, SignInDto, UserSession } from './types/chat';
import type { ToastMessage } from './components/common/feedback/Toast';
import { Toast } from './components/common/feedback/Toast';
import { Layout } from './layouts/Layout';
import { AppRouter } from './routes';
import { Spinner } from './components/common/spinners/Spinner';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const active = ApiService.getActiveSession();
      if (active && active.email) {
        try {
          const freshUser = await ApiService.getUserDetails(active.email);
          const session: UserSession = {
            id: String(freshUser.id),
            email: freshUser.email,
            first_name: freshUser.first_name,
            last_name: freshUser.last_name,
            token: active.token,
          };
          localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(session));
          dispatch(setCredentials(session));
        } catch (error) {
          console.error("Failed to restore fresh session, using local session as fallback", error);
          dispatch(setCredentials(active));
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch]);

  const addToast = useCallback((text: string, type: ToastMessage['type']) => {
    const id = `toast-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogin = async (data: SignInDto) => {
    const session = await ApiService.login(data);
    dispatch(setCredentials(session));
    addToast(`Welcome back, ${session.first_name}!`, 'success');
  };

  const handleSignUp = async (data: SignUpDto) => {
    const session = await ApiService.signUp(data);
    dispatch(setCredentials(session));
    addToast('Your account was initialized successfully.', 'success');
  };

  const handleLogout = () => {
    ApiService.logout();
    dispatch(clearCredentials());
    addToast('You have been logged out of the workspace.', 'info');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <AppRouter
        user={user}
        onLogout={handleLogout}
        addToast={addToast}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />

      {/* Floating System alerts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </Layout>
  );
}

export default App;
