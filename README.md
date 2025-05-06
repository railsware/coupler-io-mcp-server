[![test](https://github.com/railsware/coupler-io-mcp-server/actions/workflows/ci.yml/badge.svg)](https://github.com/railsware/coupler-io-mcp-server/actions/workflows/ci.yml)

# Coupler.io official MCP server
The Coupler.io MCP Server is a Model Context Protocol (MCP) server that provides seamless integration with Coupler.io APIs.

## Use Cases
- Extracting and analyzing data from Coupler.io data flows.

## Prerequisites
1. Install [Docker](https://www.docker.com/) to run the server in a container.
2. Make sure Docker is running.
3. Get a [Coupler.io Personal Access Token](https://app.coupler.io/app/ai_features)

## Running the server
### Claude Desktop
```json
{
  "mcpServers": {
    "coupler": {
      "command": "docker",
      "args": [
        "run",
        "-e",
        "COUPLER_ACCESS_TOKEN",
        "--rm",
        "-i",
        "coupler_mcp:latest"
      ],
      "env": {
        "COUPLER_ACCESS_TOKEN": "<your_token>"
      }
    }
  }
}
```

## Tools
### Data flows
- **get-data** - Gets the result of a data flow run as a SQLite file and executes a read-only query on it.
  - `dataflowId`: Data flow ID (`string`, **required**)
  - `query`: Query to run on the data flow SQLite file (`string`, **required**)

- **get-schema** - Gets the data flow schema file.
  - `dataflowId`: Data flow ID (`string`, **required**)

## Development

Install Bun and NodeJS:
```shell
# Add Bun plugin
asdf plugin add bun
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install
```

Install dependencies:
```shell
bun install
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
bun start
```

#### Run [MCP server inspector](https://github.com/modelcontextprotocol/inspector) for debugging
Caveat: make sure to keep only a single inspector tab open at all times, until [this inspector bug](https://github.com/modelcontextprotocol/inspector/issues/302) is fixed.
```shell
# Run this and follow the instructions to view the inspector
bun inspect:bun
```

#### Tail logs
Our local MCP server uses STDIO transport, therefore logs must go to a file. This may come in handy when debugging.
```shell
tail -f log/development.log | bun pino-pretty
```
You can also optionally capture STDIO messages in the log file by setting `LOG_STDIO=1` when running the server.
If you're debugging a containerized server, you'd likely want to mount a dir at `/app/log` to be able to access the logs it generates.

### Work with a containerized server
Build a dev Docker image:
```shell
bin/build_image
```

#### Run MCP inspector
```shell
bun inspect:docker
```

#### Run container within Claude Desktop
Navigate to Settings > Developer > Edit Config.
Edit your `claude_desktop_config.json`, add an entry for our server:
```json
{
  "mcpServers": {
    "coupler": {
      "command": "docker",
      "args": [
        "run",
        "-e",
        "COUPLER_ACCESS_TOKEN",
        "--add-host",
        "storage.test=host-gateway",
        "--add-host",
        "lvh.me=host-gateway",
        "--rm",
        "-i",
        "coupler_mcp"
      ],
      "env": {
        "COUPLER_ACCESS_TOKEN": "<your_token>"
      }
    }
  }
}
```
