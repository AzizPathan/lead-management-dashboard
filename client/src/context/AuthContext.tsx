import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loginRequest, meRequest, registerRequest } from "../api/auth";
import type { Role, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isBootstrapping: boolean;
  login(email: string, password: string): Promise<void>;
  register(input: { name: string; email: string; password: string; role: Role }): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smart_leads_token"));
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsBootstrapping(false);
      return;
    }
    meRequest()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("smart_leads_token");
        setToken(null);
      })
      .finally(() => setIsBootstrapping(false));
  }, [token]);

  const storeSession = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem("smart_leads_token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isBootstrapping,
      login: async (email, password) => {
        const session = await loginRequest(email, password);
        storeSession(session.token, session.user);
      },
      register: async (input) => {
        const session = await registerRequest(input);
        storeSession(session.token, session.user);
      },
      logout: () => {
        localStorage.removeItem("smart_leads_token");
        setToken(null);
        setUser(null);
      }
    }),
    [isBootstrapping, storeSession, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
