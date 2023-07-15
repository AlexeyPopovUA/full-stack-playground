import {resolve} from "path";
import {Construct} from 'constructs';
import {Duration, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import {ARecord, AaaaRecord, HostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {AttributeType, BillingMode, Table} from "aws-cdk-lib/aws-dynamodb";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import {HttpLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
    HttpApi,
    HttpMethod,
    HttpStage,
    ParameterMapping,
    MappingValue,
    DomainName
} from "@aws-cdk/aws-apigatewayv2-alpha";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {ApiGatewayv2DomainProperties} from "aws-cdk-lib/aws-route53-targets";

import configuration from "../../cfg/configuration";

export class ServiceStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const project = configuration.COMMON.project;
        const environmentKey = "environment";
        const stageName = configuration.COMMON.defaultEnvironment;

        const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${project}-hosted-zone`, {
            hostedZoneId: configuration.HOSTING.hostedZoneID,
            zoneName: configuration.HOSTING.hostedZoneName
        });

        const certificate = new Certificate(this, `${project}-cert`, {
            domainName: configuration.HOSTING.serviceDomainName,
            validation: CertificateValidation.fromDns(hostedZone)
        });

        const table = new Table(this, `${project}-config-db`, {
            partitionKey: {
                name: environmentKey,
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY,
            tableName: `${project}-db`
        });

        const lambda = new NodejsFunction(this, `${project}-lambda`, {
            handler: "handler",
            runtime: Runtime.NODEJS_18_X,
            entry: resolve(process.cwd(), "./lambdas/lambda.ts"),
            timeout: Duration.seconds(10),
            logRetention: RetentionDays.ONE_DAY,
            memorySize: 128,
            description: "Example service",
            environment: {
                REGION: props.env?.region ?? "",
                TABLE: table.tableName,
                DEBUG: "express:*"
            }
        });

        table.grantReadWriteData(lambda);

        const lambdaIntegration = new HttpLambdaIntegration(`${project}-integration`, lambda, {
            parameterMapping: new ParameterMapping().overwritePath(MappingValue.requestPath())
        });

        const apiGateway = new HttpApi(this, `${project}-api-gateway`, {
            apiName: `${project}-api`,
            createDefaultStage: false
        });

        apiGateway.addRoutes({
            integration: lambdaIntegration,
            path: "/",
            methods: [HttpMethod.GET, HttpMethod.OPTIONS]
        });

        apiGateway.addRoutes({
            integration: lambdaIntegration,
            path: "/by-key",
            methods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.OPTIONS]
        });

        const domainName = new DomainName(this, `${project}-domain-name`, {
            domainName: configuration.HOSTING.serviceDomainName,
            certificate
        });

        new HttpStage(this, `${project}-stage`, {
            stageName,
            httpApi: apiGateway,
            autoDeploy: true,
            domainMapping: {
                domainName
            }
        });

        new ARecord(this, `${project}-record-a`, {
            recordName: configuration.HOSTING.serviceDomainName,
            zone: hostedZone,
            target: RecordTarget.fromAlias(new ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId))
        });

        new AaaaRecord(this, `${project}-record-4a`, {
            recordName: configuration.HOSTING.serviceDomainName,
            zone: hostedZone,
            target: RecordTarget.fromAlias(new ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId))
        });
    }
}
