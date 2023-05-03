import type { AWS } from '@serverless/typescript'

import functions from './resources/functions'

const serverlessConfiguration: AWS = {
  service: 'poc-test',
  frameworkVersion: '3',
  configValidationMode: 'error',
  variablesResolutionMode: '20210326',
  custom: {
    ['serverless-offline']: {
      httpPort: 3000,
      babelOptions: {
        presets: ['env'],
      },
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: 'test',
    region: 'us-east-1',
    lambdaHashingVersion: '20201221',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: [
              {
                'Fn::Join': [
                  '/',
                  [{ 'Fn::GetAtt': ['TestBucket', 'Arn'] }, '*'],
                ],
              },
            ],
          },
        ],
      },
    },
  },
  functions,
  resources: {
    Resources: {
      TestBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 's3-metadata-test-bucket',
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
