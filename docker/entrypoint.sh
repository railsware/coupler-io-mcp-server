#!/usr/bin/env bash

set -euo pipefail

# Bun only loads .env.(development|test|production) files natively.
# We map our custom envs to .env.<NODE_ENV> file to load it with the --env-file option.
# See https://github.com/oven-sh/bun/blob/500199fe8b61bde69a73a635e1546c2c099ca282/docs/runtime/env.md for more info.
#
# We also ensure NODE_ENV is lowercase.
ENV_FILE=".env.$(echo $NODE_ENV | tr '[:upper:]' '[:lower:]')"

exec bun --env-file "$ENV_FILE" start
