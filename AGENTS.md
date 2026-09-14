# Agent Instructions

Before analyzing or changing this repository, read and follow
[`CONTRIBUTING.md`](./CONTRIBUTING.md). Its contribution, development, testing,
pull request, and changeset requirements apply to AI-assisted work as well as
human-authored work.

Keep every change focused on one topic. Understand and verify all generated
code, run the required checks, and provide a concise pull request description
that follows the repository template.

## Packages that cannot be upgraded yet

Leave these pins alone during routine dependency bumps. They currently break
Ember, the Svelte kitchen-sink types, or are intentionally deferred.

- **TypeScript** — keep `6.0.3`. Do not bump it as part of a general upgrade.
- **Babel 7** — Ember is not compatible with Babel 8. In `packages/ember-table`
  and every `examples/ember/*` app, keep `@babel/core`,
  `@babel/plugin-transform-runtime`, `@babel/plugin-transform-typescript`, and
  `@babel/runtime` at `7.29.7`. `@rollup/plugin-babel` `7.1.0` is the Rollup
  plugin version, not Babel itself.
- **`@dnd-kit/abstract` and `@dnd-kit/helpers`** — keep `^0.2.3` in
  `examples/svelte/kitchen-sink-shadcn`. `@dnd-kit-svelte/svelte@0.1.6` still
  depends on the 0.2.x line. Bumping to 0.5.x installs a second copy, and
  TypeScript treats those private-field types as incompatible.
- **Vitest and `@vitest/coverage-v8`** — keep the 4.x line (currently
  `^4.1.11` and `4.1.11`). `@analogjs/vitest-angular@2.7.2` and Angular build
  tooling do not support Vitest 5, which also removes the `vitest` `bench` export
  used by the repository benchmarks. Upgrade these together in a separate migration.
- **Octane** — keep `0.1.36`. The 0.2.x line fails the adapter conformance
  test for synchronous owner and isolated controlled updates during a discrete event.
- **Pacer devtools** — keep `@tanstack/react-pacer-devtools` at `0.8.0` and
  `@tanstack/solid-pacer-devtools` at `0.7.0`. The 0.14.x packages do not export
  `pacerDevtoolsPlugin`, which the Form and Router examples use.
- **`@tanstack/preact-form`** — keep `1.30.5` in the Preact Form example.
  The 1.33.x line removes `createFormHookContexts` and `withForm`, requiring
  a separate example migration.
