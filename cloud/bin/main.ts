#!/usr/bin/env node
import 'source-map-support/register';
import {App} from 'aws-cdk-lib';

import configuration from "../cfg/configuration";
import {ServiceStack} from '../stacks/service/service-stack';
import {FrontEndHostingStack} from "../stacks/front-end/front-end-hosting-stack";

const app = new App();

new ServiceStack(app, `${configuration.COMMON.project}-service`, {
    env: {
        account: configuration.COMMON.account,
        region: configuration.COMMON.region
    }
});

new FrontEndHostingStack(app, `${configuration.COMMON.project}-front-end-hosting`, {
    env: {
        account: configuration.COMMON.account,
        region: configuration.COMMON.region
    }
});
