declare module 'react-table' {
  import { UsePaginationState, UsePaginationValues } from 'react-table'

  export interface TableInstance<D = any> extends UsePaginationValues<D> {}
  export interface TableState<D = any> extends UsePaginationState {}
}
