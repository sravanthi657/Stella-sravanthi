#!/bin/sh
# Push as the personal GitHub account regardless of which gh account is active.
set -e
TOKEN=$(gh auth token --user sravanthi657)
git push "https://sravanthi657:${TOKEN}@github.com/sravanthi657/Stella-sravanthi.git" "${1:-main}"
