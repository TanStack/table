import Component from '@glimmer/component'
import {
  flexRender,
  FlexRenderComponentConfig,
} from './flex-render.ts'
import type {
  Cell_Core,
  CellData,
  Header_Core,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import type { ComponentLike, ContentValue } from '@glint/template'
import type { FlexRenderableSignature } from './flex-render.ts'

// --- Shared rendering logic ---

function resolveResult(comp: unknown, ctx: unknown): unknown {
  return flexRender(
    comp as ((props: unknown) => unknown) | string | undefined | null,
    ctx,
  )
}

function getComponentToRender(
  result: unknown,
): ComponentLike<FlexRenderableSignature> | undefined {
  if (result instanceof FlexRenderComponentConfig) {
    return result.component
  }
  return undefined
}

function getComponentArgs(
  result: unknown,
): Record<string, unknown> | undefined {
  if (result instanceof FlexRenderComponentConfig) {
    return result.args
  }
  return undefined
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
  get result(): unknown {
    const cell = this.args.cell
    return resolveResult(cell.column.columnDef.cell, cell.getContext())
  }

  get resolvedContext(): unknown {
    return this.args.cell.getContext()
  }

  get isComponent(): boolean {
    return this.result instanceof FlexRenderComponentConfig
  }

  get componentToRender(): ComponentLike<FlexRenderableSignature> | undefined {
    return getComponentToRender(this.result)
  }

  get componentArgs(): Record<string, unknown> | undefined {
    return getComponentArgs(this.result)
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
  get result(): unknown {
    const header = this.args.header
    if (header.isPlaceholder) return null
    return resolveResult(header.column.columnDef.header, header.getContext())
  }

  get resolvedContext(): unknown {
    return this.args.header.getContext()
  }

  get isComponent(): boolean {
    return this.result instanceof FlexRenderComponentConfig
  }

  get componentToRender(): ComponentLike<FlexRenderableSignature> | undefined {
    return getComponentToRender(this.result)
  }

  get componentArgs(): Record<string, unknown> | undefined {
    return getComponentArgs(this.result)
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
  get result(): unknown {
    const footer = this.args.footer
    if (footer.isPlaceholder) return null
    return resolveResult(footer.column.columnDef.footer, footer.getContext())
  }

  get resolvedContext(): unknown {
    return this.args.footer.getContext()
  }

  get isComponent(): boolean {
    return this.result instanceof FlexRenderComponentConfig
  }

  get componentToRender(): ComponentLike<FlexRenderableSignature> | undefined {
    return getComponentToRender(this.result)
  }

  get componentArgs(): Record<string, unknown> | undefined {
    return getComponentArgs(this.result)
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
