<script lang="ts">
  import FlexRender from '../../src/FlexRender.svelte'
  import { renderSnippet } from '../../src/render-component'

  interface Props {
    normalCell: any
    aggregatedCell: any
    placeholderCell: any
    header: any
    footer: any
    legacyContent: (context: { value: string }) => unknown
    componentCell: any
    reactiveCell: any
  }

  let {
    normalCell,
    aggregatedCell,
    placeholderCell,
    header,
    footer,
    legacyContent,
    componentCell,
    reactiveCell,
  }: Props = $props()

  let mode = $state<'aggregate' | 'normal' | 'placeholder'>('normal')
  const groupingCell = {
    column: {
      columnDef: {
        cell: (context: { value: string }) => `cell:${context.value}`,
        aggregatedCell: (context: { value: string }) =>
          `aggregate:${context.value}`,
      },
    },
    getContext: () => ({ value: 'Grouped' }),
    getIsAggregated: () => mode === 'aggregate',
    getIsPlaceholder: () => mode === 'placeholder',
  }
  const staticHeader = {
    column: {
      columnDef: {
        header: 'Static header',
      },
    },
    getContext: () => ({}),
  }
</script>

<output aria-label="Normal cell"><FlexRender cell={normalCell} /></output>
<output aria-label="Aggregated cell"
  ><FlexRender cell={aggregatedCell} /></output
>
<output aria-label="Placeholder cell"
  ><FlexRender cell={placeholderCell} /></output
>
<output aria-label="Header"><FlexRender {header} /></output>
<output aria-label="Footer"><FlexRender {footer} /></output>
<output aria-label="Static header"
  ><FlexRender header={staticHeader as any} /></output
>
<output aria-label="Legacy render"
  ><FlexRender
    content={legacyContent as any}
    context={{ value: 'Legacy' } as any}
  /></output
>
<output aria-label="Component render"
  ><FlexRender cell={componentCell} /></output
>
<output aria-label="Snippet render"
  ><FlexRender
    content={() => renderSnippet(snippetRenderer, { label: 'snippet:Ada' })}
    context={{} as any}
  /></output
>
<output aria-label="Reactive cell"><FlexRender cell={reactiveCell} /></output>
<output aria-label="Grouping cell"
  ><FlexRender cell={groupingCell as any} /></output
>

<button onclick={() => (mode = 'aggregate')}>Show aggregate cell</button>
<button onclick={() => (mode = 'placeholder')}>Show placeholder cell</button>
<button onclick={() => (mode = 'normal')}>Show normal cell</button>

{#snippet snippetRenderer(props: { label: string })}
  <em>{props.label}</em>
{/snippet}
