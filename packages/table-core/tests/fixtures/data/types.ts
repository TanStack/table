import type { ColumnDef, RowData, TableFeatures } from '../../../src'

export type PersonKeys = keyof Person
export type PersonColumn<
  TFeatures extends TableFeatures,
  TData extends RowData = Person,
> = ColumnDef<TFeatures, TData, any>

export type Person = {
  id: string
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Array<Person>
}
