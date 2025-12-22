// module.exports = {
//   clearMocks: true,
//   collectCoverage: true,
//   coverageDirectory: "coverage",
//   coverageProvider: "v8",
//   testEnvironment: "jsdom",
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
//   moduleNameMapper: {
//     '\\.(css|scss|sass)$': 'identity-obj-proxy',
//     '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
//   },

//   transform: {
//     '^.+\\.(js|jsx)$': 'babel-jest',
//   },
//   transformIgnorePatterns: [
//     '/node_modules/(?!(react|react-dom)/)',
//   ],

//    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

//   testMatch: [
//     '<rootDir>/src/**/*.test.js',
//     '<rootDir>/src/**/*.test.jsx',
//     '<rootDir>/src/**/__tests__/**/*.js',
//     '<rootDir>/src/**/__tests__/**/*.jsx',
//   ],
// };

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // ИЗМЕНЕНИЕ: используем ts-jest для всего
  preset: 'ts-jest',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  
  // Расширения файлов
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  
  // Где искать тесты
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/**/*.test.jsx',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
  ],
  
  // Игнорируем node_modules
  transformIgnorePatterns: [
    '/node_modules/',
  ],
};