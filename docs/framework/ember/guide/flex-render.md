---
title: FlexRender (Ember) Guide
---

Ember uses dedicated Glimmer components to render column definitions with typed cell and header contexts. Renderer results can be primitive content or component configurations.

## `FlexRender` vs `flexRender`

Ember does not export one component named `FlexRender`. Instead it provides three table-aware components:

- `FlexRenderCell`
- `FlexRenderHeader`
- `FlexRenderFooter`

Use them in `.gts` templates:

```ts
import {
  FlexRenderCell,
  FlexRenderFooter,
  FlexRenderHeader,
} from '@tanstack/ember-table'
```

```hbs
<FlexRenderHeader @header={{header}} />
<FlexRenderCell @cell={{cell}} />
<FlexRenderFooter @footer={{header}} />
```

`FlexRenderCell` selects `aggregatedCell` for aggregated rows, falls back to `cell`, and renders nothing for grouping placeholders.

The lowercase `flexRender(renderable, context)` export is the low-level function used underneath those components. It calls function renderers and passes primitive results through, but it cannot mount a Glimmer component by itself and does not select the correct grouped-cell renderer.

## Rendering Glimmer Components

Return `flexRenderComponent()` from a column definition when the renderer should mount a component:

```gts
import { flexRenderComponent } from '@tanstack/ember-table'
import StatusCell from './StatusCell.gts'

const columns = columnHelper.columns([
  columnHelper.accessor('status', {
    cell: () => flexRenderComponent(StatusCell, { emphasis: 'strong' }),
  }),
])
```

The component receives `@ctx` with the cell or header context and `@options` with the optional configuration passed to `flexRenderComponent`.

Placeholder headers and footers remain the template's layout decision. Wrap the header or footer component in `{{#unless header.isPlaceholder}}` in ordinary layouts, but render it when a spanning-header layout intentionally needs its content. When calling table methods from a template, wrap them in a locally bound helper as shown in the Ember examples.
