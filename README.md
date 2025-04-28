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

Run the MCP server:
```shell
bun start
```

### Run [MCP server inspector](https://github.com/modelcontextprotocol/inspector) for debugging
Caveat: make sure to keep only a single inspector tab open at all times, until [this inspector bug](https://github.com/modelcontextprotocol/inspector/issues/302) is fixed.
```shell
# Run this and follow the instructions to view the inspector
bun inspect
```

### Build and run with Docker
```shell
docker build \
  --build-arg NODE_ENV=development \
  --build-arg COUPLER_API_HOST=http://api.lvh.me:3000 \
  --build-arg STORAGE_HOST=http://storage.test:4443 \
   -t coupler_mcp -f docker/Dockerfile .

docker run --rm -i coupler_mcp
```

### Run within Claude Desktop

- navigate to Settings > Developer > Edit Config
- edit your `claude_desktop_config.json`, add entry for our server, e.g.:
```json
{
  "mcpServers": {
    "coupler": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "coupler_mcp"
      ]
    }
  }
}
```

### Build Docker image for release
```shell
docker build -t <release_tag> -f docker/Dockerfile .
```
