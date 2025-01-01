import { describe, expect, it } from 'vitest'
import { getFunctionNameInfo } from '../../src/utils'

// TODO: add unit tests for rest of utils

describe('utils', () => {
  describe('getFunctionNameInfo', () => {
    it('should correctly parse a function name with underscore separator', () => {
      const result = getFunctionNameInfo('table_getRowModel')

      expect(result).toEqual({
        parentName: 'table',
        fnKey: 'getRowModel',
        fnName: 'table.getRowModel',
      })
    })

    it('should handle different parent names', () => {
      const result = getFunctionNameInfo('column_getWidth')

      expect(result).toEqual({
        parentName: 'column',
        fnKey: 'getWidth',
        fnName: 'column.getWidth',
      })
    })
  })
})
