import React from 'react';
import PropTypes from 'prop-types';

import { defaultState } from '../../react-table/hooks/useTable';
import { addActions, actions } from '../../react-table/actions';
import { determineHeaderVisibility } from '../../react-table/utils';

addActions('setColumnVisibility');

defaultState.hiddenColumns = [];

const propTypes = {};

export const useColumnVisibility = (hooks) => {
  hooks.useBeforeDimensions.push(useBeforeDimensions);
};

useColumnVisibility.pluginName = 'useColumnVisibility';

function useBeforeDimensions(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useColumnVisibility');

  const {
    flatHeaders,
    state: { hiddenColumns },
    setState
  } = instance;

  const setColumnVisibility = React.useCallback(
    (updater) => {
      return setState((old) => {
        return {
          ...old,
          columnOrder: [...old.columnOrder], // FixMe: hack
          hiddenColumns: typeof updater === 'function' ? updater(old.hiddenColumns) : updater
        };
      }, actions.setColumnVisibility);
    },
    [setState]
  );

  flatHeaders.forEach((column) => {
    column.show = !hiddenColumns.includes(column.id);

    column.setColumnVisibility = (show) => {
      column.show = show;
      const newhiddenColumns = new Set(hiddenColumns);

      if (show) {
        newhiddenColumns.delete(column.id);
      } else {
        newhiddenColumns.add(column.id);
      }

      setColumnVisibility(Array.from(newhiddenColumns));
    };

    column.toggleColumnVisibility = () => {
      column.setColumnVisibility(!column.show);
    };
  });

  determineHeaderVisibility(instance);

  return {
    ...instance,
    setColumnVisibility
  };
}
