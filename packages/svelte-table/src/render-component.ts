import type { Component, ComponentProps, Snippet } from 'svelte'

/**
 * A helper class to make it easy to identify Svelte components in
 * `columnDef.cell` and `columnDef.header` properties.
 *
 * > NOTE: This class should only be used internally by the adapter. If you're
 * reading this and you don't know what this is for, you probably don't need it.
 *
 * @example
 * ```svelte
 * {@const result = content(context as any)}
 * {#if result instanceof RenderComponentConfig}
 *   {@const { component: Component, props } = result}
 *   <Component {...props} />
 * {/if}
 * ```
 * */
export class RenderComponentConfig<TComponent extends Component> {
  constructor(
    public component: TComponent,
    public props?: ComponentProps<TComponent> | Record<string, never>,
  ) {}
}

/**
 * A helper class to make it easy to identify Svelte Snippets in `columnDef.cell` and `columnDef.header` properties.
 *
 * > NOTE: This class should only be used internally by the adapter. If you're
 * reading this and you don't know what this is for, you probably don't need it.
 *
 * @example
 * ```svelte
 * {@const result = content(context as any)}
 * {#if result instanceof RenderSnippetConfig}
 *   {@const { snippet, params } = result}
 *   {@render snippet(params)}
 * {/if}
 * ```
 * */
export class RenderSnippetConfig<TProps> {
  constructor(
    public snippet: Snippet<[TProps]>,
    public params?: TProps,
  ) {}
}

/**
 * Wraps a Svelte component so it can be returned from a column definition
 * renderer such as `cell`, `header`, or `footer`.
 *
 * This is only to be used with Svelte Components - use `renderSnippet` for Svelte Snippets.
 *
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
export const renderComponent = <
  TComponent extends Component<any>,
  TProps extends ComponentProps<TComponent>,
>(
  component: TComponent,
  props?: TProps,
) => new RenderComponentConfig(component, props)

/**
 * Wraps a Svelte snippet so it can be returned from a column definition
 * renderer such as `cell`, `header`, or `footer`.
 *
 * *The snippet must only take one parameter.*
 *
 * This is only to be used with Snippets - use `renderComponent` for Svelte Components.
 *
 * @param snippet The snippet to render.
 * @param params The single parameter object passed to the snippet.
 * @returns A `RenderSnippetConfig` consumed by the Svelte `FlexRender` component.
 * @example
 * ```ts
 * // +page.svelte
 * const defaultColumns = [
 *   columnHelper.accessor('name', {
 *     cell: cell => renderSnippet(nameSnippet, { name: cell.row.name }),
 *   }),
 *   columnHelper.accessor('state', {
 *     cell: cell => renderSnippet(stateSnippet, { state: cell.row.state }),
 *   }),
 * ]
 * ```
 * @see {@link https://tanstack.com/table/latest/docs/guide/column-defs}
 */
export const renderSnippet = <TProps>(
  snippet: Snippet<[TProps]>,
  params?: TProps,
) => new RenderSnippetConfig(snippet, params)
