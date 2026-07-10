import type { ComponentLike } from '@glint/template';
import type {
  CellContext,
  CellData,
  HeaderContext,
  RowData,
  TableFeatures,
} from '@tanstack/table-core';
export { flexRender } from '@tanstack/table-core/flex-render';

export type FlexRenderContext<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
> =
  | CellContext<TFeatures, TData, TValue>
  | HeaderContext<TFeatures, TData, TValue>;

export interface FlexRenderableSignature<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TArgs = undefined,
> {
  Args: {
    ctx: FlexRenderContext<TFeatures, TData, TValue>;
    args?: TArgs;
  };
}

export interface CellRenderableSignature<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TArgs = undefined,
> {
  Args: {
    ctx: CellContext<TFeatures, TData, TValue>;
    args?: TArgs;
  };
}

type FlexRenderableComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TArgs,
> =
  | ComponentLike<FlexRenderableSignature<TFeatures, TData, TValue, TArgs>>
  | ComponentLike<CellRenderableSignature<TFeatures, TData, TValue, TArgs>>;

export class FlexRenderComponentConfig<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TArgs = undefined,
> {
  readonly component: FlexRenderableComponent<TFeatures, TData, TValue, TArgs>;
  readonly args?: TArgs;

  constructor(
    component: FlexRenderableComponent<TFeatures, TData, TValue, TArgs>,
    args?: TArgs,
  ) {
    this.component = component;
    this.args = args;
  }
}

export function flexRenderComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
>(
  component: FlexRenderableComponent<TFeatures, TData, TValue, undefined>,
): FlexRenderComponentConfig<TFeatures, TData, TValue, undefined>;

export function flexRenderComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TArgs,
>(
  component: FlexRenderableComponent<TFeatures, TData, TValue, TArgs>,
  args: TArgs,
): FlexRenderComponentConfig<TFeatures, TData, TValue, TArgs>;

export function flexRenderComponent<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
  TValue extends CellData = CellData,
  TArgs = undefined,
>(
  component: FlexRenderableComponent<TFeatures, TData, TValue, TArgs>,
  args?: TArgs,
): FlexRenderComponentConfig<TFeatures, TData, TValue, TArgs> {
  return new FlexRenderComponentConfig(component, args);
}
