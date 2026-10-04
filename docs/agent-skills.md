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

| Package                                                    | Skills                                                                         | What they teach                                                                                                                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@tanstack/table-core`                                     | `core`, `table-features`, `table-state`, `custom-features`, `migrate-v8-to-v9` | Core architecture, feature registration, shared state ownership, plugin authoring, and migration. Each optional feature has an on-demand reference linked from `table-features`. |
| `@tanstack/<framework>-table`                              | `getting-started`, `table-state`, and migration where supported                | Framework setup, rendering, and reactive state. References cover reusable app hooks, advanced reactivity, and maintained Query/Virtual integrations.                             |
| `@tanstack/table-devtools` and framework devtools adapters | `devtools`                                                                     | Registering table instances and inspecting features, state, options, rows, and columns                                                                                           |
| `@tanstack/match-sorter-utils`                             | `fuzzy-ranking`                                                                | Fuzzy filtering, ranking metadata, and rank-aware sorting                                                                                                                        |

Each skill lives under `node_modules/<package>/skills/<skill-name>/SKILL.md` once the package is installed. Its `references/` directory contains guidance for specific tasks. For example, row selection lives in `@tanstack/table-core/skills/table-features/references/row-selection.md`.

The entry point tells the agent when to read each reference. A sorting change loads the sorting guidance; selection, resizing, and other unrelated feature references stay unloaded. Framework state skills load the shared state model and then explain their own reactive reads and updates.

Intent lists entry points and loads one requested `SKILL.md` at a time. The agent follows its prerequisite instructions and reads relevant references. A React project with core installed has eight Table entry points. Devtools and other installed libraries add their own entries.

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
npx @tanstack/intent@latest load @tanstack/table-core#table-features
```

For sorting, follow the loaded entry point's link to `references/sorting.md`. The load command resolves relative Markdown links to the installed package, including when your package manager uses nested dependency paths.

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

### Update older skill mappings

The progressive-disclosure layout replaces individual feature and composition skill IDs with references. If your agent configuration contains the old IDs, update them as follows:

| Old skill ID                                                                            | Replacement entry point and reference                                        |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `@tanstack/table-core#sorting`, `#row-selection`, and the other optional feature skills | `@tanstack/table-core#table-features`, then the matching feature reference   |
| `@tanstack/table-core#client-vs-server`                                                 | `@tanstack/table-core#table-features`, then `references/client-vs-server.md` |
| `@tanstack/table-core#typescript` or `#api-not-found`                                   | `@tanstack/table-core#core`, then the matching reference                     |
| `@tanstack/<framework>-table#create-table-hook`                                         | The adapter's `getting-started`, then `references/create-table-hook.md`      |
| `@tanstack/<framework>-table#with-tanstack-query` or `#with-tanstack-virtual`           | The adapter's `getting-started`, then the matching integration reference     |

If `package.json#intent.skills` allows individual old skill IDs, run `npx @tanstack/intent@latest install --review` to select their replacements and the prerequisites they need. Package-level permissions include new entry points automatically. Regenerate explicit mappings with `npx @tanstack/intent@latest install --map` after updating permissions. Direct file pointers to moved skills also need their new paths.

Core state guidance is available as `@tanstack/table-core#table-state`. Adapter state and migration skill IDs remain available. Migration skills retain a complete audit checklist and link to detailed mappings for the APIs your project uses.

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
