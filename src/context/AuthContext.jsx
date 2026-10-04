import { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "artnest_user";
const AuthContext = createContext(null);

const DEMO_USERS = {
  buyer: { name: "Aarav Nair", tagline: "Art collector", initials: "AN", role: "buyer" },
  artist: { name: "Aarav Mehta", tagline: "Paintings artist", initials: "AM", role: "artist" },
  admin: { name: "ArtNest Admin", tagline: "Administrator", initials: "AD", role: "admin" },
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load);

  const login = useCallback((role) => {
    const next = DEMO_USERS[role];
    setUser(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}