import { fakeAuthServer } from './auth-server';
import { testUsers } from './test-users';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fakeAuthServer - Mock Server', () => {
  describe('register', () => {
    test('should successfelly register new user', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'new@example.com',
        password: 'Password123!',
      };

      const result = await fakeAuthServer.register(newUser);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('new@example.com');
      expect(result.user.password).toBeUndefined();
      expect(result.token).toMatch(/fake-jwt-token/);
      expect(result.message).toContain('successful');
    });

    test('should return error when registering with existing email', async () => {
      const existingUser = {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        password: 'Demo123!',
      };

      const result = await fakeAuthServer.register(existingUser);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User with this email already exists');
      expect(result.user).toBeUndefined();
    });
  });

  describe('login', () => {
    test('should successfully login with correct credentials', async () => {
      const existingUser = testUsers[0];
      const credentials = {
        email: existingUser.email,
        password: existingUser.password,
      };

      const result = await fakeAuthServer.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe(existingUser.email);
      expect(result.user.firstName).toBe(existingUser.firstName);
    });

    test('should return error for wrong password', async() => {
      const existingUser = testUsers[0];
      const credentials = {
        email: existingUser.email,
        password: 'WrongPassword123!',
      };

      const result = await fakeAuthServer.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
    });

    test('should retunr error for non-existing user', async() => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      const result = await fakeAuthServer.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
    });
  });
});