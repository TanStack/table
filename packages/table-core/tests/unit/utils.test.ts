import { describe, expect, it } from 'vitest'
import { getFunctionNameInfo } from '../../src/utils'

// TODO: add unit tests for rest of utils

describe('utils', () => {
  describe('getFunctionNameInfo', () => {
    it('should correctly parse a function with a standard name', () => {
      function table_getRowModel() {}
      const result = getFunctionNameInfo(table_getRowModel)
      expect(result).toEqual({
        fnKey: 'getRowModel',
        fnName: 'table.getRowModel',
        parentName: 'table',
      })
    })

    it('should handle anonymous functions with a name assigned', () => {
      const row_getCells = function () {}
      const result = getFunctionNameInfo(row_getCells)
      expect(result).toEqual({
        fnKey: 'getCells',
        fnName: 'row.getCells',
        parentName: 'row',
      })
    })

    it('should parse arrow functions with a name', () => {
      const column_getIsVisible = () => {}
      const result = getFunctionNameInfo(column_getIsVisible)
      expect(result).toEqual({
        fnKey: 'getIsVisible',
        fnName: 'column.getIsVisible',
        parentName: 'column',
      })
    })
  })
})
