import createError from "http-errors";
import { commonMiddleware } from "../../lib/commonMiddleware";
import { dynamodb } from "../shares/dynamodb";

async function createNote(event) {
  const { email, link, note } =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  if (!email || !link) {
    throw createError.BadRequest("Missing required params");
  }

  const noteItem = {
    PK: `USER#${email}`,
    SK: `LINK#${link}`,
    note,
  };

  try {
    await dynamodb
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
