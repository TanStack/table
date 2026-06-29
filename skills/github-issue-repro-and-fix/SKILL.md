---
name: github-issue-repro-and-fix
description: >
  Investigate a GitHub issue, determine whether it is a real bug, reproduce it
  with the smallest practical test or example, and apply a focused fix only
  after the failing behavior is confirmed. Use this when asked to look at,
  verify, triage, reproduce, or fix a GitHub issue in this repository.
---

# GitHub Issue Repro And Fix

Use this skill when the user provides a GitHub issue URL, issue number, copied
issue body, or asks whether reported behavior is truly a bug before fixing it.

## Workflow

1. Gather the issue context.
   - If given a URL or issue number, prefer `gh issue view <number> --json title,body,comments,labels,author,state,url`.
   - If `gh` is unavailable or unauthenticated, use the GitHub web page or ask the user only when the issue content cannot be accessed.
   - Read the issue comments, not just the opening report. Comments often contain maintainer guidance, reproductions, workarounds, duplicate links, and notes that the issue was fixed elsewhere.
   - Capture the exact reported behavior, expected behavior, environment, reproduction steps, linked repro repository or sandbox, maintainer comments, and any user-confirmed workarounds.

2. Look for related upstream context.
   - Search repository issues, pull requests, and discussions for the issue number, mentioned APIs, error text, and reproduction keywords.
   - Prefer GitHub search or `gh search issues`/`gh search prs` when available.
   - Note related PRs, discussions, duplicate issues, regression reports, and changelog entries before deciding whether to patch.
   - If a related PR already fixed the issue, verify whether the local workspace contains that change before editing.

3. Map the report to the codebase.
   - Identify the package, adapter, example, docs page, or shared core module involved.
   - Search with `rg` for mentioned APIs, options, error text, test names, and related implementation files.
   - Read the nearest tests before editing so the existing behavior contract is clear.

4. Verify whether the reported behavior is real.
   - Reproduce the bug locally before changing implementation when feasible.
   - Prefer the smallest focused failing test over a full example app.
   - If a UI or framework issue cannot be captured by a unit test, use the smallest existing example or fixture that exercises the behavior.
   - Record the failing command and failure mode.
   - If the issue cannot be reproduced, inspect whether it is already fixed, invalid usage, version-specific, or missing information.

5. Decide whether a fix is the correct library direction.
   - Separate "the reported behavior happens" from "the library should change."
   - Check whether the request conflicts with documented concepts, API semantics, type contracts, backwards compatibility, or maintainer comments.
   - Consider whether the better outcome is a code fix, documentation clarification, warning/error improvement, example update, or closing as intended behavior.
   - When the issue raises a product/API semantics tradeoff, ask the user for a decision before implementing. Present concise pros and cons for each viable path.

6. Apply a focused fix only when the direction is confirmed.
   - Change the narrowest implementation surface that explains the confirmed failure.
   - Preserve public APIs unless the issue explicitly concerns an intended API change.
   - Follow existing local patterns for feature registration, state handling, adapter behavior, and test style.
   - Avoid broad refactors, unrelated formatting churn, or opportunistic cleanup.

7. Prove the fix.
   - Run the previously failing test or reproduction first.
   - Run the nearest relevant package test, typecheck, or lint command if available and proportionate.
   - If a regression test was possible, commit the failing scenario as part of the change.
   - If no automated test was practical, document the manual verification steps and remaining risk.

8. Report the outcome.
   - State whether the GitHub report is a confirmed bug, duplicate/already fixed, unsupported usage, documentation gap, or inconclusive.
   - If the behavior is real but not a bug, say that explicitly and explain the library contract that makes it intended behavior.
   - Summarize the root cause and fix in concrete terms.
   - Include the exact verification commands and results.
   - Call out any test gaps or conditions that could not be reproduced.

## Decision Rules

- Do not patch first and infer the bug later. Establish a failing observation before editing whenever the repo makes that practical.
- Do not assume a confirmed reproduction means the requested change is desirable. Validate the request against the library's design model before fixing.
- Treat linked reproductions as evidence, not as proof. Reduce them to a local test or minimal local reproduction before changing shared code.
- If the issue is caused by misuse but the API makes the misuse easy, consider a docs update, runtime warning, or clearer type error only if it fits existing project conventions.
- If the report depends on old package versions, compare against the current workspace behavior and say clearly which version was tested.
- If the issue spans multiple framework adapters, fix shared core behavior first when the root cause is framework-agnostic; otherwise keep adapter-specific changes isolated.
- Do not run `git` commands, create commits, push branches, or open pull requests. Leave all git and PR operations to the user.

## Useful Commands

```sh
gh issue view <number> --json title,body,comments,labels,author,state,url
gh search issues "<query>" --repo TanStack/table
gh search prs "<query>" --repo TanStack/table
rg "<api-or-error-text>"
pnpm test
pnpm typecheck
pnpm lint
```

Prefer package-specific commands from `package.json` when they exist. Use the
smallest command that validates the touched behavior before running broader
checks.
