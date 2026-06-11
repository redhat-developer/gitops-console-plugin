import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '.*\\.test\\.tsx?$',
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
    '@gitops/(.*)': '<rootDir>/src/gitops/$1',
    '@gitops-models/(.*)': '<rootDir>/src/gitops/models/$1',
    '@gitops-services/(.*)': '<rootDir>/src/gitops/services/$1',
    '@gitops-shared/(.*)': '<rootDir>/src/gitops/components/shared/$1',
    '@openshift-console/dynamic-plugin-sdk/lib/(.*)': '<rootDir>/__mocks__/dynamic-plugin-sdk.tsx',
    '@openshift-console/dynamic-plugin-sdk': '<rootDir>/__mocks__/dynamic-plugin-sdk.tsx',
    '@openshift-console/dynamic-plugin-sdk-internal/(.*)': '<rootDir>/__mocks__/dynamic-plugin-sdk.tsx',
    '@patternfly/react-icons': '<rootDir>/__mocks__/patternfly-react-icons.tsx',
    '@patternfly/react-core': '<rootDir>/__mocks__/patternfly-react-core.tsx',
    '@patternfly/react-tokens/(.*)': '<rootDir>/__mocks__/patternfly-react-tokens.ts',
    '@patternfly/react-table': '<rootDir>/__mocks__/patternfly-react-table.tsx',
    '@patternfly/react-topology': '<rootDir>/__mocks__/patternfly-react-topology.ts',
    '^lodash-es$': 'lodash',
    '^json-schema$': '<rootDir>/__mocks__/json-schema.ts',
    'react-i18next': '<rootDir>/__mocks__/react-i18next.ts',
    '\\.(css|scss)$': '<rootDir>/__mocks__/style-mock.ts',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};

export default config;
