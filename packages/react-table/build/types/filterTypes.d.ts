import { AccessorFn, Row } from './types';
export declare const filterTypes: {
    includesString: typeof includesString;
    includesStringSensitive: typeof includesStringSensitive;
    equalsString: typeof equalsString;
    equalsStringSensitive: typeof equalsStringSensitive;
    arrIncludes: typeof arrIncludes;
    arrIncludesAll: typeof arrIncludesAll;
    equals: typeof equals;
    weakEquals: typeof weakEquals;
    betweenNumberRange: typeof betweenNumberRange;
};
export declare type BuiltInFilterType = keyof typeof filterTypes;
declare function includesString<TData, TValue, TAccessor extends AccessorFn<TData>, TFilterFns, TSortingFns, TAggregationFns>(rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], columnIds: string[], filterValue: unknown): Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
declare namespace includesString {
    var autoRemove: (val: any) => boolean;
}
declare function includesStringSensitive<TData, TValue, TAccessor extends AccessorFn<TData>, TFilterFns, TSortingFns, TAggregationFns>(rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], columnIds: string[], filterValue: unknown): Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
declare namespace includesStringSensitive {
    var autoRemove: (val: any) => boolean;
}
declare function equalsString<TData, TValue, TAccessor extends AccessorFn<TData>, TFilterFns, TSortingFns, TAggregationFns>(rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], columnIds: string[], filterValue: unknown): Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
declare namespace equalsString {
    var autoRemove: (val: any) => boolean;
}
declare function equalsStringSensitive<TData, TValue, TAccessor extends AccessorFn<TData>, TFilterFns, TSortingFns, TAggregationFns>(rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], columnIds: string[], filterValue: unknown): Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
declare namespace equalsStringSensitive {
    var autoRemove: (val: any) => boolean;
}
declare function arrIncludes<TData, TValue, TAccessor extends AccessorFn<TData>, TFilterFns, TSortingFns, TAggregationFns>(rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], columnIds: string[], filterValue: unknown): Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
declare namespace arrIncludes {
    var autoRemove: (val: any) => boolean;
}
declare function arrIncludesAll<TData, TValue, TAccessor extends AccessorFn<TData>, TFilterFns, TSortingFns, TAggregationFns>(rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], columnIds: string[], filterValue: unknown[]): Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
declare namespace arrIncludesAll {
    var autoRemove: (val: any) => boolean;
}
declare function equals<TData, TValue, TAccessor extends AccessorFn<TData>, TFilterFns, TSortingFns, TAggregationFns>(rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], columnIds: string[], filterValue: unknown): Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
declare namespace equals {
    var autoRemove: (val: any) => boolean;
}
declare function weakEquals<TData, TValue, TAccessor extends AccessorFn<TData>, TFilterFns, TSortingFns, TAggregationFns>(rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], columnIds: string[], filterValue: unknown): Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
declare namespace weakEquals {
    var autoRemove: (val: any) => boolean;
}
declare function betweenNumberRange<TData, TValue, TAccessor extends AccessorFn<TData>, TFilterFns, TSortingFns, TAggregationFns>(rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[], columnIds: string[], filterValue: [unknown, unknown]): Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[];
declare namespace betweenNumberRange {
    var autoRemove: (val: any) => boolean;
}
export {};
