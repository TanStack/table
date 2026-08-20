import { describe, expect, it } from 'vitest'
import { constructTable } from '../../../../src'
import { constructHeader } from '../../../../src/core/headers/constructHeader'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src/types/ColumnDef'
import type { TableFeature } from '../../../../src/types/TableFeatures'

interface Person {
  firstName: string
}

const features = testFeatures({})

const columns: Array<ColumnDef<typeof features, Person, any>> = [
  { id: 'test-column', accessorKey: 'firstName' },
]

describe('constructHeader', () => {
  it('should create a column with all core column APIs and properties', () => {
    const table = constructTable<typeof features, Person>({
      features,
      columns,
      data: [],
    })
    const column = table.getAllLeafColumns()[0]!
    const index = 0
    const depth = 0

    const header = constructHeader(table, column, {
      index,
      depth,
    })

    expect(header).toBeDefined()
    expect(header).toHaveProperty('colSpan')
    expect(header).toHaveProperty('column')
    expect(header).toHaveProperty('depth')
    expect(header).toHaveProperty('headerGroup')
    expect(header).toHaveProperty('id')
    expect(header).toHaveProperty('index')
    expect(header).toHaveProperty('isPlaceholder')
    expect(header).toHaveProperty('placeholderId')
    expect(header).toHaveProperty('rowSpan')
    expect(header).toHaveProperty('subHeaders')
    expect(header).toHaveProperty('getContext')
    expect(header).toHaveProperty('getLeafHeaders')

    expect(header.id).toBe(column.id)
  })

  it('should initialize instance-specific header data for every header', () => {
    const initializedHeaders: Array<{
      id: string
      isPlaceholder: boolean
      subHeadersLengthAtInit: number
    }> = []
    const annotationFeature: TableFeature = {
      initHeaderInstanceData: (header) => {
        Object.defineProperty(header, 'instanceAnnotation', {
          value: header.id,
          enumerable: true,
          configurable: true,
        })
        initializedHeaders.push({
          id: header.id,
          isPlaceholder: header.isPlaceholder,
          subHeadersLengthAtInit: header.subHeaders.length,
        })
      },
    }
    const featuresWithAnnotations = {
      ...features,
      annotationFeature,
    }
    const groupedColumns: Array<
      ColumnDef<typeof featuresWithAnnotations, Person, any>
    > = [
      {
        id: 'group',
        header: 'Group',
        columns: [{ id: 'child', accessorKey: 'firstName' }],
      },
      { id: 'solo', accessorKey: 'firstName' },
    ]

    const table = constructTable<typeof featuresWithAnnotations, Person>({
      features: featuresWithAnnotations,
      columns: groupedColumns,
      data: [],
    })

    const allHeaders = table
      .getHeaderGroups()
      .flatMap((headerGroup) => headerGroup.headers)

    expect(allHeaders.length).toBeGreaterThan(0)
    for (const header of allHeaders) {
      expect(
        Object.prototype.hasOwnProperty.call(header, 'instanceAnnotation'),
      ).toBe(true)
      expect((header as any).instanceAnnotation).toBe(header.id)
    }

    // Placeholder headers run the hook too
    expect(
      initializedHeaders.some((initialized) => initialized.isPlaceholder),
    ).toBe(true)
    // The hook runs during construction, before subHeaders are populated
    for (const initialized of initializedHeaders) {
      expect(initialized.subHeadersLengthAtInit).toBe(0)
    }
  })

  it('should initialize instance-specific header group data for every header group', () => {
    const initializedGroups: Array<{
      id: string
      headersCount: number
      backRefsLinked: boolean
    }> = []
    const annotationFeature: TableFeature = {
      initHeaderGroupInstanceData: (headerGroup) => {
        initializedGroups.push({
          id: headerGroup.id,
          headersCount: headerGroup.headers.length,
          backRefsLinked: headerGroup.headers.every(
            (header) => header.headerGroup === headerGroup,
          ),
        })
      },
    }
    const featuresWithAnnotations = {
      ...features,
      annotationFeature,
    }
    const groupedColumns: Array<
      ColumnDef<typeof featuresWithAnnotations, Person, any>
    > = [
      {
        id: 'group',
        header: 'Group',
        columns: [{ id: 'child', accessorKey: 'firstName' }],
      },
    ]

    const table = constructTable<typeof featuresWithAnnotations, Person>({
      features: featuresWithAnnotations,
      columns: groupedColumns,
      data: [],
    })

    const headerGroups = table.getHeaderGroups()

    // The hook runs once per group, after its headers are fully populated
    expect(headerGroups.length).toBe(2)
    expect(initializedGroups.length).toBe(headerGroups.length)
    for (const initialized of initializedGroups) {
      expect(initialized.headersCount).toBeGreaterThan(0)
      expect(initialized.backRefsLinked).toBe(true)
    }

    // Memoized header groups do not rebuild, so the hook does not rerun
    table.getHeaderGroups()
    expect(initializedGroups.length).toBe(headerGroups.length)
  })
})
