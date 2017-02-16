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
      oldState.sorting !== newState.sorting
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
      // Handle collapseOnSortingChange & collapseOnPageChange
      if (
        (oldState.sorting !== newResolvedState.sorting && this.props.collapseOnSortingChange) ||
        (!newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData && this.props.collapseOnPageChange)
      ) {
        newResolvedState.expandedRows = {}
      }

      Object.assign(newResolvedState, this.getSortedData(newResolvedState))
    }

    // Calculate pageSize all the time
    if (newResolvedState.resolvedData) {
      newResolvedState.pages = newResolvedState.manual ? newResolvedState.pages : Math.ceil(newResolvedState.resolvedData.length / newResolvedState.pageSize)
    }

    return this.setState(newResolvedState, cb)
  }
}
