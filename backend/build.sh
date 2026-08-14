#!/usr/bin/env bash
set -e

# Set writable Cargo home so Rust-based packages can compile if needed
export CARGO_HOME=/tmp/.cargo
mkdir -p /tmp/.cargo

echo "==> Upgrading pip..."
pip install --upgrade pip setuptools wheel

echo "==> Installing dependencies (prefer pre-built binary wheels)..."
pip install \
  --prefer-binary \
  --no-cache-dir \
  -r requirements.txt

echo "==> Build complete!"
