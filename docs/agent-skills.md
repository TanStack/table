---
title: Agent Skills (TanStack Intent)
id: agent-skills
description: "Use TanStack Intent to wire TanStack Table's bundled Agent Skills into Claude Code, Cursor, GitHub Copilot, Codex, and other AI coding assistants."
keywords:
  - tanstack table
  - tanstack intent
  - agent skills
  - claude code
  - cursor
  - github copilot
  - codex
  - ai coding agents
  - SKILL.md
  - AGENTS.md
---

You're building with TanStack Table and using an AI coding agent such as Claude Code, Cursor, GitHub Copilot, or Codex. The agent keeps suggesting v8 APIs such as `useReactTable`, configures row models without explicit features, or renders with adapter patterns that no longer match v9. By the end of this guide, your agent will load TanStack Table's bundled skills automatically whenever you work on table code, and those skills will stay in sync with whichever TanStack Table version your project installs.

## What are Agent Skills?

Agent Skills are markdown documents (`SKILL.md`) that ship inside npm packages and tell AI coding agents how to use a library correctly: which functions to use, which patterns to avoid, and when to reach for a particular feature. The format is an open standard supported by Claude Code, Cursor, GitHub Copilot, Codex, and others.

TanStack Table publishes skills inside its packages so the guidance travels with `npm update` instead of being pinned in a model's training data or copied into an agent configuration file manually.

## Skills Shipped by TanStack Table

The skills available to your agent depend on which packages your project installs:

| Package                                                    | Skills                                               | What they teach                                                                                                                                                                                                         |
| ---------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@tanstack/table-core`                                     | `core`, `table-features`, and focused feature skills | Headless table architecture, explicit feature registration, TypeScript, client/server boundaries, migration, and features such as sorting, filtering, grouping, pagination, pinning, sizing, selection, and aggregation |
| `@tanstack/<framework>-table`                              | Framework-specific setup and state skills            | Creating, rendering, and controlling a table with your framework adapter; supported adapters also include migration and TanStack Query/Virtual composition skills                                                       |
| `@tanstack/table-devtools` and framework devtools adapters | `devtools`                                           | Registering table instances and inspecting features, state, options, rows, and columns                                                                                                                                  |
| `@tanstack/match-sorter-utils`                             | `fuzzy-ranking`                                      | Fuzzy filtering, ranking metadata, and rank-aware sorting                                                                                                                                                               |

Each skill lives under `node_modules/<package>/skills/<skill-name>/SKILL.md` once the package is installed. Skills can declare prerequisites, so your agent can load the core guidance before a framework or feature-specific skill.

## Step 1: Install TanStack Table

If you haven't already, install the adapter for your framework. See [Installation](./installation) for the full package list.

```bash
pnpm add @tanstack/react-table
```

Framework adapters install `@tanstack/table-core` as a dependency, so both the framework-specific and core skills are available to the installer.

## Step 2: Run `intent install`

From the root of your project, run:

```bash
npx @tanstack/intent@latest install
```

The CLI writes lightweight skill-loading guidance into your agent's config file. That guidance tells the agent to discover skills from the packages installed in your project and load the most relevant one before it starts a substantial task.

By default the guidance lands in `AGENTS.md`. The CLI can also update:

- `CLAUDE.md` for Claude Code
- `.cursorrules` for Cursor
- `.github/copilot-instructions.md` for GitHub Copilot

## Step 3: Review the Generated Guidance

The install command appends (or creates) an `intent-skills` block that looks like this:

```markdown
<!-- intent-skills:start -->

## Skill Loading

Before editing files for a substantial task:

- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->
```

Keep the block near the top of the config file so your agent sees it before task-specific instructions.

You can inspect and load Table skills yourself with the same commands:

```bash
npx @tanstack/intent@latest list
npx @tanstack/intent@latest load @tanstack/react-table#getting-started
npx @tanstack/intent@latest load @tanstack/table-core#sorting
```

If you prefer explicit task-to-skill entries, run `npx @tanstack/intent@latest install --map`. Mapping mode scans your installed intent-enabled packages and writes compact `id`, `run`, and `for` entries into the managed block.

## Step 4: Confirm It's Wired Up

Open a fresh session in your coding agent and ask it to build something with TanStack Table, for example: _"Build a sortable, paginated React table with TanStack Table v9."_

You should see:

- The agent uses `useTable()` instead of the v8 `useReactTable()` API.
- Features and row-model slots are declared explicitly with `tableFeatures()`.
- Static data, columns, and features keep stable references.
- The adapter's current rendering APIs are used instead of copied v8 rendering patterns.
- Table owns the headless model and state while your application owns markup, styles, interactions, and accessibility.

If the agent still falls back to v8 patterns, reopen its config file and confirm the `intent-skills` block is present. You can also run `intent list` to confirm that the installed Table packages are detected and `intent load` to inspect the matching guidance directly.

## Keeping Skills Current

Skills are versioned with each package. When you update your TanStack Table packages, the `SKILL.md` files under `node_modules` update with them. No CLI rerun is needed. If you use explicit mappings, rerun `npx @tanstack/intent@latest install --map` after adding another intent-enabled package, such as a Table devtools adapter, or when you want to refresh the mappings.

## Using Skills Without the CLI

If you'd rather wire skills in yourself, reference them directly from `node_modules` in any agent config file. The minimum your agent needs is a pointer to the relevant file:

```markdown
When working on TanStack React Table code, read and follow:
node_modules/@tanstack/react-table/skills/getting-started/SKILL.md
```

The CLI is recommended because it discovers installed packages automatically and stays consistent with the Agent Skills standard, but the underlying file paths are stable.

## Learn More

- [TanStack Intent documentation](https://tanstack.com/intent/latest/docs/overview), the CLI's full reference, including `scaffold`, `validate`, and CI setup for library maintainers.
- [Agent Skills registry](https://tanstack.com/intent/registry), where you can browse other intent-enabled packages.
