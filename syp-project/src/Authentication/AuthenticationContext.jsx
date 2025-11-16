import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Registered users

  // Simulate registration
  const register = (fullName, email, password) => {
    if (users.find(u => u.email === email)) {
      return { error: 'Email already registered' };
    }
    const newUser = { fullName, email, password };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true };
  };

  // Simulate login
  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return { success: true };
    }
    return { error: 'Invalid email or password' };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
