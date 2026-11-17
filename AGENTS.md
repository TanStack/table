# Agent Instructions

Before analyzing or changing this repository, read and follow
[`CONTRIBUTING.md`](./CONTRIBUTING.md). Its contribution, development, testing,
pull request, and changeset requirements apply to AI-assisted work as well as
human-authored work.

Keep every change focused on one topic. Understand and verify all generated
code, run the required checks, and provide a concise pull request description
that follows the repository template.

## Packages that cannot be upgraded yet

Leave these pins alone during routine dependency bumps. They are either
intentionally deferred or need a manual version choice that `ncu` gets wrong.

- **TypeScript** — keep `6.0.3`. Do not bump it as part of a general upgrade.
- **Highest semver is not the real latest.** `ncu` can pick a version that
  outranks the package's `latest` dist-tag. Check `npm view <name> dist-tags`
  and take the newest release on the `latest` line that meets
  `minimumReleaseAge`:
  - `octane`: `1.0.3` is an unrelated 2015 release. Use the 0.x line. Octane
    peers on an exact `@tsrx/oxc` version, so set `@tsrx/oxc` to that exact
    version even when `ncu` offers a newer one.
  - `@tanstack/react-pacer-devtools` and `@tanstack/solid-pacer-devtools`:
    `0.14.0` is an old release that lacks the `pacerDevtoolsPlugin` export the
    Form and Router examples use.
  - `@tanstack/preact-form`: `1.33.x` sits above `latest` and removes
    `createFormHookContexts` and `withForm`, which the Preact Form example uses.
- **Babel 8 peer warnings** — `@rollup/plugin-babel` and some transitive Babel 7
  plugins still declare `@babel/core@^7` peers. The Ember toolchain
  (`@nullvoxpopuli/ember-vite`) supports Babel 8, and Ember builds and tests
  pass on it, so these `pnpm peers check` warnings are expected. Do not pin
  Babel back to 7 because of them.
- **`@tanstack/intent`** — keep `0.4.0`. The 0.5 checker compiles TS and JS
  fences without framework TypeScript configuration or surrounding context. It
  rejects valid Preact and Lit examples, class-member excerpts, and deliberately
  wrong examples. 0.5.6 still reports 64 such errors. 0.5 can skip a fence
  with a `no-check` fence property or expect one with `expect-error`, but the
  repository's snippet checker only accepts bare `ts`/`tsx` fences after a
  `skill-snippet:check` marker. Keep the repository's content and
  annotated-snippet checks enabled while this migration is deferred.
