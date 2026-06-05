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

type _OptionsWithFeaturesOnlyDoesNotInferAny = Assert<
  IsAny<typeof optionsWithFeaturesOnly> extends false ? true : false
>
type _OptionsWithFeaturesOnlyPreservesFeatures = Assert<
  (typeof optionsWithFeaturesOnly)['features'] extends typeof features
    ? true
    : false
>

type _OptionsWithFeaturesAndDataDoesNotInferAny = Assert<
  IsAny<typeof optionsWithFeaturesAndData> extends false ? true : false
>
type _OptionsWithFeaturesAndDataPreservesFeatures = Assert<
  (typeof optionsWithFeaturesAndData)['features'] extends typeof features
    ? true
    : false
>

type _OptionsWithFeaturesAndColumnsDoesNotInferAny = Assert<
  IsAny<typeof optionsWithFeaturesAndColumns> extends false ? true : false
>
type _OptionsWithFeaturesAndColumnsPreservesFeatures = Assert<
  (typeof optionsWithFeaturesAndColumns)['features'] extends typeof features
    ? true
    : false
>

type _OptionsWithFeaturesDataAndColumnsDoesNotInferAny = Assert<
  IsAny<typeof optionsWithFeaturesDataAndColumns> extends false ? true : false
>
type _OptionsWithFeaturesDataAndColumnsPreservesFeatures = Assert<
  (typeof optionsWithFeaturesDataAndColumns)['features'] extends typeof features
    ? true
    : false
>
