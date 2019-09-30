import PropTypes from 'prop-types';

import { ensurePluginOrder } from '../utils';

const propTypes = {};

export const useAbsoluteLayout = (hooks) => {
  hooks.useMain.push(useMain);
};

useAbsoluteLayout.pluginName = 'useAbsoluteLayout';

const useMain = (instance) => {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useAbsoluteLayout');

  const {
    plugins,
    columns,
    headerGroups,
    hooks: { getRowProps, getHeaderGroupProps, getHeaderProps, getCellProps }
  } = instance;

  ensurePluginOrder(plugins, ['useColumnOrder', 'usePinColumns'], 'useAbsoluteLayout', []);

  // Calculating row widths
  let sumWidth = 0;
  const visibleColumns = columns.filter((column) => columnIsVisible(column));
  visibleColumns.forEach((column) => {
    const { width } = getSizesForColumn(column);
    sumWidth += width;
  });

  const rowStyles = {
    style: {
      position: 'relative',
      width: `${sumWidth}px`
    }
  };

  getRowProps.push(() => rowStyles);
  getHeaderGroupProps.push(() => rowStyles);

  // Calculating column/cells widths
  const cellStyles = {
    position: 'absolute',
    top: 0
  };

  const columnCalcMap = new WeakMap();

  headerGroups.forEach(({ headers }) => {
    let left = 0;
    headers.forEach((column) => {
      const { width } = getSizesForColumn(column);
      columnCalcMap.set(column, { width: `${width}px`, left: `${left}px` });
      if (columnIsVisible(column)) {
        left += width;
      }
    });
  });

  getHeaderProps.push((column) => {
    return {
      style: {
        ...cellStyles,
        ...columnCalcMap.get(column)
      }
    };
  });

  getCellProps.push((cell) => {
    return {
      style: {
        ...cellStyles,
        ...columnCalcMap.get(cell.column)
      }
    };
  });

  return instance;
};

function getColWidth({ width, minWidth = 0, maxWidth = Number.MAX_SAFE_INTEGER }) {
  let num = width;
  num = num > maxWidth ? maxWidth : num;
  num = num < minWidth ? minWidth : num;
  return num;
}

function sum(arr) {
  return arr.reduce((prev, curr) => prev + curr, 0);
}

function columnIsVisible(col) {
  return col.isVisible || col.show;
}

function getSizesForColumn(columnArg) {
  let { columns } = columnArg;

  if (columns) {
    columns = columns
      .filter((col) => columnIsVisible(col))
      .map((column) => getSizesForColumn(column))
      .filter(Boolean);

    if (!columns.length) {
      return false;
    }

    const width = sum(columns.map((col) => col.width));

    return {
      width
    };
  }

  if (columnArg.placeholderOf) {
    return getSizesForColumn(columnArg.placeholderOf);
  }

  return {
    width: getColWidth(columnArg)
  };
}
