import type { ComponentLike } from '@glint/template'
import type {
  CellContext,
  CellData,
  HeaderContext,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'

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
  TArgs extends Record<string, unknown> = Record<string, unknown>,
> {
  Args: {
    ctx: FlexRenderContext<TFeatures, TData, TValue>
    args: TArgs
  }
}

export class FlexRenderComponentConfig<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TArgs extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly component: ComponentLike<
    FlexRenderableSignature<TFeatures, TData, TValue, TArgs>
  >
  readonly args?: TArgs

  constructor(
    component: ComponentLike<
      FlexRenderableSignature<TFeatures, TData, TValue, TArgs>
    >,
    args?: TArgs,
  ) {
    this.component = component
    this.args = args
  }
}

export function flexRenderComponent<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TArgs extends Record<string, unknown> = Record<string, unknown>,
>(
  component: ComponentLike<
    FlexRenderableSignature<TFeatures, TData, TValue, TArgs>
  >,
  args?: TArgs,
): FlexRenderComponentConfig<TFeatures, TData, TValue, TArgs> {
  return new FlexRenderComponentConfig(component, args)
}
