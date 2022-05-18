export declare type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: 'relationship' | 'complicated' | 'single';
    subRows?: Person[];
};
export declare function makeData(...lens: number[]): Person[];
