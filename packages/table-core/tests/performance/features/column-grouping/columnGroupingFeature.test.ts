import { describe, expect, it } from 'vitest'
import {
  aggregationFns,
  columnGroupingFeature,
  constructTable,
  createGroupedRowModel,
} from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import { generateTestColumnDefs } from '../../../fixtures/data/generateTestColumnDefs'
import { generateTestData } from '../../../fixtures/data/generateTestData'
import type { Person } from '../../../fixtures/data/types'

const features = testFeatures({
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  aggregationFns,
})

describe('#getGroupedRowModel', () => {
  it('groups 50k rows and 3 grouped columns with clustered data in less than 5 seconds', () => {
    const data = generateTestData(50000)
    const columns = generateTestColumnDefs<typeof features>(data)
    const grouping = ['firstName', 'lastName', 'age']
    const start = new Date()

    data.forEach((p) => (p.firstName = 'Fixed'))
    data.forEach((p) => (p.lastName = 'Name'))
    data.forEach((p) => (p.age = 123))

    const table = constructTable<typeof features, Person>({
      features,
      renderFallbackValue: '',
      data,
      initialState: { grouping },
      columns,
    })
    const groupedById = table.getGroupedRowModel().rowsById
    const end = new Date()

    expect(groupedById['firstName:Fixed']?.getLeafRows().length).toEqual(50002)
    expect(
      groupedById['firstName:Fixed>lastName:Name']?.getLeafRows().length,
    ).toEqual(50001)
    expect(
      groupedById['firstName:Fixed>lastName:Name>age:123']?.getLeafRows()
        .length,
    ).toEqual(50000)
    expect(end.valueOf() - start.valueOf()).toBeLessThan(5000)
  })
})
