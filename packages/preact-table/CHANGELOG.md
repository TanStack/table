# @tanstack/preact-table

## 9.2.6

### Patch Changes

- [#6611](https://github.com/TanStack/table/pull/6611) [`b9b007f`](https://github.com/TanStack/table/commit/b9b007fa038328a795d1f3b5e8f80cea8a55a3b4) - Refactor bundled Intent skills into smaller entry points with references loaded for the current task. Keep core feature architecture and shared state directly discoverable, and move individual features, adapter compositions, and detailed migration guidance into references.

  Consumers with individual skill permissions or explicit agent mappings must replace retired feature/composition IDs with their owning entry points and refresh Intent mappings. See the Agent Skills guide for the replacement paths.

- Updated dependencies [[`b9b007f`](https://github.com/TanStack/table/commit/b9b007fa038328a795d1f3b5e8f80cea8a55a3b4)]:
  - @tanstack/table-core@9.2.6

## 9.2.5

### Patch Changes

- [#6609](https://github.com/TanStack/table/pull/6609) [`e9158e7`](https://github.com/TanStack/table/commit/e9158e7be837525ab99abd78550266d7cdcc58b2) - Update TanStack Store dependencies to the latest compatible patch releases.
- Updated dependencies [[`e9158e7`](https://github.com/TanStack/table/commit/e9158e7be837525ab99abd78550266d7cdcc58b2)]:
  - @tanstack/table-core@9.2.5

## 9.2.4

### Patch Changes

- Updated dependencies [[`f72e516`](https://github.com/TanStack/table/commit/f72e5164bcfe749403ec173035c226f8719647fc)]:
  - @tanstack/table-core@9.2.4

## 9.2.3

### Patch Changes

- Updated dependencies [[`468f267`](https://github.com/TanStack/table/commit/468f26768d6f7e31010e14c3363b54696cb6a1eb), [`3b94648`](https://github.com/TanStack/table/commit/3b946481795b53a53d6d823cea0ab3e368befec7)]:
  - @tanstack/table-core@9.2.3

## 9.1.2

### Patch Changes

- Updated dependencies [[`ff43666`](https://github.com/TanStack/table/commit/ff436663f808e22091e8a4d2ee7ca81b37ea99c2)]:
  - @tanstack/table-core@9.1.2

## 9.1.1

### Patch Changes

- Updated dependencies [[`269e0d8`](https://github.com/TanStack/table/commit/269e0d81c8b5c128de01cbab4ddb40240a4b8b38)]:
  - @tanstack/table-core@9.1.1

## 9.1.0

### Patch Changes

- Updated dependencies [[`09598d2`](https://github.com/TanStack/table/commit/09598d2e413fe63396d183a8a4fc145c31c6d2ea)]:
  - @tanstack/table-core@9.1.0

## 9.0.1

### Patch Changes

- Updated dependencies []:
  - @tanstack/table-core@9.0.1

## 9.0.0

### Major Changes

- [#6512](https://github.com/TanStack/table/pull/6512) [`2327f80`](https://github.com/TanStack/table/commit/2327f80906bebbfef5766cebf556d195952f459e) - TanStack Table v9 stable release. See the "Migrating to V9" guide for your framework (e.g. [React](https://tanstack.com/table/latest/docs/framework/react/guide/migrating)) for upgrade instructions.

### Patch Changes

- Updated dependencies [[`2327f80`](https://github.com/TanStack/table/commit/2327f80906bebbfef5766cebf556d195952f459e)]:
  - @tanstack/table-core@9.0.0
