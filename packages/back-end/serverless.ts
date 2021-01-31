import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "site-note-service",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    profile: "learning",
    region: "ap-southeast-1",
    runtime: "nodejs12.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
  },
  resources: {
    Resources: {
      SiteNoteTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "SiteNotesTable-${self:provider.stage}",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "PK",
              AttributeType: "S",
            },
            { AttributeName: "SK", AttributeType: "S" },
            { AttributeName: "GSIPK_note", AttributeType: "S" },
            { AttributeName: "GSISK_note", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },
            { AttributeName: "SK", KeyType: "RANGE" },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: "GSI_note",
              KeySchema: [
                {
                  AttributeName: "GSIPK_note",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "GSISK_note",
                  KeyType: "RANGE",
                },
              ],
              Projection: {
                ProjectionType: "ALL", // (ALL | KEYS_ONLY | INCLUDE)
              },
            },
          ],
        },
      },
    },
  },
  functions: {
    hello: {
      handler: "handler.hello",
      events: [
        {
          http: {
            method: "get",
            path: "hello",
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
