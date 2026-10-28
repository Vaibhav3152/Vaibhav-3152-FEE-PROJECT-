import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

// CONTEXT API (3 of 3): who is logged in.
// NOTE: this is a LEARNING demo. Real apps never keep passwords in
// localStorage, they send them to a server that hashes them.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useLocalStorage("nebula-accounts", []);
  const [user, setUser] = useLocalStorage("nebula-user", null);

  // the "user" we share with the app never includes the password
  const makeSafeUser = (account) => ({
    fullName: account.fullName,
    email: account.email,
    role: account.role,
    age: account.age,
  });

  const register = (details) => {
    const alreadyExists = accounts.find(
      (account) => account.email.toLowerCase() === details.email.toLowerCase()
    );

    if (alreadyExists) {
      return { ok: false, message: "An account with this email already exists. Try logging in." };
    }

    setAccounts([...accounts, details]);
    setUser(makeSafeUser(details));
    return { ok: true };
  };

  const login = (email, password) => {
    const found = accounts.find(
      (account) =>
        account.email.toLowerCase() === email.toLowerCase() &&
        account.password === password
    );

    if (!found) {
      return { ok: false, message: "That email and password do not match any account." };
    }

    setUser(makeSafeUser(found));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
