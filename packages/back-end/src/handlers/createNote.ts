const AWS = require("aws-sdk");
import createError from "http-errors";
import { commonMiddleware } from "../../lib/commonMiddleware";

async function createNote(event) {
  const { email, link, note } = JSON.parse(event.body);
  if (!email || !link) {
    throw createError.BadRequest("Missing required params");
  }
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const noteItem = {
    PK: `USER#${email}`,
    SK: `LINK#${link}`,
    note,
  };

  try {
    await dynamoDB
      .put({
        TableName: "SiteNotesTable-dev",
        Item: noteItem,
      })
      .promise();
  } catch (error) {
    throw createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(noteItem),
  };
}

export const handler = commonMiddleware(createNote);
