import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: [['next/babel', { 'preset-react': { runtime: 'automatic' } }]] }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transformIgnorePatterns: ['/node_modules/(?!(lucide-react)/)'],
};

export default config;
