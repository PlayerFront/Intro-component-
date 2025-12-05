export const testUsers = [
  {
    id: 1,
    email: 'demo@example.com',
    password: 'Demo123!',
    firstName: 'Demo',
    lastName: 'User',
    token: 'fake-jwt-token-demo',
  },
];

export const addUser = (user) => {
  testUsers.push(user);
};
