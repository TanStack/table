import { describe, expect, it } from 'vitest'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  createTable,
} from '../src'

type Product = {
  id: number
  name: string
  price: number | null | undefined
  description: string
}

const columnHelper = createColumnHelper<Product>()

const testData: Product[] = [
  { id: 1, name: 'Product A', price: 100, description: 'Description A' },
  { id: 2, name: 'Product B', price: null, description: '' },
  { id: 3, name: 'Product C', price: 50, description: 'Description C' },
  { id: 4, name: 'Product D', price: undefined, description: '   ' },
  { id: 5, name: 'Product E', price: 200, description: 'Description E' },
]

describe('sortEmpty option', () => {
  describe('sortEmpty: "last"', () => {
    const columns = [
      columnHelper.accessor('id', { header: 'ID' }),
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('price', {
        header: 'Price',
        sortEmpty: 'last',
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        sortEmpty: 'last',
        isEmptyValue: (value) => !value || (typeof value === 'string' && value.trim() === ''),
      }),
    ]

    it('should sort null and undefined to bottom when sortEmpty is "last"', () => {
      const table = createTable({
        data: testData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting: [{ id: 'price', desc: false }],
        },
        onStateChange: () => {},
        renderFallbackValue: null,
      })

      const sortedRows = table.getSortedRowModel().rows
      const prices = sortedRows.map(row => row.original.price)
      
      expect(prices).toEqual([50, 100, 200, null, undefined])
    })

    it('should respect custom isEmptyValue function', () => {
      const table = createTable({
        data: testData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting: [{ id: 'description', desc: false }],
        },
        onStateChange: () => {},
        renderFallbackValue: null,
      })

      const sortedRows = table.getSortedRowModel().rows
      const descriptions = sortedRows.map(row => row.original.description)
      
      expect(descriptions).toEqual([
        'Description A',
        'Description C', 
        'Description E',
        '',      // empty string
        '   ',   // whitespace only
      ])
    })

    it('should handle descending sort with sortEmpty', () => {
      const table = createTable({
        data: testData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting: [{ id: 'price', desc: true }],
        },
        onStateChange: () => {},
        renderFallbackValue: null,
      })

      const sortedRows = table.getSortedRowModel().rows
      const prices = sortedRows.map(row => row.original.price)
      
      // Empty values still at bottom even in desc sort
      expect(prices).toEqual([200, 100, 50, null, undefined])
    })
  })

  describe('sortEmpty: "first"', () => {
    const columns = [
      columnHelper.accessor('id', { header: 'ID' }),
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('price', {
        header: 'Price',
        sortEmpty: 'first',
      }),
    ]

    it('should sort null and undefined to top when sortEmpty is "first"', () => {
      const table = createTable({
        data: testData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting: [{ id: 'price', desc: false }],
        },
        onStateChange: () => {},
        renderFallbackValue: null,
      })

      const sortedRows = table.getSortedRowModel().rows
      const prices = sortedRows.map(row => row.original.price)
      
      expect(prices).toEqual([null, undefined, 50, 100, 200])
    })

    it('should handle descending sort with sortEmpty: "first"', () => {
      const table = createTable({
        data: testData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting: [{ id: 'price', desc: true }],
        },
        onStateChange: () => {},
        renderFallbackValue: null,
      })

      const sortedRows = table.getSortedRowModel().rows
      const prices = sortedRows.map(row => row.original.price)
      
      // Empty values still at top even in desc sort
      expect(prices).toEqual([null, undefined, 200, 100, 50])
    })
  })

  describe('backward compatibility with sortUndefined', () => {
    const legacyColumns = [
      columnHelper.accessor('id', { header: 'ID' }),
      columnHelper.accessor('price', {
        header: 'Price',
        sortUndefined: 'last',
      }),
    ]

    it('should maintain backward compatibility with sortUndefined', () => {
      const table = createTable({
        data: testData,
        columns: legacyColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting: [{ id: 'price', desc: false }],
        },
        onStateChange: () => {},
        renderFallbackValue: null,
      })

      const sortedRows = table.getSortedRowModel().rows
      const prices = sortedRows.map(row => row.original.price)
      
      // sortUndefined only affects undefined, not null
      // null should be sorted normally, undefined at the end
      expect(prices[prices.length - 1]).toBeUndefined()
      expect(prices.includes(null)).toBe(true)
    })
  })

  describe('sortEmpty takes precedence over sortUndefined', () => {
    const mixedColumns = [
      columnHelper.accessor('id', { header: 'ID' }),
      columnHelper.accessor('price', {
        header: 'Price',
        sortEmpty: 'first',
        sortUndefined: 'last', // This should be ignored
      }),
    ]

    it('should use sortEmpty when both sortEmpty and sortUndefined are specified', () => {
      const table = createTable({
        data: testData,
        columns: mixedColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting: [{ id: 'price', desc: false }],
        },
        onStateChange: () => {},
        renderFallbackValue: null,
      })

      const sortedRows = table.getSortedRowModel().rows
      const prices = sortedRows.map(row => row.original.price)
      
      // sortEmpty: 'first' should take precedence
      expect(prices).toEqual([null, undefined, 50, 100, 200])
    })
  })

  describe('default isEmptyValue behavior', () => {
    const defaultColumns = [
      columnHelper.accessor('id', { header: 'ID' }),
      columnHelper.accessor('price', {
        header: 'Price',
        sortEmpty: 'last',
        // No custom isEmptyValue - should use default
      }),
    ]

    it('should use default isEmptyValue function (null, undefined, empty string)', () => {
      const dataWithEmptyString = [
        ...testData,
        { id: 6, name: 'Product F', price: '' as unknown as number, description: 'Description F' },
      ]

      const table = createTable({
        data: dataWithEmptyString,
        columns: defaultColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting: [{ id: 'price', desc: false }],
        },
        onStateChange: () => {},
        renderFallbackValue: null,
      })

      const sortedRows = table.getSortedRowModel().rows
      const prices = sortedRows.map(row => row.original.price)
      
      // Default isEmptyValue should treat '', null, undefined as empty
      expect(prices).toEqual([50, 100, 200, null, undefined, ''])
    })
  })

  describe('sortEmpty: false (disabled)', () => {
    const disabledColumns = [
      columnHelper.accessor('id', { header: 'ID' }),
      columnHelper.accessor('price', {
        header: 'Price',
        sortEmpty: false,
      }),
    ]

    it('should sort normally when sortEmpty is false', () => {
      const table = createTable({
        data: testData,
        columns: disabledColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting: [{ id: 'price', desc: false }],
        },
        onStateChange: () => {},
        renderFallbackValue: null,
      })

      const sortedRows = table.getSortedRowModel().rows
      const prices = sortedRows.map(row => row.original.price)
      
      // Should use normal sorting behavior (null/undefined treated as values)
      // The exact order depends on the sorting function implementation
      expect(prices.length).toBe(5)
      expect(prices.includes(50)).toBe(true)
      expect(prices.includes(100)).toBe(true)
      expect(prices.includes(200)).toBe(true)
      expect(prices.includes(null)).toBe(true)
      expect(prices.includes(undefined)).toBe(true)
    })
  })
})
