const actions = {}
const types = new Set()

export { actions, types }

export const addActions = acts => {
  Object.keys(acts).forEach(key => {
    types.add(acts[key])
    actions[key] = acts[key]
  })
}
