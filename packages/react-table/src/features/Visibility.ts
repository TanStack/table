import {
  Cell,
  Column,
  Getter,
  OnChangeFn,
  PropGetterValue,
  ReactTable,
  Updater,
} from '../types'
import { functionalUpdate, makeStateUpdater, memo, propGetter } from '../utils'

export type VisibilityOptions = {
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  enableHiding?: boolean
}

export type VisibilityDefaultOptions = {
  onColumnVisibilityChange: OnChangeFn<VisibilityState>
}

export type VisibilityState = Record<string, boolean>

export type VisibilityTableState = {
  columnVisibility: VisibilityState
}

export type VisibilityInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  getVisibleFlatColumns: () => Column<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getVisibleLeafColumns: () => Column<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  setColumnVisibility: (updater: Updater<VisibilityState>) => void
  toggleColumnVisibility: (columnId: string, value?: boolean) => void
  toggleAllColumnsVisible: (value?: boolean) => void
  getColumnIsVisible: (columId: string) => boolean
  getColumnCanHide: (columnId: string) => boolean
  getIsAllColumnsVisible: () => boolean
  getIsSomeColumnsVisible: () => boolean
  getToggleAllColumnsVisibilityProps: <
    TGetter extends Getter<ToggleAllColumnsVisibilityProps>
  >(
    userProps?: TGetter
  ) => undefined | PropGetterValue<ToggleAllColumnsVisibilityProps, TGetter>
}

type ToggleVisibilityProps = {}
type ToggleAllColumnsVisibilityProps = {}

export type VisibilityColumnDef = {
  enableHiding?: boolean
  defaultCanHide?: boolean
}

export type VisibilityRow<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  getVisibleCells: () => Cell<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
}

export type VisibilityColumn = {
  getCanHide: () => boolean
  getIsVisible: () => boolean
  toggleVisibility: (value?: boolean) => void
  getToggleVisibilityProps: <TGetter extends Getter<ToggleVisibilityProps>>(
    userProps?: TGetter
  ) => PropGetterValue<ToggleVisibilityProps, TGetter>
}

//

export function getInitialState(): VisibilityTableState {
  return {
    columnVisibility: {},
  }
}

export function getDefaultOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): VisibilityDefaultOptions {
  return {
    onColumnVisibilityChange: makeStateUpdater('columnVisibility', instance),
  }
}

export function getDefaultColumn() {
  return {
    defaultIsVisible: true,
  }
}

export function createColumn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): VisibilityColumn {
  return {
    getCanHide: () => instance.getColumnCanHide(column.id),
    getIsVisible: () => instance.getColumnIsVisible(column.id),
    toggleVisibility: value =>
      instance.toggleColumnVisibility(column.id, value),
    getToggleVisibilityProps: userProps => {
      const props: ToggleVisibilityProps = {
        type: 'checkbox',
        checked: column.getIsVisible?.(),
        title: 'Toggle Column Visibility',
        onChange: (e: MouseEvent | TouchEvent) => {
          column.toggleVisibility?.((e.target as HTMLInputElement).checked)
        },
      }

      return propGetter(props, userProps)
    },
  }
}

export function getInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): VisibilityInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  return {
    getVisibleFlatColumns: memo(
      () => [
        instance.getAllFlatColumns(),
        instance
          .getAllFlatColumns()
          .filter(d => d.getIsVisible?.())
          .map(d => d.id)
          .join('_'),
      ],
      allFlatColumns => {
        return allFlatColumns.filter(d => d.getIsVisible?.())
      },
      'getVisibleFlatColumns',
      instance.options.debug
    ),

    getVisibleLeafColumns: memo(
      () => [
        instance.getAllLeafColumns(),
        instance
          .getAllLeafColumns()
          .filter(d => d.getIsVisible?.())
          .map(d => d.id)
          .join('_'),
      ],
      allFlatColumns => {
        return allFlatColumns.filter(d => d.getIsVisible?.())
      },
      'getVisibleLeafColumns',
      instance.options.debug
    ),

    setColumnVisibility: updater =>
      instance.options.onColumnVisibilityChange?.(
        updater,
        functionalUpdate(updater, instance.getState().columnVisibility)
      ),

    toggleColumnVisibility: (columnId, value) => {
      if (!columnId) return

      if (instance.getColumnCanHide(columnId)) {
        instance.setColumnVisibility(old => ({
          ...old,
          [columnId]: value ?? !instance.getColumnIsVisible(columnId),
        }))
      }
    },

    toggleAllColumnsVisible: value => {
      value = value ?? !instance.getIsAllColumnsVisible()

      instance.setColumnVisibility(
        instance.getAllLeafColumns().reduce(
          (obj, column) => ({
            ...obj,
            [column.id]: !value ? !column.getCanHide?.() : value,
          }),
          {}
        )
      )
    },

    getColumnIsVisible: columnId => {
      const column = instance.getColumn(columnId)

      if (!column) {
        throw new Error()
      }

      return (
        instance.getState().columnVisibility?.[columnId] ??
        column.defaultIsVisible ??
        true
      )
    },

    getColumnCanHide: columnId => {
      const column = instance.getColumn(columnId)

      if (!column) {
        throw new Error()
      }

      return (
        instance.options.enableHiding ??
        column.enableHiding ??
        column.defaultCanHide ??
        true
      )
    },

    getIsAllColumnsVisible: () =>
      !instance.getAllLeafColumns().some(column => !column.getIsVisible?.()),

    getIsSomeColumnsVisible: () =>
      instance.getAllLeafColumns().some(column => column.getIsVisible?.()),

    getToggleAllColumnsVisibilityProps: userProps => {
      const props: ToggleAllColumnsVisibilityProps = {
        onChange: (e: MouseEvent) => {
          instance.toggleAllColumnsVisible(
            (e.target as HTMLInputElement)?.checked
          )
        },
        type: 'checkbox',
        title: 'Toggle visibility for all columns',
        checked: instance.getIsAllColumnsVisible(),
        indeterminate:
          !instance.getIsAllColumnsVisible() &&
          instance.getIsSomeColumnsVisible()
            ? 'indeterminate'
            : undefined,
      }

      return propGetter(props, userProps)
    },
  }
}
