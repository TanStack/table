<script
  lang="ts"
  generics="TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData"
>
  import { isFunction } from '@tanstack/table-core'
  import {
    RenderComponentConfig,
    RenderSnippetConfig,
  } from './render-component'
  import type {
    Cell,
    CellContext,
    CellData,
    ColumnDefTemplate,
    Header,
    HeaderContext,
    RowData,
    TableFeatures,
  } from '@tanstack/table-core'

  type Props =
    | {
        /** The cell or header field of the current cell's column definition. */
        content?: ColumnDefTemplate<
          | HeaderContext<TFeatures, TData, TValue>
          | CellContext<TFeatures, TData, TValue>
        >
        /** The result of the `getContext()` function of the header or cell */
        context:
          | HeaderContext<TFeatures, TData, TValue>
          | CellContext<TFeatures, TData, TValue>
        cell?: never
        header?: never
        footer?: never
      }
    | {
        cell: Cell<TFeatures, TData, TValue>
        content?: never
        context?: never
        header?: never
        footer?: never
      }
    | {
        header: Header<TFeatures, TData, TValue>
        content?: never
        context?: never
        cell?: never
        footer?: never
      }
    | {
        footer: Header<TFeatures, TData, TValue>
        content?: never
        context?: never
        cell?: never
        header?: never
      }

  let props: Props = $props()

  // Resolve content and context from either the new cell/header/footer props
  // or the legacy content/context props.
  const resolved = $derived.by(() => {
    if ('cell' in props && props.cell) {
      return {
        content: props.cell.column.columnDef.cell,
        context: props.cell.getContext(),
      }
    }
    if ('header' in props && props.header) {
      return {
        content: props.header.column.columnDef.header,
        context: props.header.getContext(),
      }
    }
    if ('footer' in props && props.footer) {
      return {
        content: props.footer.column.columnDef.footer,
        context: props.footer.getContext(),
      }
    }
    return {
      content: props.content,
      context: props.context,
    }
  })

  // Compute the render result reactively
  const result = $derived(
    isFunction(resolved.content)
      ? resolved.content(resolved.context as any)
      : undefined,
  )
</script>

{#if typeof resolved.content === 'string'}
  {resolved.content}
{:else if result instanceof RenderComponentConfig}
  <result.component {...result.props} />
{:else if result instanceof RenderSnippetConfig}
  {@render result.snippet(result.params)}
{:else if result !== undefined}
  {result}
{/if}
