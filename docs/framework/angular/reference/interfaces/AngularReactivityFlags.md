---
id: AngularReactivityFlags
title: AngularReactivityFlags
---

# Interface: AngularReactivityFlags

Defined in: [angularReactivityFeature.ts:40](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L40)

Fine-grained configuration for Angular reactivity.

Each key controls whether prototype methods/getters on the corresponding TanStack Table
objects are wrapped with signal-aware access.

- `true` enables wrapping using the default skip rules.
- `false` disables wrapping entirely for that object type.
- a function allows customizing the skip rules (see SkipPropertyFn).

## Properties

### cell

```ts
cell: boolean | SkipPropertyFn;
```

Defined in: [angularReactivityFeature.ts:48](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L48)

Controls reactive wrapping for `Cell` instances.

***

### column

```ts
column: boolean | SkipPropertyFn;
```

Defined in: [angularReactivityFeature.ts:44](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L44)

Controls reactive wrapping for `Column` instances.

***

### header

```ts
header: boolean | SkipPropertyFn;
```

Defined in: [angularReactivityFeature.ts:42](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L42)

Controls reactive wrapping for `Header` instances.

***

### row

```ts
row: boolean | SkipPropertyFn;
```

Defined in: [angularReactivityFeature.ts:46](https://github.com/TanStack/table/blob/main/packages/angular-table/src/angularReactivityFeature.ts#L46)

Controls reactive wrapping for `Row` instances.
