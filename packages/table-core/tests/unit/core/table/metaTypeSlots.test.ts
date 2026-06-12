import { describe, expect, it } from 'vitest'
import {
  columnFilteringFeature,
  constructTable,
  coreFeatures,
  metaHelper,
  rowSortingFeature,
  tableFeatures,
} from '../../../../src'
import { storeReactivityBindings } from '../../../../src/store-reactivity-bindings'
import type {
  CellData,
  ColumnMeta,
  ExtractColumnMeta,
  ExtractFilterMeta,
  ExtractTableMeta,
  FilterFn,
  FilterMeta,
  Row,
  TableMeta,
  TableOptions,
} from '../../../../src'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false
type Expect<T extends true> = T

interface Person {
  firstName: string
  age: number
}

interface MyTableMeta {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
}

interface MyColumnMeta {
  align?: 'left' | 'right'
}

describe('tableMeta/columnMeta type-only feature slots', () => {
  const features = tableFeatures({
    rowSortingFeature,
    tableMeta: {} as MyTableMeta,
    // `metaHelper` is equivalent to `{} as MyColumnMeta`, but avoids
    // no-unnecessary-type-assertion lint errors on all-optional meta types
    columnMeta: metaHelper<MyColumnMeta>(),
  })

  it('strips the type-only slots from the registered features at runtime', () => {
    const table = constructTable({
      features: {
        ...coreFeatures,
        coreReactivityFeature: storeReactivityBindings(),
        ...features,
      },
      columns: [],
      data: [] as Array<Person>,
      meta: {
        updateData: () => {},
      },
    })

    expect(table._features).not.toHaveProperty('tableMeta')
    expect(table._features).not.toHaveProperty('columnMeta')
    expect(table._features).toHaveProperty('rowSortingFeature')
    expect(table.options.meta?.updateData).toBeTypeOf('function')
  })

  it('infers meta types from the features object', () => {
    type _extractedTableMeta = Expect<
      Equal<ExtractTableMeta<typeof features, Person>, MyTableMeta>
    >
    type _extractedColumnMeta = Expect<
      Equal<ExtractColumnMeta<typeof features, Person>, MyColumnMeta>
    >

    // options.meta resolves to the declared table meta type
    type _optionsMeta = Expect<
      Equal<
        TableOptions<typeof features, Person>['meta'],
        MyTableMeta | undefined
      >
    >

    // feature option extraction is undisturbed by the phantom keys
    type _featureOptions = Expect<
      'onSortingChange' extends keyof TableOptions<typeof features, Person>
        ? true
        : false
    >

    // no debug options are generated for the type-only slots
    type _noDebugKeys = Expect<
      Equal<
        Extract<
          keyof TableOptions<typeof features, Person>,
          'debugTableMeta' | 'debugColumnMeta'
        >,
        never
      >
    >

    expect(true).toBe(true)
  })

  it('falls back to declaration-merged interfaces when slots are omitted', () => {
    const plainFeatures = tableFeatures({ rowSortingFeature })

    type _tableMetaFallback = Expect<
      Equal<
        ExtractTableMeta<typeof plainFeatures, Person>,
        TableMeta<typeof plainFeatures, Person>
      >
    >
    type _columnMetaFallback = Expect<
      Equal<
        ExtractColumnMeta<typeof plainFeatures, Person>,
        ColumnMeta<typeof plainFeatures, Person, CellData>
      >
    >

    // internal `any` feature paths also use the fallback
    type _anyFallback = Expect<
      Equal<ExtractTableMeta<any, Person>, TableMeta<any, Person>>
    >

    expect(true).toBe(true)
  })

  describe('filterMeta type-only slot', () => {
    interface MyFilterMeta {
      itemRank: number
    }

    const filteringFeatures = tableFeatures({
      columnFilteringFeature,
      filterMeta: metaHelper<MyFilterMeta>(),
    })

    it('strips the filterMeta slot from the registered features at runtime', () => {
      const table = constructTable({
        features: {
          ...coreFeatures,
          coreReactivityFeature: storeReactivityBindings(),
          ...filteringFeatures,
        },
        columns: [],
        data: [] as Array<Person>,
      })

      expect(table._features).not.toHaveProperty('filterMeta')
      expect(table._features).toHaveProperty('columnFilteringFeature')
    })

    it('flows the declared type into addMeta and columnFiltersMeta', () => {
      type _extractedFilterMeta = Expect<
        Equal<ExtractFilterMeta<typeof filteringFeatures>, MyFilterMeta>
      >

      // FilterFn's addMeta callback receives the declared meta type
      type _addMetaParam = Expect<
        Equal<
          Parameters<
            NonNullable<
              Parameters<FilterFn<typeof filteringFeatures, Person>>[3]
            >
          >[0],
          MyFilterMeta
        >
      >

      // row.columnFiltersMeta values resolve to the declared meta type
      type _rowFilterMeta = Expect<
        Equal<
          Row<typeof filteringFeatures, Person>['columnFiltersMeta'],
          Record<string, MyFilterMeta>
        >
      >

      // fallback to the declaration-merged FilterMeta interface
      const plainFeatures = tableFeatures({ columnFilteringFeature })
      type _filterMetaFallback = Expect<
        Equal<ExtractFilterMeta<typeof plainFeatures>, FilterMeta>
      >
      type _anyFilterMetaFallback = Expect<
        Equal<ExtractFilterMeta<any>, FilterMeta>
      >

      expect(true).toBe(true)
    })

    it('requires a filtering feature to be registered', () => {
      const invalid = tableFeatures({
        rowSortingFeature,
        // @ts-expect-error - filterMeta requires a filtering feature
        filterMeta: metaHelper<MyFilterMeta>(),
      })

      expect(invalid).toBeDefined()
    })
  })
})
