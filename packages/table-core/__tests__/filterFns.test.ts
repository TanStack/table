import { createRow, createTable, filterFns, getCoreRowModel } from '../src';

const ColumnId = 'col';

let table = createTable({
  data: [],
  state: {},
  getCoreRowModel: getCoreRowModel(),
  onStateChange: () => {
  },
  renderFallbackValue: () => {
  },
  columns: [{
    accessorKey: 'prop',
    id: ColumnId,
  }],
});

const createRowWithValue = (value: unknown) => createRow(
  table,
  'A',
  { prop: value },
  1,
  0,
  [],
);

describe('includesString', () => {
  test.each([
    ['somestring'],
    [null],
    [undefined],
  ])('removes "%s"', (value) => {
    expect(
      filterFns.includesString(
        createRowWithValue(value),
        ColumnId,
        'lorem',
        () => {
        },
      ),
    ).toBe(false);
  });

  test.each([
    ['lorem'],
    ['Lorem'],
    ['LOREM'],
    ['moreLoremIpsum'],
  ])('is satisfied by "%s"', (value) => {
    expect(
      filterFns.includesString(
        createRowWithValue(value),
        ColumnId,
        'lorem',
        () => {
        },
      ),
    ).toBe(true);
  });
});

describe('includesStringSensitive', () => {
  test.each([
    ['somestring'],
    [null],
    [undefined],
    ['lorem'],
    ['LOREM'],
  ])('removes "%s"', (value) => {
    expect(
      filterFns.includesStringSensitive(
        createRowWithValue(value),
        ColumnId,
        'Lorem',
        () => {
        },
      ),
    ).toBe(false);
  });

  test.each([
    ['Lorem'],
    ['moreLoremIpsum'],
  ])('is satisfied by "%s"', (value) => {
    expect(
      filterFns.includesStringSensitive(
        createRowWithValue(value),
        ColumnId,
        'Lorem',
        () => {
        },
      ),
    ).toBe(true);
  });
});

describe('equalsString', () => {
  test.each([
    ['somestring'],
    [null],
    [undefined],
    ['moreLoremIpsum'],
  ])('removes "%s"', (value) => {
    expect(
      filterFns.equalsString(
        createRowWithValue(value),
        ColumnId,
        'Lorem',
        () => {
        },
      ),
    ).toBe(false);
  });

  test.each([
    ['lorem'],
    ['Lorem'],
    ['LOREM'],
  ])('is satisfied by "%s"', (value) => {
    expect(
      filterFns.equalsString(
        createRowWithValue(value),
        ColumnId,
        'Lorem',
        () => {
        },
      ),
    ).toBe(true);
  });
});

