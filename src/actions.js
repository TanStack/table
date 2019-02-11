const actions = {}

export { actions }

export const addActions = acts => {
  Object.keys(acts).forEach(key => {
    actions[key] = acts[key]
  })
}
