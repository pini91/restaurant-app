// module.exports = {
//   testEnvironment: 'node',
//   setupFilesAfterEnv: ['<rootDir>/__test__/setup.js'],
//   collectCoverageFrom: [
//     '**/*.js',
//     '!node_modules/**',
//     '!coverage/**',
//     '!jest.config.js',
//     '!__test__ /**'
//   ],
//   testMatch: ['**/__test__/**/*.js','**/?(*.)+(spec|test).js'],
//   verbose: true,
//   forceExit: true,
//   clearMocks: true,
//   resetMocks: true,
//   restoreMocks: true,
//   testTimeout: 10000
// }

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/__test__/setup.js'], // plural "__tests__"
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!jest.config.js',
    '!__tests__/**'  // remove space here
  ],
  testMatch: ['**/__test__/**/*.js'], // remove space here
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 10000
};
