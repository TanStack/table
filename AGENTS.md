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
- **Octane** — `ncu` reports `octane` `1.0.3`, an unrelated 2015 release that
  outranks the real 0.x line by semver. Do not take it. Check
  `npm view octane dist-tags` and use the newest 0.x release that meets
  `minimumReleaseAge` (currently `0.17.0`). Octane peers on an exact
  `@tsrx/oxc` version (`0.23.0` for 0.17.x), so keep `@tsrx/oxc` on that exact
  version even when `ncu` offers a newer one.
- **`@tanstack/intent`** — keep `0.4.0`. The 0.5 checker compiles TS and JS
  fences without framework TypeScript configuration or surrounding context. It
  rejects valid Preact and Lit examples, class-member excerpts, and deliberately
  wrong examples. 0.5.6 still reports 64 such errors. 0.5 can skip a fence
  with a `no-check` fence property or expect one with `expect-error`, but the
  repository's snippet checker only accepts bare `ts`/`tsx` fences after a
  `skill-snippet:check` marker. Keep the repository's content and
  annotated-snippet checks enabled while this migration is deferred.
