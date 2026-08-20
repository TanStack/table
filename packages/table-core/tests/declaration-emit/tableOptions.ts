import { rowSortingFeature, tableFeatures, tableOptions } from '../../src'

type Assert<T extends true> = T
type IsAny<T> = 0 extends 1 & T ? true : false

type Person = {
  firstName: string
}

const features = tableFeatures({
  rowSortingFeature,
})

export const optionsWithFeaturesOnly = tableOptions({
  features,
})

export const optionsWithFeaturesAndData = tableOptions({
  features,
  data: [] as Array<Person>,
})

export const optionsWithFeaturesAndColumns = tableOptions({
  features,
  columns: [],
})

export const optionsWithFeaturesDataAndColumns = tableOptions({
  features,
  data: [] as Array<Person>,
  columns: [],
})

true satisfies Assert<
  IsAny<typeof optionsWithFeaturesOnly> extends false ? true : false
>
true satisfies Assert<
  (typeof optionsWithFeaturesOnly)['features'] extends typeof features
    ? true
    : false
>

true satisfies Assert<
  IsAny<typeof optionsWithFeaturesAndData> extends false ? true : false
>
true satisfies Assert<
  (typeof optionsWithFeaturesAndData)['features'] extends typeof features
    ? true
    : false
>

true satisfies Assert<
  IsAny<typeof optionsWithFeaturesAndColumns> extends false ? true : false
>
true satisfies Assert<
  (typeof optionsWithFeaturesAndColumns)['features'] extends typeof features
    ? true
    : false
>

true satisfies Assert<
  IsAny<typeof optionsWithFeaturesDataAndColumns> extends false ? true : false
>
true satisfies Assert<
  (typeof optionsWithFeaturesDataAndColumns)['features'] extends typeof features
    ? true
    : false
>
