import { authService } from './auth-service';
import { fakeAuthServer } from '../mocks/auth-server';

jest.mock('../mocks/auth-server');

describe('auth-service - API wrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('login should return success response from fakeAuthServer', async () => {
    const mockSuccessResponse = {
      success: true,
      user: { id: 1, email: 'demo@example.com'},
      token: 'fake-jwt-token-demo',
    };

    fakeAuthServer.login.mockResolvedValue(mockSuccessResponse);

    const credentials = { email: 'demo@example.com', password: 'Password123!'};

    const result = await authService.login(credentials);

    expect(fakeAuthServer.login).toHaveBeenCalledWith(credentials);
    expect(result).toEqual(mockSuccessResponse);
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  test('register should return success response from fakeAuthServer', async () => {
    const mockSuccessResponse = {
      success: true, 
      user: {id: 2, email: 'john@demo.com'},
      token: 'fake-jwt-token-123',
    };

    fakeAuthServer.register.mockResolvedValue(mockSuccessResponse);

    const userData = {
      firstName: 'John',
      lastName: 'Demo',
      email: 'john@demo.com',
      password: 'Password123!',
    };

    const result = await authService.register(userData);

    expect(fakeAuthServer.register).toHaveBeenCalledWith(userData);
    expect(result).toEqual(mockSuccessResponse);
    expect(console.log).toHaveBeenCalledTimes(2);
  });

  test('login should handke network errors', async () => {
    fakeAuthServer.login.mockRejectedValue(new Error('Network failed'));

    const credentials = { email: 'demo@example.com', password: '123'};

    const result = await authService.login(credentials);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
    expect(result.code).toBe('NETWORK_ERROR');
    expect(console.log).toHaveBeenCalledWith('MOCK API error', expect.any(Error));
  });

  test('register should handle network errors', async() => {
    fakeAuthServer.register.mockRejectedValue(new Error('Network failed'));

    const userData = { 
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      password: 'Password123!',
    }; 

    const result = await authService.register(userData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
    expect(result.code).toBe('NETWORK_ERROR');
    expect(console.log).toHaveBeenCalledWith('MOCK API error', expect.any(Error));
  });
});
