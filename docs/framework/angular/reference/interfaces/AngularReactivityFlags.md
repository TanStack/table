---
id: AngularReactivityFlags
title: AngularReactivityFlags
---

# Interface: AngularReactivityFlags

Defined in: [angularReactivityFeature.ts:55](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L55)

Fine-grained configuration for Angular reactivity.

Each key controls whether prototype methods/getters on the corresponding TanStack Table
objects are wrapped with signal-aware access.

- `true` enables wrapping using the default skip rules.
- `false` disables wrapping entirely for that object type.
- a function allows customizing the skip rules (see SkipPropertyFn).

## Example

```ts
const table = injectTable(() => {
 // ...table options,
 reactivity: {
   // fine-grained control over which table objects have reactive properties,
   // and which properties are wrapped
   header: true,
   column: true,
   row: true,
   cell: true,
 }
})
```

## Properties

### cell

```ts
cell: boolean | SkipPropertyFn;
```

Defined in: [angularReactivityFeature.ts:63](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L63)

Controls reactive wrapping for `Cell` instances.

***

### column

```ts
column: boolean | SkipPropertyFn;
```

Defined in: [angularReactivityFeature.ts:59](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L59)

Controls reactive wrapping for `Column` instances.

***

### header

```ts
header: boolean | SkipPropertyFn;
```

Defined in: [angularReactivityFeature.ts:57](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L57)

Controls reactive wrapping for `Header` instances.

***

### row

```ts
row: boolean | SkipPropertyFn;
```

Defined in: [angularReactivityFeature.ts:61](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L61)

Controls reactive wrapping for `Row` instances.
