import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('warehouse-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Get existing users
    const usersData = localStorage.getItem('warehouse-users');
    const users = usersData ? JSON.parse(usersData) : [];

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // In production, this should be hashed
    };

    // Save to users list
    users.push(newUser);
    localStorage.setItem('warehouse-users', JSON.stringify(users));

    // Auto login
    const userSession = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userSession);
    localStorage.setItem('warehouse-user', JSON.stringify(userSession));

    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get existing users
    const usersData = localStorage.getItem('warehouse-users');
    const users = usersData ? JSON.parse(usersData) : [];

    // Find user
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return false;
    }

    // Set session
    const userSession = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
    setUser(userSession);
    localStorage.setItem('warehouse-user', JSON.stringify(userSession));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('warehouse-user');
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
