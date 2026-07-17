# SemanticGit (semgit) - Agent Instructions

## Project Overview
AI-powered CLI tool that translates plain-English descriptions into Conventional Commits 1.0.0 compliant messages using GPT-4o-mini via GitHub Models API.

## Repository Structure
```
semantic-git/
  packages/
    node-cli/       # Node.js CLI (main entry)
    python-cli/     # Python CLI (parallel implementation)
    web-dashboard/  # React + Vite onboarding/marketing page (not functional)
  core-prompts/     # Empty (system-instruction.txt.txt is 0 lines)
```

## Running the CLIs

**Node CLI:**
```bash
cd packages/node-cli
node src/index.js
```

**Python CLI:**
```bash
cd packages/python-cli
python semgit/cli.py
```
Note: Python CLI uses bare imports (`from auth import...`), must run as script, not module.

## Web Dashboard
```bash
cd packages/web-dashboard
npm run dev      # Dev server on :5173
npm run build    # Production build
npm run lint     # oxlint (NOT ESLint)
```

## Linting
- **web-dashboard only:** `oxlint` (oxc rules: react-hooks, export-components)
- **node-cli & python-cli:** No linting configured
- No root-level lint config exists

## Testing
- **No tests exist** in any package
- No test frameworks installed
- No test scripts defined

## Authentication
Both CLIs read token from `~/.semanticgit_token`.
AI endpoint: `https://models.inference.ai.azure.com/chat/completions` (gpt-4o-mini).
Octokit OAuth libs installed in node-cli but not yet wired up.

## Key Quirks (Agent Gotchas)

1. **No root package.json** - each package is independent, no monorepo tooling
2. **node_modules committed to git** - both Node packages have deps checked in
3. **`__pycache__` committed** - Python bytecode cache is tracked
4. **`dist/` committed** - web-dashboard build output is tracked
5. **No root .gitignore** - only web-dashboard has one (default Vite template)
6. **Empty files exist:** `node-cli/src/cli.js`, `node-cli/bin/`, `core-prompts/system-instruction.txt.txt`
7. **Python CLI has no dependency manifest** - must install `questionary` and `requests` manually
8. **web-dashboard is purely onboarding/marketing** - all mock data, no functional integration
9. **Single-component architecture** in dashboard - entire UI is one 825-line `App.jsx`

## Conventions
- Commit messages follow Conventional Commits 1.0.0
- ESM modules throughout (`"type": "module"` in package.json)
- No TypeScript anywhere (plain JS + JSX)
- Tailwind CSS for dashboard styling with custom neon/dark theme
