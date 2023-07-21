import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocument, GetCommand} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({region: process.env.REGION});
const ddbDocClient = DynamoDBDocument.from(client);

export const getItemByKey = async (key: string) => {
    let currentCfg;

    try {
        const command = new GetCommand({
            TableName: process.env.TABLE,
            Key: {
                environment: key
            }
        })

        const {Item} = await ddbDocClient.send(command);

        currentCfg = Item;
    } catch (e) {
        console.error(e);
    }

    return currentCfg;
}
