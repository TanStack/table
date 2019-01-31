const mergeStateAndProps = (state, defaults, props) => {
  Object.keys(props).forEach(key => {
    if (typeof props[key] !== 'undefined') {
      state[key] = props[key]
    }
  })

  Object.keys(defaults).forEach(key => {
    if (typeof state[key] === 'undefined') {
      state[key] = defaults[key]
    }
  })

  return state
}

export default function useControlledState ([userState, userSetState], defaults, props) {
  const state = mergeStateAndProps(userState, defaults, props)

  const setState = (updater, type) =>
    userSetState(old => updater(mergeStateAndProps(old, defaults, props)), type)

  return [state, setState]
}
