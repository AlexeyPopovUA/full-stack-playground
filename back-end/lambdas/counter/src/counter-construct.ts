import {resolve} from "node:path";
import { Construct } from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {IFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";
import {RetentionDays} from "aws-cdk-lib/aws-logs";

export type CustomProps = {
    region: string;
    project: string;
    name: string;
    tableName: string;
    debug?: boolean;
};

export class CounterConstruct extends Construct {
    public lambda: IFunction;
    constructor(scope: Construct, id: string, props: CustomProps) {
        super(scope, id);

        this.lambda = new NodejsFunction(this, `${props.project}-${props.name}-lambda`, {
            handler: "handler",
            runtime: Runtime.NODEJS_18_X,
            entry: resolve(process.cwd(), "../back-end/lambdas/counter/src/lambda.ts"),
            timeout: Duration.seconds(10),
            logRetention: RetentionDays.ONE_DAY,
            memorySize: 128,
            description: `${props.project}-${props.name}-lambda`,
            environment: {
                REGION: props.region,
                DEBUG: props.debug ? "express:*" : "",
                TABLE: props.tableName
            }
        });
    }
}
