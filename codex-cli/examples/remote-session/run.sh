#!/bin/bash
# Simple script to launch the remote Codex session server

dir="$(cd "$(dirname "$0")" && pwd)"
cd "$dir" || exit 1
codexzipus
