# Monorepo

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

