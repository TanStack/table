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
  _features: features,
})

export const optionsWithFeaturesAndData = tableOptions({
  _features: features,
  data: [] as Array<Person>,
})

export const optionsWithFeaturesAndColumns = tableOptions({
  _features: features,
  columns: [],
})

export const optionsWithFeaturesDataAndColumns = tableOptions({
  _features: features,
  data: [] as Array<Person>,
  columns: [],
})

type _OptionsWithFeaturesOnlyDoesNotInferAny = Assert<
  IsAny<typeof optionsWithFeaturesOnly> extends false ? true : false
>
type _OptionsWithFeaturesOnlyPreservesFeatures = Assert<
  (typeof optionsWithFeaturesOnly)['_features'] extends typeof features
    ? true
    : false
>

type _OptionsWithFeaturesAndDataDoesNotInferAny = Assert<
  IsAny<typeof optionsWithFeaturesAndData> extends false ? true : false
>
type _OptionsWithFeaturesAndDataPreservesFeatures = Assert<
  (typeof optionsWithFeaturesAndData)['_features'] extends typeof features
    ? true
    : false
>

type _OptionsWithFeaturesAndColumnsDoesNotInferAny = Assert<
  IsAny<typeof optionsWithFeaturesAndColumns> extends false ? true : false
>
type _OptionsWithFeaturesAndColumnsPreservesFeatures = Assert<
  (typeof optionsWithFeaturesAndColumns)['_features'] extends typeof features
    ? true
    : false
>

type _OptionsWithFeaturesDataAndColumnsDoesNotInferAny = Assert<
  IsAny<typeof optionsWithFeaturesDataAndColumns> extends false ? true : false
>
type _OptionsWithFeaturesDataAndColumnsPreservesFeatures = Assert<
  (typeof optionsWithFeaturesDataAndColumns)['_features'] extends typeof features
    ? true
    : false
>
