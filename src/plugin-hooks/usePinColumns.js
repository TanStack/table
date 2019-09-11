import React from 'react';
import PropTypes from 'prop-types';

import { ensurePluginOrder, getFirstDefined } from '../utils';
import { addActions, actions } from '../actions';
import { defaultState } from '../hooks/useTableState';

defaultState.pinnedColumns = {};

addActions('setColumnPin');

const propTypes = {};

export const usePinColumns = (hooks) => {
  hooks.columnsBeforeHeaderGroupsDeps.push((deps, instance) => {
    return [...deps, instance.state[0].pinnedColumns];
  });
  hooks.columnsBeforeHeaderGroups.push(columnsBeforeHeaderGroups);
  hooks.useMain.push(useMain);
};

usePinColumns.pluginName = 'usePinColumns';

function columnsBeforeHeaderGroups(columns, instance) {
  const {
    state: [{ pinnedColumns }]
  } = instance;

  let colPinInfo = {
    left: [],
    right: [],
    center: []
  };

  columns.forEach((column) => {
    const pinValue = pinnedColumns[column.id];

    // -1 = LEFT
    // 0 = CENTER
    // 1 = RIGHT

    switch (pinValue) {
      case -1:
        colPinInfo.left.push(column);
        break;
      case 1:
        colPinInfo.right.push(column);
        break;
      default:
        colPinInfo.center.push(column);
    }
  });

  return [...colPinInfo.left, ...colPinInfo.center, ...colPinInfo.right];
}

function useMain(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'usePinColumns');

  const {
    plugins,
    flatHeaders,
    disablePinning,
    state: [{ pinnedColumns }, setState]
  } = instance;

  ensurePluginOrder(plugins, ['useColumnOrder'], 'usePinColumns', []);

  const setColumnPin = React.useCallback(
    (updater) => {
      return setState((old) => {
        return {
          ...old,
          pinnedColumns: typeof updater === 'function' ? updater(old.pinnedColumns) : updater
        };
      }, actions.setColumnPin);
    },
    [setState]
  );

  flatHeaders.forEach((column) => {
    const { disablePinning: columnDisablePinning, accessor } = column;

    const canPin = accessor
      ? getFirstDefined(
          columnDisablePinning === true ? false : undefined,
          disablePinning === true ? false : undefined,
          true
        )
      : false;

    column.canPin = canPin;

    column.pinType = pinnedColumns[column.id] || 0;

    column.setColumnPin = (pinType) => {
      column.pinType = pinType;
      setColumnPin({
        ...pinnedColumns,
        [column.id]: pinType
      });
    };

    column.toggleColumnPin = (pinType) => {
      let setPinValue = column.pinType === pinType ? 0 : pinType;
      column.setColumnPin(setPinValue);
    };
  });

  return {
    ...instance,
    setColumnPin
  };
}
