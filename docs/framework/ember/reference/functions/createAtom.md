---
id: createAtom
title: createAtom
---

# Function: createAtom()

```ts
function createAtom<T>(initialValue, options?): Atom<T>;
```

Defined in: packages/ember-table/declarations/signal.d.ts:36

Creates an Ember-native writable atom, satisfying the `@tanstack/store`
`Atom` contract so it can be passed to `options.atoms`. Because it is backed
by a `@tracked` Signal, reading `atom.get()` directly in a template or
getter is reactive — unlike a foreign `@tanstack/store` atom, whose reads
create no Glimmer tag dependency.

Takes a plain initial value only; there is no derived/function overload.

## Type Parameters

### T

`T`

## Parameters

### initialValue

`T`

### options?

`AtomOptions`\<`T`\>

## Returns

`Atom`\<`T`\>
