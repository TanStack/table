import { describe, expect, it } from 'vitest'
import { constructColumn } from '../../../../src/core/columns/constructColumn'
import { constructTable } from '../../../../src'
import { testFeatures } from '../../../fixtures/features'
import type { ColumnDef } from '../../../../src/types/ColumnDef'
import type { TableFeature } from '../../../../src/types/TableFeatures'

const features = testFeatures({})

interface TestRow {
  'test-accessor-key'?: string
}

interface ColumnAnnotation {
  id: string
  depth: number
  parentId: string | undefined
  parentAnnotationId: string | undefined
}

interface AnnotatedColumn {
  instanceAnnotation?: ColumnAnnotation
}

describe('constructColumn', () => {
  it('should create a column with all core column APIs and properties', () => {
    const table = constructTable<typeof features, TestRow>({
      features,
      columns: [],
      data: [],
    })

    const columnDef: ColumnDef<typeof features, TestRow> = {
      id: 'test-column',
      accessorKey: 'test-accessor-key',
    }
    const depth = 0
    const parent = undefined

    const column = constructColumn(table, columnDef, depth, parent)

    expect(column).toBeDefined()
    expect(column).toHaveProperty('accessorFn')
    expect(column).toHaveProperty('columnDef')
    expect(column).toHaveProperty('columns')
    expect(column).toHaveProperty('depth')
    expect(column).toHaveProperty('id')
    expect(column).toHaveProperty('parent')
    expect(column).toHaveProperty('getFlatColumns')
    expect(column).toHaveProperty('getLeafColumns')

    expect(column.id).toBe(columnDef.id)
    expect(column.depth).toBe(depth)
    expect(column.parent).toBe(parent)
  })

  it('should initialize instance-specific column data for every column', () => {
    const initializedColumnIds: Array<string> = []
    const annotationFeature: TableFeature = {
      initColumnInstanceData: (column) => {
        const parentAnnotation = (
          column.parent as (typeof column & AnnotatedColumn) | undefined
        )?.instanceAnnotation

        Object.defineProperty(column, 'instanceAnnotation', {
          value: {
            id: column.id,
            depth: column.depth,
            parentId: column.parent?.id,
            parentAnnotationId: parentAnnotation?.id,
          } satisfies ColumnAnnotation,
          enumerable: true,
          configurable: true,
        })

        initializedColumnIds.push(column.id)
      },
    }

    const featuresWithAnnotations = {
      ...features,
      annotationFeature,
    }

    const columns: Array<
      ColumnDef<typeof featuresWithAnnotations, TestRow, any>
    > = [
      {
        id: 'group',
        header: 'Group',
        columns: [
          {
            id: 'child',
            accessorKey: 'test-accessor-key',
          },
        ],
      },
    ]

    const table = constructTable<typeof featuresWithAnnotations, TestRow>({
      features: featuresWithAnnotations,
      columns,
      data: [],
    })

    const flatColumns = table.getAllFlatColumns()
    const groupColumn = flatColumns.find((column) => column.id === 'group')!
    const childColumn = flatColumns.find((column) => column.id === 'child')!
    const groupAnnotation = (
      groupColumn as typeof groupColumn & AnnotatedColumn
    ).instanceAnnotation
    const childAnnotation = (
      childColumn as typeof childColumn & AnnotatedColumn
    ).instanceAnnotation

    expect(initializedColumnIds).toEqual(['group', 'child'])
    expect(
      Object.prototype.hasOwnProperty.call(groupColumn, 'instanceAnnotation'),
    ).toBe(true)
    expect(
      Object.prototype.hasOwnProperty.call(childColumn, 'instanceAnnotation'),
    ).toBe(true)
    expect(groupAnnotation).toEqual({
      id: 'group',
      depth: 0,
      parentId: undefined,
      parentAnnotationId: undefined,
    })
    expect(childAnnotation).toEqual({
      id: 'child',
      depth: 1,
      parentId: 'group',
      parentAnnotationId: 'group',
    })
  })
})
