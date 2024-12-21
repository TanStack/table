import type { ColumnDef } from '../../../src'

export type PersonKeys = keyof Person
export type PersonColumn = ColumnDef<any, Person, any>

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
