import { fakeAuthServer } from '../mocks/auth-server';

export const authService = {
  async login(credentials) {
    console.log('Sending to MOCK API - Login', credentials); //!!!!!!!!!!!!
    try {
      const response = await fakeAuthServer.login(credentials);
      console.log('MOCK API response:', response); //!!!!!!!!!!!!!!
      return response;
    } catch (error) {
      console.log('MOCK API error', error); //!!!!!!!!!!!!!!!
      return {
        success: false,
        error: 'Network error',
        code: 'NETWORK_ERROR',
      };
    }
  },

  async register(userData) {
    console.log('Sending to MOCK API - register', userData);
    try {
      const response = await fakeAuthServer.register(userData);
      console.log('MOCK API response', response); //!!!!!!!!!!!
      return response;
    } catch (error) {
      console.log('MOCK API error', error); //!!!!!!!!!!!!
      return {
        success: false,
        error: 'Network error',
        code: 'NETWORK_ERROR',
      };
    }
  },
};