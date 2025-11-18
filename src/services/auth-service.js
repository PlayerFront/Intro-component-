import { fakeAuthServer } from "../mocks/auth-server";

export const authService = {
    async login(credentials) {
        try {
            return await fakeAuthServer.login(credentials);
        } catch (error) {
            return {
                success: false,
                error: 'Network error',
                code: 'NETWORK_ERROR'
            };
        }
    },

    async register(userData) {
        try {
            return await fakeAuthServer.register(userData);
        } catch (error) {
            return {
                success: false,
                error: 'Network error',
                code: 'NETWORK_ERROR'
            };
        }
    }
};