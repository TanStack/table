<script
  lang="ts"
  generics="TData, TValue, TContext extends HeaderContext<TData, TValue> | CellContext<TData, TValue>"
>
  import type {
    CellContext,
    ColumnDefTemplate,
    HeaderContext,
  } from '@tanstack/table-core'
  import { RenderComponentConfig } from './render-component'

  type Props = {
    /** The cell or header field of the current cell's column definition. */
    content?: TContext extends HeaderContext<TData, TValue>
      ? ColumnDefTemplate<HeaderContext<TData, TValue>>
      : TContext extends CellContext<TData, TValue>
        ? ColumnDefTemplate<CellContext<TData, TValue>>
        : never
    /** The result of the `getContext()` function of the header or cell */
    context: TContext
  }

  let { content, context }: Props = $props()
</script>

{#if typeof content === 'string'}
  {content}
{:else if content instanceof Function}
  {@const result = content(context as any)}
  {#if result instanceof RenderComponentConfig}
    <svelte:component this={result.component} {...result.props} />
  {:else}
    {result}
  {/if}
{/if}
