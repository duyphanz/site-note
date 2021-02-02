const AWS = require("aws-sdk");
import createError from 'http-errors';
import "source-map-support/register";

import { commonMiddleware } from "../../lib/commonMiddleware";

async function createNote(event) {
  console.log("🚀 ~ file: createNote.ts ~ line 6 ~ createNote ~ event", event);

  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const item = {
    PK: "abc",
    SK: "xyz",
  };

  try {
    await dynamoDB
      .put({
        TableName: 'SiteNotesTable-dev',
        Item: item,
      })
      .promise();
  } catch (error) {
    throw createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({ item }),
  };
}

export const handler = commonMiddleware(createNote);
