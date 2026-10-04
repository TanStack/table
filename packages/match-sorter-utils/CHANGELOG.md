# @tanstack/match-sorter-utils

## 9.2.6

### Patch Changes

- [#6611](https://github.com/TanStack/table/pull/6611) [`b9b007f`](https://github.com/TanStack/table/commit/b9b007fa038328a795d1f3b5e8f80cea8a55a3b4) - Refactor bundled Intent skills into smaller entry points with references loaded for the current task. Keep core feature architecture and shared state directly discoverable, and move individual features, adapter compositions, and detailed migration guidance into references.

  Consumers with individual skill permissions or explicit agent mappings must replace retired feature/composition IDs with their owning entry points and refresh Intent mappings. See the Agent Skills guide for the replacement paths.

## 9.1.2

## 9.1.1

## 9.1.0

## 9.0.1

## 9.0.0

### Major Changes

- [#6512](https://github.com/TanStack/table/pull/6512) [`2327f80`](https://github.com/TanStack/table/commit/2327f80906bebbfef5766cebf556d195952f459e) - TanStack Table v9 stable release. See the "Migrating to V9" guide for your framework (e.g. [React](https://tanstack.com/table/latest/docs/framework/react/guide/migrating)) for upgrade instructions.
