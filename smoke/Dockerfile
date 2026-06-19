# syntax=docker/dockerfile:1
#
# Clean-room "community install" smoke image for @agent-ix/quoin.
#
# The build context is THIS directory (smoke/), which deliberately contains no
# .npmrc and no @agent-ix scope override — so the container resolves packages
# exactly like an outside developer on a fresh machine would.
#
# The package + Claude Code plugin are installed at RUNTIME (entrypoint), not at
# build time, so bumping PKG_VERSION needs no rebuild.
FROM node:24-bookworm-slim

ARG CLAUDE_VERSION=latest

RUN apt-get update \
 && apt-get install -y --no-install-recommends git jq ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && npm install -g @anthropic-ai/claude-code@${CLAUDE_VERSION}

# Per-package identity consumed by the generic entrypoint/assert scripts.
ENV PKG=@agent-ix/quoin \
    BIN=quoin \
    PLUGIN=quoin \
    MARKETPLACE=quoin \
    REPO=agent-ix/quoin \
    HOME=/root

COPY . /smoke
RUN chmod +x /smoke/entrypoint.sh /smoke/assert.sh /smoke/run.sh

ENTRYPOINT ["/smoke/entrypoint.sh"]
