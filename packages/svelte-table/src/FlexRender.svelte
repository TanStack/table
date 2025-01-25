<script
  lang="ts"
  generics="TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData, TContext extends HeaderContext<TFeatures, TData, TValue> | CellContext<TFeatures, TData, TValue>"
>
  import type {
    CellContext,
    CellData,
    ColumnDefTemplate,
    HeaderContext,
    RowData,
    TableFeatures,
  } from '@tanstack/table-core'
  import { isFunction } from '@tanstack/table-core'
  import {
    RenderComponentConfig,
    RenderSnippetConfig,
  } from './render-component'

  type Props = {
    /** The cell or header field of the current cell's column definition. */
    content?: TContext extends HeaderContext<TFeatures, TData, TValue>
      ? ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>
      : TContext extends CellContext<TFeatures, TData, TValue>
        ? ColumnDefTemplate<CellContext<TFeatures, TData, TValue>>
        : never
    /** The result of the `getContext()` function of the header or cell */
    context: TContext
  }

  const { content, context }: Props = $props()
</script>

{#if typeof content === 'string'}
  {content}
{:else if isFunction(content)}
  {@const result = content(context as any)}
  {#if result instanceof RenderComponentConfig}
    {@render result.component(result.props)}
    {@const { component: Component, props } = result}
    <Component {...props} />
  {:else if result instanceof RenderSnippetConfig}
    {@const { snippet, params } = result}
    {@render snippet(params)}
  {:else}
    {result}
  {/if}
{/if}
