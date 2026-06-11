import { describe, expect, it } from 'vitest'
import {
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
  ExtractTableMeta,
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
})
