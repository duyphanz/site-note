import { APIGatewayProxyHandler } from "aws-lambda";
const AWS = require("aws-sdk");
import createError from "http-errors";

import { commonMiddleware } from "../../lib/commonMiddleware";

const getNotes: APIGatewayProxyHandler = async (event: any) => {
  const { email, link } = JSON.parse(event.body);

  if (!email || !link) {
    throw createError.BadRequest("Missing required params");
  }

  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  try {
    const notes = await dynamoDB
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

export const handler = commonMiddleware(getNotes);
