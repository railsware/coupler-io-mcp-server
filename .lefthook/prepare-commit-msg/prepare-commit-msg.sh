#!/usr/bin/env bash

INPUT_FILE=$1
START_LINE=$(head -n1 "$INPUT_FILE")
PATTERN="^\[(CPL-[[:digit:]]+[[:space:]]*)+\]|^\[no-ticket\]|^(Merge)|^(fixup!)"

if ! [[ "$START_LINE" =~ $PATTERN ]]; then

  # parses CPL-xxx jira ticket key from the branch name
  TICKET_NUMBER_FROM_BRANCH=$(git symbolic-ref --short HEAD | grep -i -o -E 'CPL-[0-9]+' | tr '[:lower:]' '[:upper:] | xargs')

  if [[ -n "$TICKET_NUMBER_FROM_BRANCH" ]]; then
    echo "[$TICKET_NUMBER_FROM_BRANCH] $(cat "$INPUT_FILE")" > "$INPUT_FILE"
  fi
fi
