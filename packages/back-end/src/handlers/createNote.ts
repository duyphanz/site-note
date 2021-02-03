const AWS = require("aws-sdk");
import createError from "http-errors";
import { v4 as uuid } from "uuid";
import { commonMiddleware } from "../../lib/commonMiddleware";

async function createNote(event) {
  const { email, link, note = {} } = event.body;
  if (!email || !link) {
    throw createError.BadRequest("Missing required params");
  }
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  const linkItem = await dynamoDB
    .query({
      TableName: "SiteNotesTable-dev",
      KeyConditionExpression: "PK = :PK and SK = :SK",
      ExpressionAttributeValues: {
        ":PK": `USER#${email}`,
        ":SK": `LINK#${link}`,
      },
    })
    .promise();

  const linkKey = `LINK#${link}`;
  const notekey = `NOTE#${uuid()}`;
  const noteKey = `USER#${email}#LINK#${link}#${notekey}`;

  const noteItem = {
    TableName: "SiteNotesTable-dev",
    Item: {
      PK: noteKey,
      SK: noteKey,
      GSIPK_note: `USER#${email}#LINK#${link}`,
      GSISK_note: notekey,
      ...note,
    },
  };

  if (linkItem.Count < 1) {
    await dynamoDB
      .transactWrite({
        TransactItems: [
          {
            Put: {
              TableName: "SiteNotesTable-dev",
              Item: {
                PK: `USER#${email}`,
                SK: linkKey,
                GSIPK_note: linkKey,
                GSISK_note: linkKey,
              },
            },
          },
          {
            Put: noteItem,
          },
        ],
      })
      .promise();
  } else {
    await dynamoDB.put(noteItem.Item);
  }

  try {
  } catch (error) {
    throw createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(noteItem.Item),
  };
}

export const handler = commonMiddleware(createNote);
