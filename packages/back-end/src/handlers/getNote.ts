import { APIGatewayProxyHandler } from "aws-lambda";
import createError from "http-errors";
import { dynamodb } from "../shares/dynamodb";

import { commonMiddleware } from "../../lib/commonMiddleware";

const getNote: APIGatewayProxyHandler = async (event: any) => {
  const { email, link } =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  if (!email || !link) {
    throw createError.BadRequest("Missing required params");
  }

  try {
    const notes = await dynamodb
      .query({
        TableName: "SiteNotesTable-dev",
        KeyConditionExpression: "PK = :PK and SK = :SK",
        ExpressionAttributeValues: {
          ":PK": `USER#${email}`,
          ":SK": `LINK#${link}`,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(notes.Items),
    };
  } catch (error) {
    throw createError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(getNote);
