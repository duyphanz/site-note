const AWS = require("aws-sdk");
import { ClientConfiguration } from "aws-sdk/clients/dynamodb";

const dynOption: ClientConfiguration = {};

if (process.env.IS_OFFLINE) {
  dynOption.endpoint = "http://localhost:8000";
}

export const dynamodb = new AWS.DynamoDB.DocumentClient(dynOption);
