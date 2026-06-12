---
title: Data Guide
---

## Data Guide

Tables start with your data. Your column definitions and rows will depend on the shape of your data. TanStack Table has some TypeScript features that will help you create the rest of your table code with a great type-safe experience. If you set up your data and types correctly, TanStack Table will be able to infer the shape of your data and enforce that your column definitions are made correctly.

### TypeScript

TypeScript is NOT required to use the TanStack Table packages... ***BUT*** TanStack Table is written and organized in such a way that makes the awesome TypeScript experience that you get feel like it is one of the main selling points of the library. If you are not using TypeScript, you will be missing out on a lot of great autocompletion and type-checking features that will both speed up your development time and reduce the number of bugs in your code.

#### TypeScript Generics

Having a basic understanding of what TypeScript Generics are and how they work will help you understand this guide better, but it should be easy enough to pick up as you go. The official [TypeScript Generics Docs](https://www.typescriptlang.org/docs/handbook/2/generics.html) may be helpful for those not yet familiar with TypeScript.

### Defining Data Types

`data` is an array of objects that will be turned into the rows of your table. Each object in the array represents a row of data (under normal circumstances). If you are using TypeScript, we usually define a type for the shape of our data. This type is used as a generic type for all of the other table, column, row, and cell instances. This Generic is usually referred to as `TData` throughout the rest of the TanStack Table types and APIs.

For example, if we have a table that displays a list of users in an array like this:

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "age": 33,
    "visits": 100,
    "progress": 50,
    "status": "Married"
  },
  {
    "firstName": "Kevin",
    "lastName": "Vandy",
    "age": 27,
    "visits": 200,
    "progress": 100,
    "status": "Single"
  }
]
```

Then we can define a User (TData) type like this:

```ts
//TData
type User = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: string
}
```

We can then define our `data` array with this type, and then TanStack Table will be able to intelligently infer lots of types for us later on in our columns, rows, cells, etc. This is because the `data` type is literally defined as the `TData` generic type. Whatever you pass to the `data` table option will become the `TData` type for the rest of the table instance. Just make sure your column definitions use the same `TData` type as the `data` type when you define them later.

```ts
//note: data needs a "stable" reference in order to prevent wasteful re-computation (more on this below)
const data: User[] = []
//or
const [data, setData] = React.useState<User[]>([])
//or
const data = ref<User[]>([]) //vue
//etc...
```

#### Deep Keyed Data

If your data is not a nice flat array of objects, that's okay! Once you get around to defining your columns, there are strategies for accessing deeply nested data in your accessors.

If your `data` looks something like this:

```json
[
  {
    "name": {
      "first": "Tanner",
      "last": "Linsley"
    },
    "info": {
      "age": 33,
      "visits": 100
    }
  },
  {
    "name": {
      "first": "Kevin",
      "last": "Vandy"
    },
    "info": {
      "age": 27,
      "visits": 200
    }
  }
]
```

You can define a type like this:

```ts
type User = {
  name: {
    first: string
    last: string
  }
  info: {
    age: number
    visits: number
  }
}
```

And you will be able to access the data in your column definitions with either dot notation in an accessorKey or simply by using an accessorFn.

```ts
const columns = [
  {
    header: 'First Name',
    accessorKey: 'name.first',
  },
  {
    header: 'Last Name',
    accessorKey: 'name.last',
  },
  {
    header: 'Age',
    accessorFn: row => row.info.age, //accessorFn receives the whole row object
  },
  //...
]
```

This is discussed in more detail in the [Column Def Guide](./column-defs).

> NOTE: The "keys" in your json data can usually be anything, but any periods in the keys will be interpreted as a deep key and will cause errors.

#### Nested Sub-Row Data

If you are using expanding features, it can be common to have nested sub-rows in your data. This results in a recursive type that is a bit different.

So if your data looks like this:

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "subRows": [
      {
        "firstName": "Kevin",
        "lastName": "Vandy"
      },
      {
        "firstName": "John",
        "lastName": "Doe",
        "subRows": []
      }
    ]
  },
  {
    "firstName": "Jane",
    "lastName": "Doe"
  }
]
```

You can define a type like this:

```ts
type User = {
  firstName: string
  lastName: string
  subRows?: User[] //does not have to be called "subRows", can be called anything
}
```

Where `subRows` is an optional array of `User` objects. This is discussed in more detail in the [Expanding Guide](../framework/react/guide/expanding).

### Give Data a "Stable" Reference

The `data` and `columns` arrays that you pass to the table instance should have "stable" references in order to prevent wasteful re-computation and rendering bugs.

In v9, table state lives in TanStack Store atoms, and the table instance is only created once. Passing a new `data` or `columns` reference on every render will not, by itself, throw the table into the classic v8-style infinite re-render loop. However, the row models and column structures are memoized against the `data` and `columns` references, so an unstable reference still has real consequences:

