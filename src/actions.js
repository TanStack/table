const actions = {}
const types = {}

export { actions, types }

export const addActions = (...acts) => {
  acts.forEach(action => {
    if (actions[action]) {
      throw new Error(
        `An React Table action type called ${action} has already been registered!`
      )
    }
    // Action values are formatted this way to discourage
    // you (the dev) from interacting with them in any way
    // other than importing `{ actions } from 'react-table'`
    // and referencing an action via `actions[actionName]`
    actions[action] = `React Table Action: ${action}`
    types[actions[action]] = true
  })
}
