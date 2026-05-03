import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const initializeAuth = async () => {
 const token = localStorage.getItem('token');
 const savedUser = localStorage.getItem('user');

 if (token) {
 try {
 
 let restoredUser = savedUser ? JSON.parse(savedUser) : null;

 try {
 const profile = await authApi.getProfile();
 restoredUser = {
 ...restoredUser, 
 ...profile, 
 is_admin: restoredUser?.is_admin ?? false,
 email: restoredUser?.email ?? '',
 role: restoredUser?.role ?? 'user',
 id: restoredUser?.id ?? profile.user_id,
 };
 } catch (profileError) {
 console.warn('Profile fetch failed, using cached user data', profileError);
 }

 if (restoredUser) {
 setUser(restoredUser);
 } else {
 localStorage.removeItem('token');
 localStorage.removeItem('user');
 }
 } catch (error) {
 console.error("Auth initialization failed", error);
 localStorage.removeItem('token');
 localStorage.removeItem('user');
 }
 }
 setLoading(false);
 };

 initializeAuth();
 }, []);

 const login = async (credentials) => {
 const data = await authApi.login(credentials);
 localStorage.setItem('token', data.access_token);
 // Persist the full user object (includes is_admin, email, role)
 localStorage.setItem('user', JSON.stringify(data.user));
 setUser(data.user);
 return data;
 };

 const register = async (userData) => {
 const data = await authApi.register(userData);
 return data;
 };

 const logout = () => {
 localStorage.removeItem('token');
 localStorage.removeItem('user');
 setUser(null);
 window.location.href = '/login';
 };

 return (
 <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
 {children}
 </AuthContext.Provider>
 );
};
