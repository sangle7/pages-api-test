module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testTimeout: 30000,
  transformIgnorePatterns: ['<rootDir>/node_modules/']
};
