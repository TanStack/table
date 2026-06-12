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
      features: {},
      columns: [],
      data: [],
    })

    expect(table._reactivity).toBeDefined()
    expect(table.store.get()).toEqual({})
  })
})
