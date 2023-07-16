import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({region: process.env.REGION});
const ddbDocClient = DynamoDBDocument.from(client);

export const getRecordFromDB = async (environment: string) => {
    let currentCfg;

    try {
        const {Item} = await ddbDocClient.get({
            TableName: process.env.TABLE,
            Key: {
                environment
            }
        });

        currentCfg = Item;
    } catch (e) {
        console.error(e);
    }

    return currentCfg;
};
