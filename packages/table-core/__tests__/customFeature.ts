/**
 * @module extensions/features/range-selection
 * @reference
 * - https://www.w3schools.com/googlesheets/google_sheets_ranges.php
 */

import { TableFeature } from "../src";

export type RangeState = Record<string, true>;
export interface CustomTableState {
    /**
     * contains all selected cell Ids except current selecting range, once current selecting range is finished it moves to selectedCellIds
     */
    range: RangeState

    /**
     * contains cell Ids of currently selecting range. It is a state when user is currently performing range selection
     */
    currentRange: RangeState

    /**
     * State which tells whether user is performing range selection
     */
    isChangingRange: boolean
}

export const CustomFeature: TableFeature = {
    getInitialState: (state): CustomTableState => {
        return {
            range: {},
            currentRange: {},
            isChangingRange: false,
          ...state,
        }
    },
};
