import React from 'react';
export declare const Entry: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const Label: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLSpanElement> & React.RefAttributes<HTMLSpanElement>>;
export declare const Value: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLSpanElement> & React.RefAttributes<HTMLSpanElement>>;
export declare const SubEntries: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
export declare const Info: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLSpanElement> & React.RefAttributes<HTMLSpanElement>>;
export declare const Expander: ({ expanded, style, ...rest }: {
    [x: string]: any;
    expanded: any;
    style?: {} | undefined;
}) => JSX.Element;
export default function Explorer({ value, defaultExpanded, renderer, pageSize, depth, ...rest }: {
    [x: string]: any;
    value: any;
    defaultExpanded: any;
    renderer?: (({ handleEntry, label, value, subEntries, subEntryPages, type, expanded, toggle, pageSize, renderer, }: {
        handleEntry: any;
        label: any;
        value: any;
        subEntries: any;
        subEntryPages: any;
        type: any;
        expanded: any;
        toggle: any;
        pageSize: any;
        renderer: any;
    }) => JSX.Element) | undefined;
    pageSize?: number | undefined;
    depth?: number | undefined;
}): JSX.Element;
