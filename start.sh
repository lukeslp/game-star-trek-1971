#!/bin/bash
cd "$(dirname "$0")"
PORT=${PORT:-5024} NODE_ENV=${NODE_ENV:-production} node dist/index.js
