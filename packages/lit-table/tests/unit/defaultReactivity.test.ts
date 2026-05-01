import { describe, expect, test } from 'vitest'
import { TableController } from '../../src/TableController'

describe('TableController', () => {
  test('uses default reactivity when constructing a table', () => {
    const host = {
      addController: () => {},
      requestUpdate: () => {},
    }
    const controller = new TableController<any, any>(host)

    const table = controller.table({
      _features: {},
      _rowModels: {},
      columns: [],
      data: [],
    })

    expect(table.reactivity).toBeDefined()
    expect(table.store.get()).toEqual({})
  })
})
