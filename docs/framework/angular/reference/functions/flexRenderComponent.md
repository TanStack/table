---
id: flexRenderComponent
title: flexRenderComponent
---

# Function: flexRenderComponent()

```ts
function flexRenderComponent<TComponent>(component, options?): FlexRenderComponent<TComponent>;
```

Defined in: [flex-render/flexRenderComponent.ts:150](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flex-render/flexRenderComponent.ts#L150)

Helper function to create a [FlexRenderComponent](../interfaces/FlexRenderComponent.md) instance, with better type-safety.

## Type Parameters

### TComponent

`TComponent` = `any`

## Parameters

### component

`Type`\<`TComponent`\>

### options?

`FlexRenderOptions`\<`Inputs`\<`TComponent`\>, `Outputs`\<`TComponent`\>\>

## Returns

[`FlexRenderComponent`](../interfaces/FlexRenderComponent.md)\<`TComponent`\>

## Example

```ts
import {flexRenderComponent} from '@tanstack/angular-table'
import {inputBinding, outputBinding} from '@angular/core';

const columns = [
  {
    cell: ({ row }) => {
       return flexRenderComponent(MyComponent, {
         inputs: { value: mySignalValue() },
         outputs: { valueChange: (val) => {} }
         // or using angular native createComponent#binding api
         bindings: [
           inputBinding('value', mySignalValue),
           outputBinding('valueChange', value => {
             console.log("my value changed to", value)
           })
         ]
       })
    },
  },
]
```
