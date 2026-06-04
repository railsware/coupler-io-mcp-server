[![Lint & Test](https://github.com/railsware/coupler-io-mcp-server/actions/workflows/lint-and-test.yml/badge.svg)](https://github.com/railsware/coupler-io-mcp-server/actions/workflows/lint-and-test.yml)

# Coupler.io MCP server

Chat with your business data inside the AI assistant you already use. The Coupler.io
[Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server connects your
Coupler.io data flows — built from **400+ sources** like Google Ads, Facebook, HubSpot,
Salesforce, Stripe, Shopify, GA4 and more — to your AI tool, so you can ask questions
about your marketing, sales, finance and product data in plain language.

Every answer is backed by Coupler.io's Analytical Engine: the AI never queries your
source systems directly — it asks Coupler.io, which **executes the query, verifies the
calculations, and returns only validated results**.

> **Looking to just use it?** You don't need this repository. Most users connect through
> the **hosted remote MCP** in a few clicks — see [Connect your AI tool](#connect-your-ai-tool)
> below. This repo is the **local (self-hosted) MCP server**, for users who prefer to run
> it on their own machine.

## Use cases

Get data from your Coupler.io data flows and ask your AI tool questions about it, like
you would ask a fellow data analyst:

### Marketing
1. What's our overall customer acquisition cost across all paid channels this quarter compared to last quarter? I need this for the board meeting.
2. Show me the ROI breakdown by marketing channel for the past 6 months. I need to reallocate our annual budget.
3. Which campaigns are contributing most to our pipeline revenue? I want to double down on what's working.

### Sales
1. Can you pull the sales pipeline report for this month? I need to see how many deals are in each stage and the total value at each stage.
2. What are our conversion rates from lead to opportunity and from opportunity to closed-won for the last quarter? How do they compare to our targets?
3. How many deals are expected to close this month based on their probability scores? What's our forecasted revenue vs our monthly target?

### Finance
1. Check the profit for this quarter, compare it to last quarter, and provide a breakdown by department.
2. Could you provide a cash flow report for the last 30 days, including all incoming and outgoing transactions?
3. Share the current accounts receivable status and tell me how many overdue invoices we have and which customers owe the most.

## Supported AI tools

Coupler.io AI integrations work with all the major assistants. Set up a data flow with an
AI destination once, then query it from any of these:

| AI tool | How it connects |
|---------|-----------------|
| [Claude](https://www.coupler.io/claude-integrations) — Claude.ai, Claude Desktop, Claude Code, Cowork | Web/org connector, or local Desktop Extension (this repo) |
| [ChatGPT](https://www.coupler.io/chat-gpt-integrations) — incl. Codex | Connector (remote MCP) |
| [Cursor](https://www.coupler.io/ai-integrations) | MCP / Desktop Extension |
| [Perplexity](https://www.coupler.io/perplexity-integrations) | Native connector |
| [Gemini CLI](https://www.coupler.io/ai-integrations) | Remote MCP over HTTP (`gemini mcp add …`) |
| [Gemini Enterprise](https://www.coupler.io/ai-integrations) | Remote MCP over HTTP |
| [Microsoft Copilot Studio](https://www.coupler.io/ai-integrations) | Connector (remote MCP) |
| [OpenClaw](https://www.coupler.io/ai-integrations) | Remote MCP via the `mcporter` skill |
| Custom MCP | Any MCP-capable client, using your remote MCP URL |

See the [AI Integrations overview](https://www.coupler.io/ai-integrations) and the
[docs](https://docs.coupler.io/functionality/ai-agent-and-integrations/ai-integrations)
for the latest list and per-tool setup guides.

## Connect your AI tool

There are two ways to connect Coupler.io to your AI assistant.

### Remote MCP (hosted — recommended)

Each tool connects differently. In every flow you first **create and run a data flow** in
Coupler.io with the matching tool set as the **destination** (only data flows with that
destination are exposed to it). Your account-specific connection URL,
`https://mcp.coupler.io/mcp/<your-account-id>`, is shown on the MCP page at
**[app.coupler.io/app/mcp](https://app.coupler.io/app/mcp/)**.

#### Claude — Chat & Cowork (web connector)

For Claude.ai chat and Claude Cowork:
1. Create and run a data flow with **Claude** as the destination.
2. In Claude, open **Settings → Connectors**, add the Coupler.io connector and click **Connect**. On Team/Enterprise plans an admin must add it first.
3. Click **Connect** once more and log in to Coupler.io to authorize.
4. Open a new chat and start asking about your data.

#### Claude Code (CLI)

1. Create and run a data flow with **Claude** as the destination.
2. Start a new session in Claude Code and run:
   ```shell
   claude mcp add coupler-io --transport http https://mcp.coupler.io/mcp
   ```
3. Restart the session.
4. Run `/mcp`, select **Coupler.io**, and complete authentication in the browser when prompted.

#### ChatGPT (incl. Codex)

1. Create and run a data flow with **ChatGPT** as the destination.
2. In ChatGPT, add the **Coupler.io app**, click **Connect**, and authorize in the browser.
3. Click **Start chat**. For later sessions, make sure the Coupler.io app is active via **+ → More** (a checkmark should appear next to it).

#### Gemini CLI (remote MCP over HTTP)

1. Create and run a data flow with **Gemini** as the destination, and make sure Gemini CLI is installed.
2. Add the Coupler.io MCP server:
   ```shell
   gemini mcp add coupler --transport=http --scope=user https://mcp.coupler.io/mcp/<your-account-id>
   ```
3. Start Gemini CLI and authenticate: `/mcp auth coupler`.
4. A browser window opens — sign in and authorize access to your Coupler.io account.

#### Gemini Enterprise (GCP custom MCP server)

1. In Coupler.io, **create OAuth credentials** for Gemini Enterprise (account admin/owner only) — Coupler.io issues a Client ID and Client Secret (the secret is shown once).
2. In GCP, open **Gemini Enterprise → Data stores → Create data store** and choose **Custom MCP server** (see Google's guide).
3. Paste the values Coupler.io shows: **MCP Server URL** (`https://mcp.coupler.io/mcp/<your-account-id>`), **Authorization URL**, **Token URL**, **Scopes** (`mcp`), and the **Client ID / Client Secret**.
4. Create and run a data flow with **Gemini Enterprise** as the destination.

#### Microsoft Copilot Studio

1. Open [Microsoft Copilot Studio](https://copilotstudio.microsoft.com), pick the agent to extend, and make sure **generative orchestration** is on (the default for new agents).
2. Go to **Tools → Add a tool → New tool → Model Context Protocol** and paste the MCP URL (`https://mcp.coupler.io/mcp/<your-account-id>`).
3. Set **Authentication** to **OAuth 2.0** with **Dynamic discovery** — no client ID or secret needed; Copilot Studio registers itself automatically. Click **Create**; users consent and sign in to Coupler.io once.
4. Create and run a data flow with **Microsoft Copilot Studio** as the destination.

#### OpenClaw (via the `mcporter` skill)

1. Create and run a data flow with **OpenClaw** as the destination.
2. Collect the [Coupler.io skill from ClawHub](https://clawhub.ai/nika-is-nika/coupler-io).
3. Ask OpenClaw to connect the Coupler.io MCP using that skill, and complete the auth flow in the browser.

> **Cursor and Perplexity** connect through a local install rather than the hosted endpoint —
> see [Local MCP](#local-mcp-self-hosted--this-repository) below.

Step-by-step guides with screen recordings for every tool live in the
[Coupler.io docs](https://docs.coupler.io/functionality/ai-agent-and-integrations/ai-integrations).

#### Remote MCP tools

The hosted remote MCP exposes a much broader, continuously growing tool set. Some operations
are gated behind account feature flags.

**Data & analysis** (available to all clients):

- **get-data** — Query a Coupler.io data flow's data (the `data` table) with read-only SQL.
- **get-schema** — Get the typed column schema and AI context for a data flow / dataset.
- **list-datasets** — Discover available datasets, optionally filtered by data flow.
- **search-datasets** — Search across datasets to find relevant data.
- **list-dataflows** — List the user's data flows.
- **get-dataflow** — Get a data flow's current state, sources, and destinations.
- **list-templates** — Discover prebuilt templates by source, metric, or category.
- **run-dataflow** — Trigger a data flow run to refresh its data.
- **update-dataset** — Persist an AI-context (markdown) description for a dataset.
- **update-dataset-schema** — Update a dataset's schema definition.

**Skills**:

- **list-skills** — List specialized, end-to-end workflows.
- **get-skill** — Fetch a skill's full procedure by name.

**Guided data flow setup** (feature-flagged):

- **list-credentials** — List the user's source/destination credentials.
- **list-integrations** — List available source or destination integrations.
- **get-integration** — Get an integration's parameters, auth requirements, and options.
- **get-integration-field-options** — Resolve dynamic option values for an integration field.
- **create-dataflow** — Create a new, empty data flow.
- **create-dataflow-from-template** — Create a data flow from a template.
- **create-dataflow-source** / **update-dataflow-source** — Add or modify a data flow's source.
- **create-dataflow-destination** / **update-dataflow-destination** — Add or modify a data flow's destination.

### Local MCP (self-hosted — this repository)

Run the MCP server on your own machine so analysis stays local. Two options:

**A. Claude Desktop Extension (`.mcpb`)** — the simplest local option:
1. Download the Coupler.io extension (`.mcpb`) — see [build instructions](#claude-desktop-extension-mcpb), or grab it from the Coupler.io MCP page.
2. In Claude Desktop: **Settings → Extensions → Install Extension**, select the file.
3. Paste your [Coupler.io Personal Access Token](https://app.coupler.io/app/mcp/) when prompted.

**B. Docker** — run the published image directly:

Prerequisites: [Docker](https://www.docker.com/) installed and running, and a
[Coupler.io Personal Access Token](https://app.coupler.io/app/mcp/).

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

> `--pull=always` keeps the image up to date by pulling the latest on each run. Remove it if you're offline or want to pin a previously pulled image.

## Local server tools

The self-hosted server (this repository) exposes a focused, read-only set of data-flow tools:

- **get-data** — Gets the result of a data flow run as a SQLite file and runs a read-only query on it. The data flow must have an AI destination.
  - `dataflowId` (`string`, **required**), `executionId` (`string`, **required**), `query` (`string`, **required**)
- **get-schema** — Gets the data flow schema file (data flows built from a dashboard or dataset template).
  - `dataflowId` (`string`, **required**), `executionId` (`string`, **required**)
- **list-dataflows** — Lists data flows that have an AI destination.
- **get-dataflow** — Gets data flow metadata: sources, connections, last successful execution, and error details.
  - `dataflowId` (`string`, **required**)

## Security

- AI tools never connect to your source systems — all access flows through Coupler.io's secure layer.
- Connections use **scoped, read-only, short-lived tokens**; the AI can list, query and inspect schemas, but cannot modify, delete, or reach raw source credentials.
- Coupler.io is **SOC 2 Type II** certified and **GDPR / HIPAA / DORA** compliant. See the [Trust Center](https://www.coupler.io/security).

## Development

Install Node.js and dependencies:
```shell
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf install
npm install
lefthook install
cp .env.example .env.local
```

Run the server (use `--silent` so npm logs don't break the stdio transport):
```shell
npm run --silent dev
```

Debug with the [MCP inspector](https://github.com/modelcontextprotocol/inspector) (keep a single inspector tab open):
```shell
npm run inspect:node
```

Logs go to a file (stdio transport):
```shell
tail -f log/development.log | npx pino-pretty
```

### Claude Desktop Extension (MCPB)

Build and self-sign the `.mcpb` extension:
```shell
bin/build_mcpb        # => mcpb_output/coupler-mcp.mcpb
npm run mcpb:selfsign
```
Install the `.mcpb` file, or load the unpacked `mcpb_output/` dir from Claude Desktop's Developer menu.

## License

Licensed under the terms of the [MIT](./LICENSE) open source license.
