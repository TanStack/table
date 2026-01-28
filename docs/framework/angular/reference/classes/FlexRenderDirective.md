---
id: FlexRenderDirective
title: FlexRenderDirective
---

# Class: FlexRenderDirective\<TFeatures, TRowData, TValue, TProps\>

Defined in: [flexRender.ts:84](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flexRender.ts#L84)

Use this utility directive to render headers, cells, or footers with custom markup.

Note: If you are rendering cell, header, or footer without custom context or other props,
you can use the [FlexRenderCell](FlexRenderCell.md) directive as shorthand instead .

## Example

```ts
import {FlexRender} from '@tanstack/angular-table';

@Component({
  imports: [FlexRender],
  template: `
     <td
       *flexRender="
         cell.column.columnDef.cell;
         props: cell.getContext();
         let cell"
     >
       {{cell}}
     </td>

     <th
       *flexRender="
         header.column.columnDef.header;
         props: header.getContext();
         let header"
       >
       {{header}}
     </td>

     <td
       *flexRender="
         footer.column.columnDef.footer;
         props: footer.getContext();
         let footer"
     >
       {{footer}}
     </td>
  `,
})
class App {
}
```

Can be imported through FlexRenderDirective or [FlexRender](../variables/FlexRender.md) import,
which the latter is preferred.

## Type Parameters

### TFeatures

`TFeatures` *extends* `TableFeatures`

### TRowData

`TRowData` *extends* `RowData`

### TValue

`TValue` *extends* `CellData`

### TProps

`TProps` *extends* 
  \| `NonNullable`\<`unknown`\>
  \| `CellContext`\<`TFeatures`, `TRowData`, `TValue`\>
  \| `HeaderContext`\<`TFeatures`, `TRowData`, `TValue`\>

## Constructors

### Constructor

```ts
new FlexRenderDirective<TFeatures, TRowData, TValue, TProps>(): FlexRenderDirective<TFeatures, TRowData, TValue, TProps>;
```

Defined in: [flexRender.ts:109](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flexRender.ts#L109)

#### Returns

`FlexRenderDirective`\<`TFeatures`, `TRowData`, `TValue`, `TProps`\>

## Properties

### content

```ts
readonly content: InputSignal<FlexRenderInputContent<TProps>>;
```

Defined in: [flexRender.ts:93](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flexRender.ts#L93)

***

### injector

```ts
readonly injector: InputSignal<Injector>;
```

Defined in: [flexRender.ts:102](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flexRender.ts#L102)

***

### props

```ts
readonly props: InputSignal<TProps>;
```

Defined in: [flexRender.ts:98](https://github.com/TanStack/table/blob/main/packages/angular-table/src/flexRender.ts#L98)
