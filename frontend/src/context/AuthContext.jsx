import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // التحقق من وجود token عند تحميل التطبيق
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // التحقق من صحة التوكن
        validateToken();
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // التحقق من صحة التوكن
  const validateToken = async () => {
    try {
      const response = await authAPI.getUser();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('user_data', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      logout();
    }
  };

  // تسجيل الدخول
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { user: userData, token } = response.data;
        
        // حفظ البيانات في localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        // تحديث الحالة
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'حدث خطأ في تسجيل الدخول';
      return { success: false, message };
    }
  };

  // تسجيل مستخدم جديد
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { user: newUser, token } = response.data;
        
        // حفظ البيانات في localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(newUser));
        
        // تحديث الحالة
        setUser(newUser);
        setIsAuthenticated(true);
        
        return { success: true, user: newUser };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'حدث خطأ في التسجيل';
      return { success: false, message };
    }
  };

  // تسجيل الخروج
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // إزالة البيانات من localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // تحديث الحالة
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // تحديث الملف الشخصي
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        const updatedUser = response.data;
        
        // تحديث البيانات في localStorage
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        
        // تحديث الحالة
        setUser(updatedUser);
        
        return { success: true, user: updatedUser };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const message = error.response?.data?.message || 'حدث خطأ في تحديث الملف الشخصي';
      return { success: false, message };
    }
  };

  // التحقق من كون المستخدم مدير
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // التحقق من كون المستخدم عميل
  const isCustomer = () => {
    return user && user.role === 'customer';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
    isCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

