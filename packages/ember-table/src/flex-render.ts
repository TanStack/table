import type { ComponentLike } from '@glint/template'
import type {
  CellContext,
  CellData,
  HeaderContext,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
export { flexRender } from '@tanstack/table-core/flex-render'

export type FlexRenderContext<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
> =
  | CellContext<TFeatures, TData, TValue>
  | HeaderContext<TFeatures, TData, TValue>

export interface FlexRenderableSignature<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TOptions = undefined,
> {
  Args: {
    ctx: FlexRenderContext<TFeatures, TData, TValue>
    options?: TOptions
  }
}

export interface CellRenderableSignature<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TOptions = undefined,
> {
  Args: {
    ctx: CellContext<TFeatures, TData, TValue>
    options?: TOptions
  }
}

type FlexRenderableComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TOptions,
> =
  | ComponentLike<FlexRenderableSignature<TFeatures, TData, TValue, TOptions>>
  | ComponentLike<CellRenderableSignature<TFeatures, TData, TValue, TOptions>>

export class FlexRenderComponentConfig<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TOptions = undefined,
> {
  readonly component: FlexRenderableComponent<
    TFeatures,
    TData,
    TValue,
    TOptions
  >
  readonly options?: TOptions

  constructor(
    component: FlexRenderableComponent<TFeatures, TData, TValue, TOptions>,
    options?: TOptions,
  ) {
    this.component = component
    this.options = options
  }
}

export function flexRenderComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(
  component: FlexRenderableComponent<TFeatures, TData, TValue, undefined>,
): FlexRenderComponentConfig<TFeatures, TData, TValue, undefined>

export function flexRenderComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TOptions,
>(
  component: FlexRenderableComponent<TFeatures, TData, TValue, TOptions>,
  options: TOptions,
): FlexRenderComponentConfig<TFeatures, TData, TValue, TOptions>

export function flexRenderComponent<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TOptions = undefined,
>(
  component: FlexRenderableComponent<TFeatures, TData, TValue, TOptions>,
  options?: TOptions,
): FlexRenderComponentConfig<TFeatures, TData, TValue, TOptions> {
  return new FlexRenderComponentConfig(component, options)
}
