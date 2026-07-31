import Component from '@glimmer/component'
import { cached } from '@glimmer/tracking'
import { FlexRenderComponentConfig } from './flex-render-helpers.ts'
import { flexRender } from '@tanstack/table-core/flex-render'
import type {
  Cell_Core,
  CellContext,
  CellData,
  Header_Core,
  HeaderContext,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import type { ComponentLike, ContentValue } from '@glint/template'

type RenderOptions = Record<string, unknown> | undefined

type CellRenderResult<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | string
  | number
  | null
  | FlexRenderComponentConfig<TFeatures, TData, TValue, RenderOptions>

type HeaderRenderResult<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | string
  | number
  | null
  | FlexRenderComponentConfig<TFeatures, TData, TValue, RenderOptions>

interface CellRenderSignature<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  Args: {
    ctx: CellContext<TFeatures, TData, TValue>
    options?: Record<string, unknown>
  }
}

interface HeaderRenderSignature<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  Args: {
    ctx: HeaderContext<TFeatures, TData, TValue>
    options?: Record<string, unknown>
  }
}

// --- FlexRenderCell ---

export interface FlexRenderCellSignature<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  Args: {
    cell: Cell_Core<TFeatures, TData, TValue>
  }
  Element: null
}

export class FlexRenderCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Component<FlexRenderCellSignature<TFeatures, TData, TValue>> {
  @cached
  get result(): CellRenderResult<TFeatures, TData, TValue> {
    const cell = this.args.cell
    const definition = cell.column.columnDef
    const groupingCell = cell as typeof cell & {
      getIsAggregated?: () => boolean
      getIsPlaceholder?: () => boolean
    }
    const groupingDefinition = definition as typeof definition & {
      aggregatedCell?: typeof definition.cell
    }

    if (groupingCell.getIsAggregated?.()) {
      return flexRender(
        groupingDefinition.aggregatedCell ?? definition.cell,
        cell.getContext(),
      ) as CellRenderResult<TFeatures, TData, TValue>
    }

    if (groupingCell.getIsPlaceholder?.()) {
      return null
    }

    return flexRender(definition.cell, cell.getContext()) as CellRenderResult<
      TFeatures,
      TData,
      TValue
    >
  }

  get resolvedContext(): CellContext<TFeatures, TData, TValue> {
    return this.args.cell.getContext()
  }

  get isComponent(): boolean {
    return this.result instanceof FlexRenderComponentConfig
  }

  get componentToRender():
    ComponentLike<CellRenderSignature<TFeatures, TData, TValue>> | undefined {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.component
    }
    return undefined
  }

  get componentOptions(): RenderOptions {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.options
    }
    return undefined
  }

  get content(): ContentValue {
    return this.result as ContentValue
  }

  <template>
    {{#if this.isComponent}}
      <this.componentToRender
        @ctx={{this.resolvedContext}}
        @options={{this.componentOptions}}
      />
    {{else}}
      {{this.content}}
    {{/if}}
  </template>
}

// --- FlexRenderHeader ---

export interface FlexRenderHeaderSignature<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  Args: {
    header: Header_Core<TFeatures, TData, TValue>
  }
  Element: null
}

export class FlexRenderHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Component<FlexRenderHeaderSignature<TFeatures, TData, TValue>> {
  @cached
  get result(): HeaderRenderResult<TFeatures, TData, TValue> {
    const header = this.args.header
    if (header.isPlaceholder) return null
    return flexRender(
      header.column.columnDef.header,
      header.getContext(),
    ) as HeaderRenderResult<TFeatures, TData, TValue>
  }

  get resolvedContext(): HeaderContext<TFeatures, TData, TValue> {
    return this.args.header.getContext()
  }

  get isComponent(): boolean {
    return this.result instanceof FlexRenderComponentConfig
  }

  get componentToRender():
    ComponentLike<HeaderRenderSignature<TFeatures, TData, TValue>> | undefined {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.component as unknown as ComponentLike<
        HeaderRenderSignature<TFeatures, TData, TValue>
      >
    }
    return undefined
  }

  get componentOptions(): RenderOptions {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.options
    }
    return undefined
  }

  get content(): ContentValue {
    return this.result as ContentValue
  }

  <template>
    {{#if this.isComponent}}
      <this.componentToRender
        @ctx={{this.resolvedContext}}
        @options={{this.componentOptions}}
      />
    {{else}}
      {{this.content}}
    {{/if}}
  </template>
}

// --- FlexRenderFooter ---

export interface FlexRenderFooterSignature<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  Args: {
    footer: Header_Core<TFeatures, TData, TValue>
  }
  Element: null
}

export class FlexRenderFooter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Component<FlexRenderFooterSignature<TFeatures, TData, TValue>> {
  @cached
  get result(): HeaderRenderResult<TFeatures, TData, TValue> {
    const footer = this.args.footer
    if (footer.isPlaceholder) return null
    return flexRender(
      footer.column.columnDef.footer,
      footer.getContext(),
    ) as HeaderRenderResult<TFeatures, TData, TValue>
  }

  get resolvedContext(): HeaderContext<TFeatures, TData, TValue> {
    return this.args.footer.getContext()
  }

  get isComponent(): boolean {
    return this.result instanceof FlexRenderComponentConfig
  }

  get componentToRender():
    ComponentLike<HeaderRenderSignature<TFeatures, TData, TValue>> | undefined {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.component as unknown as ComponentLike<
        HeaderRenderSignature<TFeatures, TData, TValue>
      >
    }
    return undefined
  }

  get componentOptions(): RenderOptions {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.options
    }
    return undefined
  }

  get content(): ContentValue {
    return this.result as ContentValue
  }

  <template>
    {{#if this.isComponent}}
      <this.componentToRender
        @ctx={{this.resolvedContext}}
        @options={{this.componentOptions}}
      />
    {{else}}
      {{this.content}}
    {{/if}}
  </template>
}
