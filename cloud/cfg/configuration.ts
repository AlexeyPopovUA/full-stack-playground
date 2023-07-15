export default {
    COMMON: {
        project: "fs-example",
        region: process.env?.AWS_DEPLOYMENT_REGION || "",
        account: process.env?.AWS_ACCOUNT || "",
        defaultEnvironment: process.env?.DEFAULT_BRANCH || "main"
    },
    HOSTING: {
        hostedZoneID: process.env?.HOSTED_ZONE_ID || "",
        hostedZoneName: "oleksiipopov.com",
        staticDomainName: "front-end.fs.examples.oleksiipopov.com",
        serviceDomainName: "service.fs.examples.oleksiipopov.com"
    }
};
