---
id: setStateSlice
title: setStateSlice
---

# Function: setStateSlice()

```ts
function setStateSlice<K>(
   instance,
   key,
   updater,
   isEqual?): void;
```

Defined in: [utils.ts:217](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L217)

Routes a state slice update through the slice's `on<State>Change` handler,
optionally preserving the owner's current reference for structural no-ops.

Equality is evaluated inside the updater received by the state owner, never
against the table's potentially stale controlled snapshot. This keeps
same-tick updates composable in queued host containers such as React state,
evaluates the original updater only when the owner applies it, and lets atom
owners suppress notifications by returning their existing reference.

A user-provided change handler is still invoked for a no-op because only that
handler's state container can know its latest queued value. The guarded
updater returns that container's previous reference, preventing a state write
or render in state containers with identity bailout semantics.

## Type Parameters

### K

`K` *extends* `string` & `object` \| keyof TableState\_All

## Parameters

### instance

#### options

`object`

### key

`K`

### updater

[`Updater`](../type-aliases/Updater.md)\<`StateSliceForKey`\<`K`\>\>

### isEqual?

[`StateSliceEqualityFn`](../type-aliases/StateSliceEqualityFn.md)\<`StateSliceForKey`\<`K`\>\>

## Returns

`void`
