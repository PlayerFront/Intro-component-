import { useState } from 'react';
import { authService } from '../services/auth-service';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
    
  const login = async(credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        setUser(response.user);
        return {
          success: true,
          data: response,
        };
      } else {
        setError(response.error);
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (err) {
      setError('Login failed');
      return {
        success: false,
        error: 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);

      if(response.success) {
        return {
          success: true,
          data: response,
        };
      } else {
        setError(response.error);
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (err) {
      setError('Registration failed');
      return {
        success: false,
        error: 'Registration failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};