[![Lint & Test](https://github.com/railsware/coupler-io-mcp-server/actions/workflows/lint-and-test.yml/badge.svg)](https://github.com/railsware/coupler-io-mcp-server/actions/workflows/lint-and-test.yml)

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
        "ghcr.io/railsware/coupler-io-mcp-server"
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

### Working with development Docker image
Build Docker image for development:
```shell
bin/build_image
```

You can now run the container with the MCP inspector for debugging:
```shell
bun inspect:docker
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

### Testing the Docker image against Coupler.io staging
We build and publish a Docker image with of our MCP server, tagged `edge`, on every push to the `main` branch.

The image is currently private,
you have to [authenticate to Github Container Registry (GHCR)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry) in order to access it.
- [Create a personal access token (classic)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic) with at least `read:packages` scope
- Once you have the token, make sure to store it securely in your password manager
- sign in to GHCR with the `docker` CLI
```shell
export CR_PAT=YOUR_TOKEN
echo $CR_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```
- check that you authenticated successfully by pulling our image:
```shell
docker pull ghcr.io/railsware/coupler-io-mcp-server:edge
```

You can now configure Claude Desktop to run the Docker container against Coupler.io staging.
Navigate to Settings > Developer > Edit Config.
Edit your `claude_desktop_config.json`, add an entry for the staging server:
```json
{
  "mcpServers": {
    "coupler-io-mcp-server-staging": {
      "command": "docker",
      "args": [
        "run",
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

Enable logging by adding the following args:
```json
        "--env",
        "LOG_LEVEL=debug",
        "--env",
        "LOG_STDIO=1",
```

## License
This project is licensed under the terms of the MIT open source license. Please refer to [MIT](./LICENSE) for the full terms.
