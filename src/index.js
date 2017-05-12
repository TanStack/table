import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
//
import Utils from './utils'

let uid = 0

const defaultProps = {
  stories: [],
  defaultComponent: () => <span>No story component found!</span>
}

export default class ReactStory extends React.Component {
  static defaultProps = defaultProps
  constructor () {
    super()
    this.state = {
      stories: []
    }
    this.rebuild = this.rebuild.bind(this)
  }
  componentWillMount () {
    this.rebuild()
  }
  componentWillReceiveProps (newProps) {
    const oldProps = this.props

    if (oldProps.stories !== newProps.stories) {
      this.rebuild()
    }
  }
  rebuild (props = this.props) {
    const {
      defaultComponent
    } = this.props

    const stories = props.stories.map(story => {
      const name = story.name || `Story ${uid++}`
      const path = story.path || Utils.makePath(name)
      const component = story.component || defaultComponent
      return {
        name,
        path,
        component
      }
    })
    this.setState({
      stories
    })
  }
  render () {
    const {
      stories
    } = this.state

    console.log(stories)

    return (
      <Router>
        <div>
          <div>
            <ul>
              {stories.map(story => (
                <li
                  key={story.path}
                >
                  <Link to={story.path}>
                    {story.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Switch>
              {stories.map(story => (
                <Route
                  key={story.path}
                  exact
                  path={'/' + story.path}
                  render={props => (
                    <story.component
                      story={story}
                      {...props}
                    />
                  )}
                />
              ))}
              <Redirect
                to={stories[0].path}
              />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}
