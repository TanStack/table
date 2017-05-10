export default Base => class extends Base {

  componentWillMount () {
    this.setStateWithData(this.getDataModel(this.getResolvedState()))
  }

  componentDidMount () {
    this.fireFetchData()
  }

  componentWillReceiveProps (nextProps, nextState) {
    const oldState = this.getResolvedState()
    const newState = this.getResolvedState(nextProps, nextState)

    if (JSON.stringify(oldState.defaultSorted) !== JSON.stringify(newState.defaultSorted)) {
      newState.sorted = newState.defaultSorted
    }

    if ((oldState.showFilters !== newState.showFilters) ||
      (oldState.showFilters !== newState.showFilters)) {
      newState.filtered = newState.defaultFiltered
    }

    // Props that trigger a data update
    if (
      oldState.data !== newState.data ||
      oldState.columns !== newState.columns ||
      oldState.pivotBy !== newState.pivotBy ||
      oldState.sorted !== newState.sorted ||
      oldState.showFilters !== newState.showFilters ||
      oldState.filtered !== newState.filtered
    ) {
      this.setStateWithData(this.getDataModel(newState))
    }
  }

  setStateWithData (newState, cb) {
    const oldState = this.getResolvedState()
    const newResolvedState = this.getResolvedState({}, newState)
    const {freezeWhenExpanded} = newResolvedState

    // Default to unfrozen state
    newResolvedState.frozen = false

    // If freezeWhenExpanded is set, check for frozen conditions
    if (freezeWhenExpanded) {
      // if any rows are expanded, freeze the existing data and sorting
      const keys = Object.keys(newResolvedState.expanded)
      for (var i = 0; i < keys.length; i++) {
        if (newResolvedState.expanded[keys[i]]) {
          newResolvedState.frozen = true
          break
        }
      }
    }

    // If the data isn't frozen and either the data or
    // sorting model has changed, update the data
    if (
      (oldState.frozen && !newResolvedState.frozen) ||
      oldState.sorted !== newResolvedState.sorted ||
      oldState.filtered !== newResolvedState.filtered ||
      oldState.showFilters !== newResolvedState.showFilters ||
      (!newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData)
    ) {
      // Handle collapseOnsortedChange & collapseOnDataChange
      if (
        (oldState.sorted !== newResolvedState.sorted && this.props.collapseOnSortingChange) ||
        (oldState.filtered !== newResolvedState.filtered) ||
        (oldState.showFilters !== newResolvedState.showFilters) ||
        (!newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData && this.props.collapseOnDataChange)
      ) {
        newResolvedState.expanded = {}
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
