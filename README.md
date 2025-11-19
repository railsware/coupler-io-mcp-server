[![Lint & Test](https://github.com/railsware/coupler-io-mcp-server/actions/workflows/lint-and-test.yml/badge.svg)](https://github.com/railsware/coupler-io-mcp-server/actions/workflows/lint-and-test.yml)

# Coupler.io official MCP server
The Coupler.io MCP Server is a Model Context Protocol (MCP) server that provides seamless integration with Coupler.io APIs.
With Coupler.io MCP Server, you can analyze multi-channel marketing, financial, sales, e-commerce, and other business data within Claude by connecting to your Coupler.io data flows — query marketing, sales, and finance metrics from hundreds of sources. Fetch and transform raw data from platforms like Google Ads, Facebook, HubSpot, and Salesforce into actionable intelligence for smarter, faster decision-making with accurate, up-to-date business information.


## Use Cases
Get data from your Coupler.io data flows and ask your AI tool questions about it, like you would ask your fellow data analyst:

### Marketing: 
1. What's our overall customer acquisition cost across all paid channels this quarter compared to last quarter? I need this for the board meeting.
2. Show me the ROI breakdown by marketing channel for the past 6 months. I need to reallocate our annual budget.
3. Which campaigns are contributing most to our pipeline revenue? I want to double down on what's working.

### Sales:
1. Can you pull the sales pipeline report for this month? I need to see how many deals are in each stage and the total value at each stage.
2. What are our conversion rates from lead to opportunity and from opportunity to closed-won for the last quarter? How do they compare to our targets?
3. How many deals are expected to close this month based on their probability scores? What's our forecasted revenue vs our monthly target?

### Finance:
1. Check the profit for this quarter, compare it to last quarter, and provide a breakdown by department.
2. Could you provide a cash flow report for the last 30 days, including all incoming and outgoing transactions?
3. Share the current accounts receivable status and tell me how many overdue invoices we have and which customers owe the most.

## Prerequisites
1. Install [Docker](https://www.docker.com/) to run the server in a container.
2. Make sure Docker is running.
3. Get a [Coupler.io Personal Access Token](https://app.coupler.io/app/mcp/).

**OR**

Build a .dxt file using the command below and use it to install the local MCP.

## Running the server
### Claude Desktop
```json
{
  "mcpServers": {
    "coupler": {
      "command": "docker",
      "args": [
        "run",
        "--pull=always",
        "-e",
        "COUPLER_ACCESS_TOKEN",
        "--rm",
        "-i",
        "ghcr.io/railsware/coupler-io-mcp-server"
      ],
      "env": {
        "COUPLER_ACCESS_TOKEN": "<your_token>"
      }
    }
  }
}
```

NOTE: `"--pull=always"` will ensure you always have the latest image by pulling it from the registry.
Remove this line if you're offline or if you specifically want to use the image you've already pulled previously.

## Tools
### Data flows
- **get-data** - Gets the result of a data flow run as a SQLite file and executes a read-only query on it. To get the data from a Coupler.io data flow, you need the data flow to have an AI destination.
  - `dataflowId`: Data flow ID (`string`, **required**)
  - `executionId`: Data flow run ID (`string`, **required**)
  - `query`: Query to run on the data flow SQLite file (`string`, **required**)

- **get-schema** - Gets the data flow schema file. Currently, only data flows built from a dashboard or dataset template are supported.
  - `dataflowId`: Data flow ID (`string`, **required**)
  - `executionId`: Data flow run ID (`string`, **required**)
 
- **list-dataflows** – Gets the list of data flows that have an AI destination.
  - `dataflowId`: Data flow ID (`string`, **required**)
  - `executionId`: Data flow run ID (`string`, **required**)
 
- **get-dataflow** – Gets the metadata about the data flow, such as sources, data connections, last successfull execution, and error details (if present).
  - `dataflowId`: Data flow ID (`string`, **required**)
  - `executionId`: Data flow run ID (`string`, **required**)

## Development

Install NodeJS:
```shell
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install
```

Install dependencies:
```shell
npm install
```

Install Git hooks:
```shell
lefthook install
```

Set environment variables:
```shell
cp .env.example .env.local
```

### Work with a raw server
Run the MCP server:
```shell
# Use `--silent` flag to prevent NPM logging to STDOUT which breaks server transport
npm run --silent dev
```

#### Run [MCP server inspector](https://github.com/modelcontextprotocol/inspector) for debugging
Caveat: make sure to keep only a single inspector tab open at all times, until [this inspector bug](https://github.com/modelcontextprotocol/inspector/issues/302) is fixed.
```shell
# Run this and follow the instructions to view the inspector
npm run inspect:node
```

#### Tail logs
Our local MCP server uses STDIO transport, therefore logs must go to a file. This may come in handy when debugging.
```shell
tail -f log/development.log | npx pino-pretty
```
You can also optionally capture STDIO messages in the log file by setting `LOG_STDIO=1` when running the server.
If you're debugging a containerized server, you'd likely want to mount a dir at `/app/log` to be able to access the logs it generates.

### Working with the development Docker image
Build Docker image for development:
```shell
bin/build_image
```

You can now run the container with the MCP inspector for debugging in UI mode:
```shell
npm run inspect:docker
```

Or run the container within Claude Desktop, configured with your `.env.local` file in the project.
Grab the absolute path to your env file `realpath .env.local`.
Navigate to Settings > Developer > Edit Config.
Edit your `claude_desktop_config.json`, add an entry for our server:
```json
{
  "mcpServers": {
    "coupler-io-mcp-server-development": {
      "command": "docker",
      "args": [
        "run",
        "--env-file",
        "/path/to/your/.env.local",
        "--add-host",
        "storage.test=host-gateway",
        "--add-host",
        "lvh.me=host-gateway",
        "--rm",
        "-i",
        "coupler-io-mcp-server-development"
      ]
    }
  }
}
```

Or just run the image with Docker:
```
docker run --env-file .env.local \
  --add-host storage.test=host-gateway \
  --add-host lvh.me=host-gateway \
  --rm \
  -i \
  coupler-io-mcp-server-development
```

### Using MCP inspector
[Use MCP inspector in CLI mode](https://github.com/modelcontextprotocol/inspector/blob/24e8861a88f843d57cdb637a5ae3afd0e528c5f3/README.md#cli-mode) for smoke testing the server with a short feedback loop:

```shell
# List tools
npx @modelcontextprotocol/inspector --cli npm run dev --method tools/list

# Call list-dataflows tool
npx @modelcontextprotocol/inspector --cli npm run dev --method tools/call --tool-name list-dataflows

# Call get-schema tool
npx @modelcontextprotocol/inspector --cli npm run dev --method tools/call --tool-name get-schema --tool-arg dataflowId=<your data flow ID>
```

### Testing the Docker image against Coupler.io staging
We build and publish a Docker image of our MCP server, tagged `edge`, on every push to the `main` branch.

Configure Claude Desktop to run the Docker container against Coupler.io staging.
Navigate to Settings > Developer > Edit Config.
Edit your `claude_desktop_config.json`, add an entry for the staging server:
```json
{
  "mcpServers": {
    "coupler-io-mcp-server-staging": {
      "command": "docker",
      "args": [
        "run",
        "--pull",
        "always",
        "-e",
        "COUPLER_ACCESS_TOKEN",
        "--env",
        "COUPLER_API_HOST=https://app.couplerstaging.dev/mcp",
        "--rm",
        "-i",
        "ghcr.io/railsware/coupler-io-mcp-server:edge"
      ],
      "env": {
        "COUPLER_ACCESS_TOKEN": "<your_coupler_access_token_from_staging>"
      }
    }
  }
}
```

[Optional] Enable logging for debugging by adding the following args:
```json
        "--env",
        "LOG_LEVEL=debug",
        "--env",
        "LOG_STDIO=1",
```

### Building and pushing a release image
The development cycle looks like this:
- open a PR with changes
- use the `pr-N`-tagged image to debug and test your changes
- merge the PR to `main`
- test the `edge` image
- build and push a release image tagged as `latest`

To build and push a release image:
- draft a [new release](https://github.com/railsware/coupler-io-mcp-server/releases/new?target=main)
- specify a new tag to be created on publish. Use [semver](https://semver.org/)
- Target: `main` branch
- Generate or write release notes
- click "Publish release"
- check [the docker image workflow](https://github.com/railsware/coupler-io-mcp-server/actions/workflows/publish-docker-image.yml) progress

You should now be able to smoke-test the release image.
```shell
# Pull the `latest` image
docker pull ghcr.io/railsware/coupler-io-mcp-server
```
Run the release image with Claude Desktop and other supported clients.

## Claude Desktop extension (DXT)

### Build & self-sign
```shell
bin/build_dxt # => dxt_output/coupler-mcp.dxt
npm run dxt:selfsign
```

You can now either install the .dxt file or use the contents of `dxt/` dir to load unpacked extension from Developer menu.

## License
This project is licensed under the terms of the MIT open source license. Please refer to [MIT](./LICENSE) for the full terms.
