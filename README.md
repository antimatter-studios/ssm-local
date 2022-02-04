# SSM Local

![CI](https://github.com/christhomas/ssm-local/workflows/CI/badge.svg)

A _Good Enough_ offline emulator for [Amazon SSM Parameter Store](https://aws.amazon.com/systems-manager/features/#Parameter_Store).

## Credits

This is a refitted version of the Cognito Local project that James Gregory wrote. I took the codebase, stripped out the Cognito implementation, added SSM Parameter Store API Functions, then cleaned and scrubbed the codebase. 

[Cognito Local](https://github.com/jagregory/cognito-local)

Without his amazing work. This project would not have been possible. Thank you James!

## Table of Contents

<!-- toc -->

- [Supported Features](#supported-features)
- [Usage](#usage)
  - [via Docker](#via-docker)
  - [via Docker Compose](#via-docker-compose)
  - [via Node](#via-node)
  - [Using a different host or port](#using-a-different-host-or-port)
  - [Updating your application](#updating-your-application)
  - [Creating your first parameter](#creating-your-first-parameter)
- [Known Limitations](#known-limitations)
- [Advanced](#advanced)
  - [Debugging SSM Local](#debugging-ssm-local)

<!-- tocstop -->

## Supported Features

| Feature                          | Support              |
| -------------------------------- | -------------------- |
| GetParameter                     | ✅                   |
| GetParameters                    | ✅                   |
| DeleteParameter                  | ✅                   |
| DeleteParameters                 | ✅                   |
| DescribeParameters               | ✅                   |
| ListTagsForResource              | 🕒 (partial support) |
| PutParameter                     | ✅                   |
| GetParameterHistory              | ❌                   |
| GetParametersByPath              | ❌                   |
| LabelParameterVersion            | ❌                   |
| UnlabelParameterVersion          | ❌                   |


> ¹ does not support pagination or query filters, all results and attributes will be returned in the first request.
## Usage

### via Docker

    docker run --publish 9230:9230 christhomas/ssm-local:latest

SSM Local will now be listening on `http://0.0.0.0:9230`.

To persist your ssm data between runs, mount the `/app/data` volume to your host machine:

    docker run --publish 9230:9230 --volume $(pwd)/data:/app/data christhomas/ssm-local:latest

### via Docker Compose

    docker compose up --build

SSM Local will not be listening on `http://0.0.0.0:9230`

### via Node

  Running via Node is a good way to debug and find problems, fix them live, add features etc.

    npm install --save-dev
    yarn add --dev

    # to run in the local terminal
    yarn start:watch

SSM Local will now be listening on `http://0.0.0.0:9230`.

### Using a different host or port

ssm-local runs on host `0.0.0.0` and port `9230` by default. If you would like to use a different port, you can set the `HOST` and `PORT` environment variable:

`HOST=localhost PORT=4000 yarn start:watch`

If you're running in Docker, you can also rebind the [published ports](https://docs.docker.com/config/containers/container-networking/#published-ports)
when you run:

`docker run -p4000:9230 christhomas/ssm-local`

Or combine the two approaches by [setting an environment variable](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file)
when you run:

`docker run -p4000:4000 -e PORT=4000 christhomas/ssm-local`

The same can be done in docker-compose with [environment variables](https://docs.docker.com/compose/environment-variables/#set-environment-variables-in-containers)
and [port binding](https://docs.docker.com/compose/networking/) in compose.

### Updating your application

You will need to update your AWS code to use the local address for SSM Locals endpoint. For example, if you're using `aws-sdk` in the `js` language you can update your `SSM` usage to override the endpoint:

```js
new AWS.SSM({
  /* ... normal options ... */
  endpoint: "http://0.0.0.0:9230/",
});
```

You only want to do this when you're running locally on your development machine.

### Creating your first parameter

Once you've started SSM Local the easiest way to create a new SSM Parameter is with the aws-cli:

```shell
aws --endpoint http://0.0.0.0:9230 ssm put-parameter --name /some/key --value "This is an example" --type "String"
```

It should output something like this:

```shell
{
    "Version": 1,
    "Tier": "Standard"
}
```

> Replace the `--endpoint` with whatever host and port you're running SSM Local on.

If you are running from `yarn` then a file `data/ssm.json` will be created, you can view the contents by using this command `cat data/ssm.json`. You can verify the parameter created is in fact being stored.

You can use this command to the aws cli to get back the information you set

```shell
aws --endpoint http://0.0.0.0:9230 ssm get-parameter --name /some/key
```

and it should output something like

```shell
{
    "Parameter": {
        "Name": "/some/key",
        "Type": "String",
        "Value": "This is an example",
        "Version": 1,
        "LastModifiedDate": "2022-02-04T18:52:33+01:00",
        "ARN": "arn:aws:ssm:eu-west-1:112233445566:parameter/some/key",
        "DataType": "text"
    }
}
```

You may commit the `data/ssm.json` to version control if you would like all your team to use a common set of SSM parameters when developing,

## Known Limitations

- Many features are missing
## Advanced

### Debugging SSM Local

There's a few different ways you can debug SSM Local. _Currently, it's best to debug SSM Locally via Node, and not with Docker_.

#### Verbose logging

If you just need more logs to understand what SSM Local is doing, you can use the `DEBUG` environment variable.

```shell
DEBUG=1 yarn start:watch
```

Which will print extra debug logs to the terminal (with `{...}` replaced by detailed information):

```
[1643981253427] DEBUG: NONE NONE loadConfig
GET DEBUGGING:  [] { key: 'config' }
[1643981253469] DEBUG: NONE NONE StormDBDataStoreFactory.create {"id":"config"}
[1643981253570] DEBUG: NONE NONE Creating new data store {"id":"config"}
[1643981253595] DEBUG: NONE NONE DataStore.save {"store":{}}
[1643981253626] DEBUG: NONE NONE DataStore.getRoot
GET DEBUGGING:  [] { key: 'ssm' }
[1643981253645] DEBUG: NONE NONE Loaded config {"config":{"path":"data"}}
[1643981253648] DEBUG: NONE NONE StormDBDataStoreFactory.get {"id":"ssm"}
[1643981253668] DEBUG: NONE NONE Opening existing data store: data/ssm.json {"id":"ssm"}
| [1643981253797] INFO: NONE NONE SSM Local running on http://0.0.0.0:9230
```

#### VSCode debugger

There's a launch configuration included in the repo at [.vscode/launch.json](./.vscode/launch.json).

If you open `Run and Debug` and start the `SSMLocal` configuration it will start SSM Local and attach the
debugger.

Put a breakpoint in [src/bin/start.ts](./src/bin/start.ts) or in the target for the API call you want to debug
(e.g. [src/targets/GetParameter.ts](./src/targets/GetParameter.ts)) and run your code that uses SSM Local or a CLI command.

#### WebStorm debugger

There's a WebStorm run configuration included in the repo at
[.idea/runConfigurations/SSMLocal.xml](./.idea/runConfigurations/SSMLocal.xml).

A `SSMLocal` entry should appear in the Run Configurations drop-down in the toolbar, which you can Run or Debug.
Alternatively, the `Run > Debug` menu will let you pick a Run Configuration to launch.

Put a breakpoint in [src/bin/start.ts](./src/bin/start.ts) or in the target for the API call you want to debug
(e.g. [src/targets/createUserPool.ts](./src/targets/GetParameter.ts)) and run your code that uses SSM Local or a CLI command.

#### Chrome DevTools

> Note: due to a poor choice of ports on my part, Chrome will spam SSM Local with HTTP requests if you have the
> NodeJS DevTools open. I'll change the default port for SSM Local at some point to fix this.

Launch SSM Local using the `start:debug` script:

```shell
yarn start:debug
```

This will configure NodeJS to start the inspector on port `9230`.

Open Chrome and navigate to `chrome://inspect`. Click the `Open dedicated DevTools for Node` link which will open a new DevTools window. You can then open the Sources tab and browse to a SSM Local file, or press `Cmd+P` or `Ctrl+P` to open the file navigator and open `src/bin/start.ts` or a target you want to debug then place a breakpoint and run your code that uses SSM Local or a CLI command.
