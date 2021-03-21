import { APIGatewayProxyHandler } from "aws-lambda";
import createError from "http-errors";
import { dynamodb } from "../shares/dynamodb";
import { commonMiddleware } from "../../lib/commonMiddleware";

const getNotes: APIGatewayProxyHandler = async (event: any) => {
  const { email } =
    typeof event.body === "string" ? JSON.parse(event.body) : event.body;

  if (!email) {
    throw createError.BadRequest("Missing required params");
  }

  try {
    const notes = await dynamodb
      .query({
        TableName: "SiteNotesTable-dev",
        KeyConditionExpression: "PK = :PK",
        ExpressionAttributeValues: {
          ":PK": `USER#${email}`,
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
