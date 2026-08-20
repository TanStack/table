---
id: SubscribeComponent
title: SubscribeComponent
---

# Interface: SubscribeComponent()

Defined in: [types.ts:181](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L181)

The call signature of the standalone `Subscribe` component.

Declared as an overloaded callable type rather than `function` overloads
because the implementation is authored in `.tsrx`: a `@{ … }` body cannot
carry preceding overload signatures (TS2384). Overload *resolution* is what
matters at the JSX call site, and a callable type provides exactly that.

The **source** overloads come first so `TSourceValue` is inferred from
`source`; the identity overload (no `selector`) is separate so children
receive `TSourceValue` rather than `unknown`.

## Call Signature

```ts
SubscribeComponent<TSourceValue>(props): unknown;
```

Defined in: [types.ts:182](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L182)

The call signature of the standalone `Subscribe` component.

Declared as an overloaded callable type rather than `function` overloads
because the implementation is authored in `.tsrx`: a `@{ … }` body cannot
carry preceding overload signatures (TS2384). Overload *resolution* is what
matters at the JSX call site, and a callable type provides exactly that.

The **source** overloads come first so `TSourceValue` is inferred from
`source`; the identity overload (no `selector`) is separate so children
receive `TSourceValue` rather than `unknown`.

### Type Parameters

#### TSourceValue

`TSourceValue`

### Parameters

#### props

[`SubscribePropsWithSourceIdentity`](SubscribePropsWithSourceIdentity.md)\<`TSourceValue`\>

### Returns

`unknown`

## Call Signature

```ts
SubscribeComponent<TSourceValue, TSelected>(props): unknown;
```

Defined in: [types.ts:185](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L185)

The call signature of the standalone `Subscribe` component.

Declared as an overloaded callable type rather than `function` overloads
because the implementation is authored in `.tsrx`: a `@{ … }` body cannot
carry preceding overload signatures (TS2384). Overload *resolution* is what
matters at the JSX call site, and a callable type provides exactly that.

The **source** overloads come first so `TSourceValue` is inferred from
`source`; the identity overload (no `selector`) is separate so children
receive `TSourceValue` rather than `unknown`.

### Type Parameters

#### TSourceValue

`TSourceValue`

#### TSelected

`TSelected`

### Parameters

#### props

[`SubscribePropsWithSourceWithSelector`](SubscribePropsWithSourceWithSelector.md)\<`TSourceValue`, `TSelected`\>

### Returns

`unknown`

## Call Signature

```ts
SubscribeComponent<TFeatures, TSelected>(props): unknown;
```

Defined in: [types.ts:188](https://github.com/TanStack/table/blob/main/packages/octane-table/src/types.ts#L188)

The call signature of the standalone `Subscribe` component.

Declared as an overloaded callable type rather than `function` overloads
because the implementation is authored in `.tsrx`: a `@{ … }` body cannot
carry preceding overload signatures (TS2384). Overload *resolution* is what
matters at the JSX call site, and a callable type provides exactly that.

The **source** overloads come first so `TSourceValue` is inferred from
`source`; the identity overload (no `selector`) is separate so children
receive `TSourceValue` rather than `unknown`.

### Type Parameters

#### TFeatures

`TFeatures` *extends* `TableFeatures`

#### TSelected

`TSelected`

### Parameters

#### props

[`SubscribePropsWithStore`](SubscribePropsWithStore.md)\<`TFeatures`, `TSelected`\>

### Returns

`unknown`
