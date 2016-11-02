import { Render, Router, Route, IndexRoute } from 'jumpsuit'
//
import Layout from 'components/layout'
import Simple from 'screens/simple'
import ServerSide from 'screens/serverSide'

Render(null, (
  <Router>
    <Route path='/' component={Layout}>
      <IndexRoute component={Simple} />
      <Route path='simple' component={Simple} />
      <Route path='server-side' component={ServerSide} />
    </Route>
  </Router>
), {
  useHash: false
})
