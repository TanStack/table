import _ from './utils'
import defaultProps from './defaultProps'

export default {
  getDefaultProps () {
    return defaultProps
  },

  getInitialState () {
    return {
      page: 0,
      pageSize: this.props.defaultPageSize || 10,
      sorting: this.props.defaultSorting,
      expandedRows: {},
      filtering: this.props.defaultFiltering
    }
  },

  getResolvedState (props, state) {
    const resolvedState = {
      ..._.compactObject(this.state),
      ..._.compactObject(this.props),
      ..._.compactObject(state),
      ..._.compactObject(props)
    }
    return resolvedState
  },

  componentWillMount () {
    this.setStateWithData(this.getDataModel(this.getResolvedState()))
  },

  componentDidMount () {
    this.fireOnChange()
  },

  componentWillReceiveProps (nextProps, nextState) {
    const oldState = this.getResolvedState()
    const newState = this.getResolvedState(nextProps, nextState)

    if (oldState.defaultSorting !== newState.defaultSorting) {
      newState.sorting = newState.defaultSorting
    }

    if ((oldState.showFilters !== newState.showFilters) ||
      (oldState.showFilters !== newState.showFilters)) {
      newState.filtering = newState.defaultFiltering
    }

    // Props that trigger a data update
    if (
      oldState.data !== newState.data ||
      oldState.columns !== newState.columns ||
      oldState.pivotBy !== newState.pivotBy ||
      oldState.sorting !== newState.sorting ||
      oldState.showFilters !== newState.showFilters ||
      oldState.filtering !== newState.filtering
    ) {
      this.setStateWithData(this.getDataModel(newState))
    }
  },

  setStateWithData (newState, cb) {
    const oldState = this.getResolvedState()
    const newResolvedState = this.getResolvedState({}, newState)
    const {freezeWhenExpanded} = newResolvedState

    // Default to unfrozen state
    newResolvedState.frozen = false

    // If freezeWhenExpanded is set, check for frozen conditions
    if (freezeWhenExpanded) {
      // if any rows are expanded, freeze the existing data and sorting
      const keys = Object.keys(newResolvedState.expandedRows)
      for (var i = 0; i < keys.length; i++) {
        if (newResolvedState.expandedRows[keys[i]]) {
          newResolvedState.frozen = true
          break
        }
      }
    }

    // If the data isn't frozen and either the data or
    // sorting model has changed, update the data
    if (
      (oldState.frozen && !newResolvedState.frozen) ||
      oldState.sorting !== newResolvedState.sorting ||
      oldState.filtering !== newResolvedState.filtering ||
      oldState.showFilters !== newResolvedState.showFilters ||
      (!newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData)
    ) {
      // Handle collapseOnSortingChange & collapseOnDataChange
      if (
        (oldState.sorting !== newResolvedState.sorting && this.props.collapseOnSortingChange) ||
        (oldState.filtering !== newResolvedState.filtering) ||
        (oldState.showFilters !== newResolvedState.showFilters) ||
        (!newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData && this.props.collapseOnDataChange)
      ) {
        newResolvedState.expandedRows = {}
      }

      Object.assign(newResolvedState, this.getSortedData(newResolvedState))
    }

    // Calculate pageSize all the time
    if (newResolvedState.sortedData) {
      newResolvedState.pages = newResolvedState.manual ? newResolvedState.pages : Math.ceil(newResolvedState.sortedData.length / newResolvedState.pageSize)
      newResolvedState.page = Math.max(newResolvedState.page >= newResolvedState.pages ? newResolvedState.pages - 1 : newResolvedState.page, 0)
    }

    return this.setState(newResolvedState, cb)
  }
}
