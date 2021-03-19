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
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamoDb:PutItem", "dynamodb:Query"],
        Resource: [
          {
            "Fn::GetAtt": ["SiteNotezTable", "Arn"],
          },
          {
            "Fn::Join": [
              "/",
              [{ "Fn::GetAtt": ["SiteNotezTable", "Arn"] }, "index/*"],
            ],
          },
        ],
      },
    ],
  },
  resources: {
    Resources: {
      SiteNotezTable: {
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
          ],
          KeySchema: [
            { AttributeName: "PK", KeyType: "HASH" },
            { AttributeName: "SK", KeyType: "RANGE" },
          ],
          GlobalSecondaryIndexes: [
            {
              IndexName: "GSI_link",
              KeySchema: [
                {
                  AttributeName: "SK",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "PK",
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
    createNote: {
      handler: "src/handlers/createNote.handler",
      events: [
        {
          http: {
            method: "POST",
            path: "note",
            cors: { origin: "*" },
          },
        },
      ],
    },
    getNotes: {
      handler: "src/handlers/getNote.handler",
      events: [
        { http: { method: "POST", path: "notes", cors: { origin: "*" } } },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
