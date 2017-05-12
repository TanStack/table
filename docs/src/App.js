import React from 'react'
//
import ReactStory from '../../lib'

export default class App extends React.Component {
  render () {
    return (
      <ReactStory
        stories={[{
          name: 'Story 1',
          component: props => (
            <div>
              This is my first react-story!
              <br />
              <pre><code>{JSON.stringify(props, null, 2)}</code></pre>
            </div>
          )
        }, {
          name: 'Story 2',
          component: props => (
            <div>
              Hey! This is my second react-story!
              <br />
              <pre><code>{JSON.stringify(props, null, 2)}</code></pre>
            </div>
          )
        }, {
          name: 'Story 3',
          component: props => (
            <div>
              This is another one!
              <br />
              <pre><code>{JSON.stringify(props, null, 2)}</code></pre>
            </div>
          )
        }]}
      />
    )
  }
}
