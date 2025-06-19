import { Row } from './types';
export declare const sortTypes: {
    alphanumeric: typeof alphanumeric;
    alphanumericCaseSensitive: typeof alphanumericCaseSensitive;
    text: typeof text;
    textCaseSensitive: typeof textCaseSensitive;
    datetime: typeof datetime;
    basic: typeof basic;
};
export declare type BuiltInSortType = keyof typeof sortTypes;
declare function alphanumeric<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, columnId: string): number;
declare function alphanumericCaseSensitive<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, columnId: string): number;
declare function text<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, columnId: string): 0 | 1 | -1;
declare function textCaseSensitive<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, columnId: string): 0 | 1 | -1;
declare function datetime<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, columnId: string): 0 | 1 | -1;
declare function basic<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>(rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>, columnId: string): 0 | 1 | -1;
export {};
