module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./src', './tests'],
  silent: false,
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  globals: {
    'ts-jest': {
      // This is important for ESM setup with ts-jest
      // It tells ts-jest to use the same module system as your tsconfig
      tsconfig: 'tsconfig.json',
      // If you get errors, you might need specific `diagnostics` or `isolatedModules` settings
      isolatedModules: true, // Often needed with ESM
    },
  },
  setupFiles: [
    "./tests/jest.env.setup.ts",
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  setupFilesAfterEnv: ['./tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': './src/$1'
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  maxWorkers: 1
};