- **Wasted re-computation.** A new `data` reference invalidates the core row model, so every row and cell object is rebuilt from scratch on every render (and any sorted, filtered, grouped, or paginated row models recompute right along with it). A new `columns` reference does the same for the column and header structures. For large datasets, this is a serious performance problem.
- **Auto-reset render loops.** Features that automatically reset state when the rows are recalculated can still cause infinite re-render loops. For example, with client-side pagination enabled, `autoResetPageIndex` resets the page index whenever the row model recomputes. With an unstable `data` reference, that means a state update after every render, and each state update triggers another render with yet another new `data` reference.

Either way, treat stable `data` and `columns` references as a requirement.

How you do this depends on which framework adapter you are using, but in React, you should often use `React.useState`, `React.useMemo`, or similar to ensure that both the `data` and `columns` table options have stable references.

```tsx
const fallbackData = []
const features = tableFeatures({}) // Define outside component for stable reference

export default function MyComponent() {
  //✅ GOOD: `columns` is a stable reference
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ GOOD: `data` is a stable reference
  const [data, setData] = useState(() => [
    // ...
  ]);

  // Columns and data have stable references, so the table only recomputes when they actually change
  const table = useTable({
    features,
    columns,
    data: data ?? fallbackData, //also good to use a fallback array that is defined outside of the component (stable reference)
  });

  return <table>...</table>;
}
```

`React.useState` and `React.useMemo` are not the only ways to give your data a stable reference. You can also define your data outside of the component or use a 3rd party state management library like Redux, Zustand, or TanStack Query.

The main thing to avoid is defining the `data` array inside the same scope as the `useTable` call. That will cause the `data` array to be redefined on every render, which forces the table to rebuild every row on every render (and can loop forever when auto-reset features are involved).

```tsx
const features = tableFeatures({}) //❌ Also re-created on every render

export default function MyComponent() {
  //😵 BAD: `columns` is redefined as a new array on every render, so the column and header structures are rebuilt on every render!
  const columns = [
    // ...
  ];

  //😵 BAD: `data` is redefined as a new array on every render, so every row is rebuilt on every render!
  const data = [
    // ...
  ];

  //❌ Columns and data are defined in the same scope as `useTable` without stable references
  const table = useTable({
    features,
    columns,
    data: data ?? [], //❌ Also bad because the fallback array is re-created on every render
  });

  return <table>...</table>;
}
```

#### Memoize Data Transformations

Even if your source data already has a stable reference, transforming it inline destroys that stability. Something as simple as an inline `data.filter()` creates a brand new array on every render.

```tsx
export default function MyComponent() {
  //✅ GOOD (TanStack Query provides stable references to data automatically)
  const { data, isLoading } = useQuery({
    //...
  });

  const table = useTable({
    features,
    columns,
    //❌ BAD: This creates a new array on every render (destroys the stable reference)
    data: data?.filter(d => d.isActive) ?? fallbackData,
  });

  return <table>...</table>;
}
```

Instead, always memoize your data transformations. In React, this can be done with `useMemo` or similar.

```tsx
export default function MyComponent() {
  //✅ GOOD
  const { data, isLoading } = useQuery({
    //...
  });

  //✅ GOOD: `filteredData` only gets a new reference when `data` changes
  const filteredData = useMemo(() => data?.filter(d => d.isActive) ?? [], [data]);

  const table = useTable({
    features,
    columns,
    data: filteredData, // stable reference!
  });

  return <table>...</table>;
}
```

### How TanStack Table Transforms Data

Later, in other parts of these docs, you will see how TanStack Table processes the `data` that you pass to the table and generates the row and cell objects that are used to create the table. The `data` that you pass to the table is never mutated by TanStack Table, but the actual values in the rows and cells may be transformed by the accessors in your column definitions, or by other features performed by [row models](./row-models) like grouping or aggregation.

### How Much Data Can TanStack Table Handle?

Believe it or not, TanStack Table was actually built to scale up to handle potentially hundreds of thousands of rows of data in the client. This is obviously not always possible, depending on the size of each column's data and the number of columns. However, the sorting, filtering, pagination, and grouping features are all built with performance in mind for large datasets.

The default mindset of a developer building a data grid is to implement server-side pagination, sorting, and filtering for large datasets. This is still usually a good idea, but a lot of developers underestimate how much data can actually be handled in the client with modern browsers and the right optimizations. If your table will never have more than a few thousand rows, you can probably take advantage of the client-side features in TanStack Table instead of implementing them yourself on the server. Before committing to letting TanStack Table's client-side features handle your large dataset, you should test it with your actual data to see if it performs well enough for your needs, of course.

This is discussed in more detail in the [Pagination Guide](../framework/react/guide/pagination#should-you-use-client-side-pagination).
