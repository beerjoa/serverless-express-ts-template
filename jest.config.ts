import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testEnvironmentOptions: {
      NODE_ENV: 'test'
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.build/'],
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    detectOpenHandles: true
  };
};
