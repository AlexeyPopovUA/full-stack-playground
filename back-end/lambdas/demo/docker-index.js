exports.handler = async function (event, context) {
    console.log("test");
    console.log(JSON.stringify(event));
    return context.logStreamName;
};
