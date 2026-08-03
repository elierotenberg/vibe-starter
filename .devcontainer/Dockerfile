# The digest is the multi-platform image index published for the 24-bookworm tag.
FROM mcr.microsoft.com/devcontainers/typescript-node:24-bookworm@sha256:7f4046f8149ced6dbb5f79089bfac97a300627f9e08f91a47237b555e730e71c

ENV PATH="/opt/devcontainer-tools/node_modules/.bin:${PATH}" \
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 \
    DISABLE_AUTOUPDATER=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false

USER root

RUN apt-get update \
    && apt-get install --yes --no-install-recommends bubblewrap ca-certificates gh socat \
    && rm -rf /var/lib/apt/lists/* \
    && usermod --groups node node

WORKDIR /opt/devcontainer-tools
COPY .devcontainer/tools/package.json .devcontainer/tools/package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

COPY package.json /tmp/workspace-package.json
RUN npm install --global \
      "$(node --print 'require("/tmp/workspace-package.json").packageManager')" \
    && npm cache clean --force \
    && rm /tmp/workspace-package.json

RUN mkdir -p /etc/claude-code /etc/codex /home/node/.claude /home/node/.codex/tmp \
    && chown node:node /home/node/.claude /home/node/.codex /home/node/.codex/tmp \
    && chmod 0700 /home/node/.claude /home/node/.codex /home/node/.codex/tmp \
    && ln -s /home/node/.claude/.claude.json /home/node/.claude.json

COPY .devcontainer/claude-managed-settings.json /etc/claude-code/managed-settings.json
COPY .devcontainer/codex-requirements.toml /etc/codex/requirements.toml
COPY .devcontainer/codex-default-config.toml /usr/local/share/devcontainer-workspace/codex-config.toml
COPY .devcontainer/post-create.ts /usr/local/share/devcontainer-workspace/post-create.ts

RUN chown -R root:root /etc/claude-code /etc/codex /usr/local/share/devcontainer-workspace \
    && chmod 0555 /etc/claude-code /etc/codex /usr/local/share/devcontainer-workspace \
    && chmod 0444 \
      /etc/claude-code/managed-settings.json \
      /etc/codex/requirements.toml \
      /usr/local/share/devcontainer-workspace/codex-config.toml \
      /usr/local/share/devcontainer-workspace/post-create.ts

USER node
WORKDIR /workspace
