import { State } from 'jumpsuit'
import _ from 'lodash'
import axios from 'axios'

const githubState = State('counter', {
  initial: {
    search: null,
    loading: false,
    user: {}
  },

  updateSearch: (state, payload) => ({
    search: payload,
    loading: true
  }),

  receiveUser: (state, payload) => ({
    user: payload,
    loading: false
  })
})

export default githubState

const getUserDebounced = _.debounce((username) => {
  axios.get(`https://api.github.com/users/${username}`)
    .then(({ data }) => {
      githubState.receiveUser(data)
    })
    .catch((err) => {
      githubState.receiveUser({})
      console.error(err)
    })
}, 1000)

export function getUser (username) {
  githubState.updateSearch(username)
  if (username) getUserDebounced(username)
}
