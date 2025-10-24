export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  subRows?: Person[]; // <-- Key to nesting!
};

export const defaultData: Person[] = [
  {
    firstName: 'Tanner',
    lastName: 'Linsley',
    age: 24,
    visits: 100,
    subRows: [ // These are the nested rows for Tanner
      {
        firstName: 'Kevin',
        lastName: 'Vandy',
        age: 27,
        visits: 200,
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        age: 45,
        visits: 20,
        subRows: [ // Deeper nesting is possible
          {
            firstName: 'Child',
            lastName: 'Doe',
            age: 5,
            visits: 1,
          },
        ],
      },
    ],
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    age: 40,
    visits: 80,
  },
];