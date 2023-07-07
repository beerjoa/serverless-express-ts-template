import type { AWS as Serverless } from '@serverless/typescript';
import base from './functions/base';

const serverlessConfiguration: Serverless = {
  service: 'express-ts-lambda',
  frameworkVersion: '3',
  plugins: ['serverless-plugin-typescript', 'serverless-tscpaths', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'us-west-2'
  },
  functions: {
    base
  },
  package: { individually: true },
  custom: {
    serverlessPluginTypescript: {
      tsConfigFileLocation: './tsconfig.json'
    },
    tscpaths: {
      buildPath: '.build'
    },
    'serverless-offline': {
      noPrependStageInUrl: true,
      httpPort: '${env:PORT}',
      host: '${env:HOST}'
    }
  }
};

module.exports = serverlessConfiguration;
