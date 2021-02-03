const AWS = require("aws-sdk");
import createError from "http-errors";
import "source-map-support/register";

import { commonMiddleware } from "../../lib/commonMiddleware";

async function createNote(event) {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  try {
    await dynamoDB
      .transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: "SiteNotesTable-dev",
              Item: {
                PK: "USER#email",
                SK: "LINK#abc.com",
                GSIPK_note: "LINK#abc.com",
                GSISK_note: "LINK#abc.com",
              },
            },
          },
          {
            Put: {
              TableName: "SiteNotesTable-dev",
              Item: {
                PK: "USER#email#LINK#abc.com#NOTE#1",
                SK: "USER#email#LINK#abc.com#NOTE#1",
                GSIPK_note: "USER#email#LINK#abc.com",
                GSISK_note: "NOTE#1",
                position: { x: 10, y: 20 },
                description: "day la note",
              },
            },
          },
          {
            Put: {
              TableName: "SiteNotesTable-dev",
              Item: {
                PK: "USER#email#LINK#abc.com#NOTE#2",
                SK: "USER#email#LINK#abc.com#NOTE#2",
                GSIPK_note: "USER#email#LINK#abc.com",
                GSISK_note: "NOTE#2",
                position: { x: 40, y: 40 },
                description: "day la note 2",
              },
            },
          },
        ],
      })
      .promise();
  } catch (error) {
    throw createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
  };
}

export const handler = commonMiddleware(createNote);
