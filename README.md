# Monorepo

This is a monorepo of a simple fullstack application that demonstrates fully automated system that includes next things:
* Front-end application (super simple web app that makes a couple of REST and TRPC requests)
* Back End lambdas that implement different types of API "hello world" examples using regular REST or TRPC calls. Those calls resolve either a hardcoded string or a record from the database
* Infrastructure as a code that implements static web hosting for the front-end app with dynamic subdomains as feature branches
* Infrastructure as a code that implements hosting for API with multiple microservices
* GitHub actions that deploy all components above automatically on each push to git

## Commands

### Install

```shell
npm i --include-workspace-root -ws
```

### Run front-end

```shell
npm run start -w front-end
```

## Demo

#### Front-end application

https://main.dev.front-end.fs.examples.oleksiipopov.com/

#### Back-end API's:

Hello world:
GET https://service.fs.examples.oleksiipopov.com/demo

Get counter data from DynamoDB:
GET https://service.fs.examples.oleksiipopov.com/counter

TRPC:
GET https://service.fs.examples.oleksiipopov.com/trpc-demo/greet?input=%22INPUT%22

