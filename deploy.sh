#!/bin/sh
# Build and publish dist/ to the gh-pages branch (GitHub Pages source).
set -e
TOKEN=$(gh auth token --user sravanthi657)
REMOTE="https://sravanthi657:${TOKEN}@github.com/sravanthi657/Stella-sravanthi.git"
bun run build
cd dist
touch .nojekyll
git init -q
git checkout -qb gh-pages
git add -A
git -c user.name="Stella Sravanthi" -c user.email="stellasravanthidevarakonda@gmail.com" commit -qm "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git push -qf "$REMOTE" gh-pages
cd .. && rm -rf dist/.git
echo "deployed gh-pages"
