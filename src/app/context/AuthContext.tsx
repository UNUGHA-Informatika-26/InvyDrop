import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadUser() {
      try {
        const storedUser = await AsyncStorage.getItem('warehouse-user');
        if (storedUser && isMounted) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Error loading stored user:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem('warehouse-users');
      const users = usersData ? JSON.parse(usersData) : [];

      if (users.find((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        return false;
      }

      const newUser = {
        id: generateId(),
        name,
        email,
        password,
      };

      users.push(newUser);
      await AsyncStorage.setItem('warehouse-users', JSON.stringify(users));

      const userSession = { id: newUser.id, email: newUser.email, name: newUser.name };
      setUser(userSession);
      await AsyncStorage.setItem('warehouse-user', JSON.stringify(userSession));

      return true;
    } catch (e) {
      console.error('Signup error:', e);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const usersData = await AsyncStorage.getItem('warehouse-users');
      const users = usersData ? JSON.parse(usersData) : [];

      const foundUser = users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        return false;
      }

      const userSession = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userSession);
      await AsyncStorage.setItem('warehouse-user', JSON.stringify(userSession));

      return true;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem('warehouse-user');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
