---
id: PrototypeAPI
title: PrototypeAPI
---

# Interface: PrototypeAPI\<TDeps, TDepArgs\>

Defined in: [packages/table-core/src/utils.ts:322](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L322)

## Type Parameters

### TDeps

`TDeps` *extends* `ReadonlyArray`\<`any`\>

### TDepArgs

`TDepArgs`

## Properties

### fn()

```ts
fn: (self, ...args) => any;
```

Defined in: [packages/table-core/src/utils.ts:323](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L323)

#### Parameters

##### self

`any`

##### args

...`any`

#### Returns

`any`

***

### memoDeps()?

```ts
optional memoDeps: (self, depArgs?) => any[] | undefined;
```

Defined in: [packages/table-core/src/utils.ts:324](https://github.com/TanStack/table/blob/main/packages/table-core/src/utils.ts#L324)

#### Parameters

##### self

`any`

##### depArgs?

`any`

#### Returns

`any`[] \| `undefined`
