---
id: skipFirstRun
title: skipFirstRun
---

# Function: skipFirstRun()

```ts
function skipFirstRun(fn): () => void;
```

Defined in: [utils.ts:381](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L381)

Wraps a callback so that its first invocation is skipped.

Row-model `onAfterUpdate` hooks schedule auto-resets when their inputs
change. The initial computation of a row model is not a change, so state
resets must not fire for it — otherwise merely reading a row model on mount
would wipe initial or controlled state.

## Parameters

### fn

() => `void`

## Returns

```ts
(): void;
```

### Returns

`void`
