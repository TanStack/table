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
      expandedRows: {}
    }
  },

  getResolvedState (props, state) {
    const resolvedState = {
      ..._.compactObject(this.state),
      ..._.compactObject(state),
      ..._.compactObject(this.props),
      ..._.compactObject(props)
    }
    return resolvedState
  },

  componentWillMount () {
    this.setStateWithData(this.getDataModel())
  },

  componentDidMount () {
    this.fireOnChange()
  },

  componentWillReceiveProps (nextProps, nextState) {
    const oldState = this.getResolvedState()
    const newState = this.getResolvedState(nextProps, nextState)

    // Props that trigger a data update
    if (
      oldState.data !== newState.data ||
      oldState.columns !== newState.columns ||
      oldState.pivotBy !== newState.pivotBy ||
      oldState.sorting !== newState.sorting ||
      oldState.page !== newState.page
    ) {
      this.setStateWithData(this.getDataModel(nextProps, nextState))
    }
  },

  setStateWithData (newState, cb) {
    const oldState = this.getResolvedState()
    const newResolvedState = this.getResolvedState({}, newState)
    const { freezeWhenExpanded } = newResolvedState

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
      (!newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData)
    ) {
      Object.assign(newResolvedState, this.getSortedData(newResolvedState))
    }

    // Handle collapseOnSortingChange & collapseOnPageChange & collapseOnDataChange
    if (
      (oldState.sorting !== newResolvedState.sorting && this.props.collapseOnSortingChange) ||
      (oldState.page !== newResolvedState.page && this.props.collapseOnPageChange) ||
      (!newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData && this.props.collapseOnDataChange)
    ) {
      newResolvedState.expandedRows = {}
    }

    // Calculate pageSize all the time
    if (newResolvedState.resolvedData) {
      newResolvedState.pages = newResolvedState.manual ? newResolvedState.pages : Math.ceil(newResolvedState.resolvedData.length / newResolvedState.pageSize)
    }

    return this.setState(newResolvedState, cb)
  }
}
