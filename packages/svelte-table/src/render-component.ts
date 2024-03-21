import type { SvelteComponent, ComponentType, ComponentProps } from 'svelte'

/**
 * A helper class to make it easy to identify Svelte components in `columnDef.cell` and `columnDef.header` properties.
 * @example
 * ```svelte
 * {#if cell.column.columnDef.cell(cell.getContext()) instanceof RenderComponentConfig}
 *   <svelte:component this={columnDef.cell.component} {...columnDef.cell.props} />
 * {/if}
 * ```
 * */
export class RenderComponentConfig<TComponent extends SvelteComponent> {
  constructor(
    public component: ComponentType<TComponent>,
    public props: ComponentProps<TComponent> | Record<string, never> = {}
  ) {}
}

/**
 * A helper function to help create cells from Svelte components through ColumnDef's `cell` and `header` properties.
 * @param component A Svelte component
 * @param props The props to pass to `component`
 * @returns A `RenderComponentConfig` object that helps svelte-table know how to render the header/cell component.
 * @example
 * ```ts
 * // +page.svelte
 * const defaultColumns = [
 *   columnHelper.accessor('name', {
 *     header: header => renderComponent(SortHeader, { label: 'Name', header }),
 *   }),
 *   columnHelper.accessor('state', {
 *     header: header => renderComponent(SortHeader, { label: 'State', header }),
 *   }),
 * ]
 * ```
 * @see {@link https://tanstack.com/table/latest/docs/guide/column-defs}
 */
export const renderComponent = <TComponent extends SvelteComponent>(
  component: ComponentType<TComponent>,
  props: ComponentProps<TComponent>
) => new RenderComponentConfig(component, props)
