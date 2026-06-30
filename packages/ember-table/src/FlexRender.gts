import Component from '@glimmer/component'
import { FlexRenderComponentConfig } from './flex-render.ts'
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

type RenderArgs = Record<string, unknown> | undefined

type CellRenderResult<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | string
  | number
  | null
  | FlexRenderComponentConfig<TFeatures, TData, TValue, RenderArgs>

type HeaderRenderResult<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | string
  | number
  | null
  | FlexRenderComponentConfig<TFeatures, TData, TValue, RenderArgs>

interface CellRenderSignature<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  Args: {
    ctx: CellContext<TFeatures, TData, TValue>
    args?: Record<string, unknown>
  }
}

interface HeaderRenderSignature<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
> {
  Args: {
    ctx: HeaderContext<TFeatures, TData, TValue>
    args?: Record<string, unknown>
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
  get result(): CellRenderResult<TFeatures, TData, TValue> {
    const cell = this.args.cell
    return flexRender(
      cell.column.columnDef.cell,
      cell.getContext(),
    ) as CellRenderResult<TFeatures, TData, TValue>
  }

  get resolvedContext(): CellContext<TFeatures, TData, TValue> {
    return this.args.cell.getContext()
  }

  get isComponent(): boolean {
    return this.result instanceof FlexRenderComponentConfig
  }

  get componentToRender():
    | ComponentLike<CellRenderSignature<TFeatures, TData, TValue>>
    | undefined {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.component
    }
    return undefined
  }

  get componentArgs(): RenderArgs {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.args
    }
    return undefined
  }

  get content(): ContentValue {
    return this.result as ContentValue
  }

  <template>
    {{#if this.isComponent}}
      <this.componentToRender @ctx={{this.resolvedContext}} @args={{this.componentArgs}} />
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
    | ComponentLike<HeaderRenderSignature<TFeatures, TData, TValue>>
    | undefined {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.component as unknown as ComponentLike<
        HeaderRenderSignature<TFeatures, TData, TValue>
      >
    }
    return undefined
  }

  get componentArgs(): RenderArgs {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.args
    }
    return undefined
  }

  get content(): ContentValue {
    return this.result as ContentValue
  }

  <template>
    {{#if this.isComponent}}
      <this.componentToRender @ctx={{this.resolvedContext}} @args={{this.componentArgs}} />
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
    | ComponentLike<HeaderRenderSignature<TFeatures, TData, TValue>>
    | undefined {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.component as unknown as ComponentLike<
        HeaderRenderSignature<TFeatures, TData, TValue>
      >
    }
    return undefined
  }

  get componentArgs(): RenderArgs {
    const result = this.result
    if (result instanceof FlexRenderComponentConfig) {
      return result.args
    }
    return undefined
  }

  get content(): ContentValue {
    return this.result as ContentValue
  }

  <template>
    {{#if this.isComponent}}
      <this.componentToRender @ctx={{this.resolvedContext}} @args={{this.componentArgs}} />
    {{else}}
      {{this.content}}
    {{/if}}
  </template>
}
