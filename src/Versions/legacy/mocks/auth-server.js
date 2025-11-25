import { testUsers, addUser } from "./test-users";

const simulateNetworkDelay = () => {
    return new Promise(resolve =>
        setTimeout(resolve, Math.random() * 1000 + 500)
    );
};

export const fakeAuthServer = {
    async login(credentials) {
        await simulateNetworkDelay();

        console.log('🔐 LOGIN ATTEMPT:', credentials); // ← что приходит
        console.log('📋 AVAILABLE USERS:', testUsers); // ← кто есть в базе

        const user = testUsers.find(u =>
            u.email === credentials.email &&
            u.password === credentials.password
        );

        console.log('👤 FOUND USER:', user); // отладка
        if (user) {
            return {
                success: true,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                },
                token: user.token,
                message: 'Login successful'
            };
        } else {
            return {
                success: false,
                error: 'Invalid email or password',
                code: 'AUTH_ERROR'
            };
        }
    },

    async register(userData) {
        await simulateNetworkDelay();

        const existingUser = testUsers.find(u => u.email === userData.email);
        if (existingUser) {
            return {
                success: false,
                error: 'User with this email already exists',
                code: 'USER_EXISTS'
            }
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            token: `fake-jwt-token-${Date.now()}`
        };

        addUser(newUser);

        return {
            success: true,
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email
            },
            token: newUser.token,
            message: 'Registration successful! You can now login'
        };
    }
};
