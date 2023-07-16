import {Construct} from 'constructs';
import {RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import {AaaaRecord, ARecord, HostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {AttributeType, BillingMode, Table} from "aws-cdk-lib/aws-dynamodb";
import {HttpLambdaIntegration} from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import {
    CorsHttpMethod,
    DomainName,
    HttpApi,
    HttpMethod,
    HttpStage,
    MappingValue,
    ParameterMapping
} from "@aws-cdk/aws-apigatewayv2-alpha";

import {ApiGatewayv2DomainProperties} from "aws-cdk-lib/aws-route53-targets";

// monorepo dependencies
import {DemoConstruct} from "demo/src/demo-construct";
import {CounterConstruct} from "counter/src/counter-construct";

import configuration from "../../cfg/configuration";
import {TrpcDemoConstruct} from "trpc-demo/src/trpc-demo-construct";

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

        const lambdaCounterConstruct = new CounterConstruct(this, `${project}-counter-lambda`, {
            name: "counter",
            region: props.env?.region!,
            project,
            tableName: table.tableName,
            debug: true
        });

        table.grantReadWriteData(lambdaCounterConstruct.lambda);

        const lambdaDemoConstruct = new DemoConstruct(this, `${project}-demo-lambda`, {
            name: "demo",
            region: props.env?.region!,
            project,
            debug: true
        });

        const lambdaTrpcDemoConstruct = new TrpcDemoConstruct(this, `${project}-trpc-demo-lambda`, {
            name: "trpc-demo",
            region: props.env?.region!,
            project,
            debug: true
        });

        const lambdaCounterIntegration = new HttpLambdaIntegration(`${project}-counter-integration`, lambdaCounterConstruct.lambda, {
            parameterMapping: new ParameterMapping().overwritePath(MappingValue.requestPath())
        });

        const lambdaDemoIntegration = new HttpLambdaIntegration(`${project}-demo-integration`, lambdaDemoConstruct.lambda, {
            parameterMapping: new ParameterMapping().overwritePath(MappingValue.requestPath())
        });

        const lambdaTrpcDemoIntegration = new HttpLambdaIntegration(`${project}-trpc-demo-integration`, lambdaTrpcDemoConstruct.lambda, {
            parameterMapping: new ParameterMapping().overwritePath(MappingValue.requestPath())
        });

        const apiGateway = new HttpApi(this, `${project}-api-gateway`, {
            apiName: `${project}-api`,
            createDefaultStage: false
        });

        apiGateway.addRoutes({
            integration: lambdaCounterIntegration,
            path: "/counter",
            methods: [HttpMethod.GET, HttpMethod.OPTIONS]
        });

        apiGateway.addRoutes({
            integration: lambdaDemoIntegration,
            path: "/demo",
            methods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.OPTIONS]
        });

        apiGateway.addRoutes({
            integration: lambdaTrpcDemoIntegration,
            path: "/trpc-demo/{proxy+}",
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
