# Coupler.io official MCP server

## Use Cases

## Prerequisites

## Setup

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
