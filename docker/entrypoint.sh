#!/usr/bin/env bash

set -euo pipefail

# Bun only recognizes development|test|production NODE_ENV values.
# We map our custom envs to .env.<NODE_ENV> file to load it with the --env-file option.
# We also ensure NODE_ENV is lowercase.
ENV_FILE=".env.$(echo $NODE_ENV | tr '[:upper:]' '[:lower:]')"

exec bun --env-file "$ENV_FILE" start
