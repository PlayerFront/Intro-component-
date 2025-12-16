import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { authService } from '../services/auth-service';
import { success } from 'zod';

jest.mock('../services/auth-service');

describe('useAuth - legacy version', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);
  });

  test('login should set user when AuthService return success', async () => {
    authService.login.mockResolvedValue({
      success: true,
      user: { id: 1, email: 'demo@example.com' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'demo@example.com',
        password: 'Demo123!',
      });
    });

    expect(result.current.user.email).toBe('demo@example.com');
    expect(authService.login).toHaveBeenCalledWith({
      email: 'demo@example.com',
      password: 'Demo123!',
    });
  });

  test('login should set error when AuthService return failure', async () => {
    authService.login.mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    });

    const { result } = renderHook(() => useAuth());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: 'lalala@lala.com',
        password: 'Lalala123!',
      });
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('Invalid credentials');
  });

  test('login should handle network errors', async () => {
    authService.login.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuth());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: 'test@test.com',
        password: '123',
      });
    });

    expect(result.current.error).toBe('Login failed');
    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe('Login failed');
  });

  test('register should return success for new user', async () => {
    authService.register.mockResolvedValue({
      success: true,
      user: {
        id: 2,
        firstName: 'John',
        lastName: 'Test',
        email: 'john@test.com',
      },
      token: 'fake-jwt-token',
      message: 'Registration successful!',
    });

    const { result } = renderHook(() => useAuth());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register({
        firstName: 'John',
        lastName: 'Test',
        email: 'john@test.com',
        password: 'Password123!',
      });
    });

    expect(registerResult.success).toBe(true);
    expect(registerResult.data.user.email).toBe('john@test.com');
    expect(result.current.isLoading).toBe(false);
    expect(authService.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Test',
      email: 'john@test.com',
      password: 'Password123!',
    });
  });

  test('register should return error for existing email', async () => {
    authService.register.mockResolvedValue({
      success: false,
      error: 'User already exists',
    });

    const { result } = renderHook(() => useAuth());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register({
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        password: 'Demo123!',
      });
    });

    expect(result.current.error).toBe('User already exists');
    expect(registerResult.error).toBe('User already exists');
    expect(registerResult.success).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  test('register should handle network errors', async () => {
    authService.register.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAuth());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'Password123!',
      });
    });

    expect(result.current.error).toBe('Registration failed');
    expect(registerResult.success).toBe(false);
    expect(registerResult.error).toBe('Registration failed');
  });

  test('logout should clear user and error states', async () => {
    authService.login.mockResolvedValue({
      success: true,
      user: { id: 1, email: 'demo@example.com' },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'demo@example.com',
        password: 'Demo123!',
      });
    });

    expect(result.current.user).not.toBe(null);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);
  });
});