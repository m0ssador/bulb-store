import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentAdmin, loginAdmin } from "./api";
import { AuthContext } from "./authContext";
import type { AuthContextValue } from "./authContext";
import type { AuthUser } from "../types";

const STORAGE_KEY = "bulb-store-admin-token";

function readToken() {
  return localStorage.getItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsBootstrapping(false);
      return;
    }

    let isCancelled = false;
    setIsBootstrapping(true);

    getCurrentAdmin(token)
      .then((currentUser) => {
        if (!isCancelled) {
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          localStorage.removeItem(STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsBootstrapping(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const login = useCallback(async (loginValue: string, password: string) => {
    const response = await loginAdmin({ login: loginValue, password });
    localStorage.setItem(STORAGE_KEY, response.accessToken);
    setToken(response.accessToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    setIsBootstrapping(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isBootstrapping,
      login,
      logout,
    }),
    [isBootstrapping, login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
