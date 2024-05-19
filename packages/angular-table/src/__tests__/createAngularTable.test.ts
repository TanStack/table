import { describe, test } from 'vitest'
import {
  type ColumnDef,
  createAngularTable,
  getCoreRowModel,
  type Table,
} from '../index'
import { isSignal, signal, untracked } from '@angular/core'

describe('createAngularTable', () => {
  type Data = { id: string; title: string }

  const data = signal<Data[]>([{ id: '1', title: 'Title' }])

  const columns: ColumnDef<Data>[] = [
    { id: 'id', header: 'Id', cell: context => context.getValue() },
    { id: 'title', header: 'Title', cell: context => context.getValue() },
  ]

  const table = createAngularTable(() => ({
    data: data(),
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.id,
  }))

  const tablePropertyKeys = Object.keys(table())

  it('should be a signal', () => {
    expect(isSignal(table)).toEqual(true)
  })

  describe('proxy trap', () => {
    test('supports "in" operator', () => {
      expect('getCoreRowModel' in table).toBe(true)
      expect('options' in table).toBe(true)
      expect('notFound' in table).toBe(false)
    })

    test('supports "Object.keys"', () => {
      const keys = Object.keys(table())
      expect(Object.keys(table)).toEqual(keys)
    })

    test.each(
      tablePropertyKeys.map(property => [
        property,
        testShouldBeComputedProperty(untracked(table), property),
      ])
    )('property (%s) is computed -> %s', (name, expected) => {
      const tableProperty = table[name as keyof typeof table]
      expect(isSignal(tableProperty)).toEqual(expected)
    })
  })
})

const testShouldBeComputedProperty = (
  table: Table<any>,
  propertyName: string
) => {
  if (propertyName.endsWith('Handler') || propertyName.endsWith('Model')) {
    return false
  }

  if (propertyName.startsWith('get')) {
    // Only properties with no arguments are computed
    const fn = table[propertyName as keyof Table<any>]
    // Cannot test if is lazy computed since we return the unwrapped value
    return fn instanceof Function && fn.length === 0
  }

  return false
}
