"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.init = init;
exports.shouldUpdateScroll = shouldUpdateScroll;
exports.RouteUpdates = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _loader = _interopRequireWildcard(require("./loader"));

var _redirects = _interopRequireDefault(require("./redirects.json"));

var _apiRunnerBrowser = require("./api-runner-browser");

var _emitter = _interopRequireDefault(require("./emitter"));

var _routeAnnouncerProps = require("./route-announcer-props");

var _router = require("@reach/router");

var _history = require("@reach/router/lib/history");

var _gatsbyLink = require("gatsby-link");

// Convert to a map for faster lookup in maybeRedirect()
const redirectMap = _redirects.default.reduce((map, redirect) => {
  map[redirect.fromPath] = redirect;
  return map;
}, {});

function maybeRedirect(pathname) {
  const redirect = redirectMap[pathname];

  if (redirect != null) {
    if (process.env.NODE_ENV !== `production`) {
      const pageResources = _loader.default.loadPageSync(pathname);

      if (pageResources != null) {
        console.error(`The route "${pathname}" matches both a page and a redirect; this is probably not intentional.`);
      }
    }

    window.___replace(redirect.toPath);

    return true;
  } else {
    return false;
  }
}

const onPreRouteUpdate = (location, prevLocation) => {
  if (!maybeRedirect(location.pathname)) {
    (0, _apiRunnerBrowser.apiRunner)(`onPreRouteUpdate`, {
      location,
      prevLocation
    });
  }
};

const onRouteUpdate = (location, prevLocation) => {
  if (!maybeRedirect(location.pathname)) {
    (0, _apiRunnerBrowser.apiRunner)(`onRouteUpdate`, {
      location,
      prevLocation
    });
  }
};

const navigate = (to, options = {}) => {
  let {
    pathname
  } = (0, _gatsbyLink.parsePath)(to);
  const redirect = redirectMap[pathname]; // If we're redirecting, just replace the passed in pathname
  // to the one we want to redirect to.

  if (redirect) {
    to = redirect.toPath;
    pathname = (0, _gatsbyLink.parsePath)(to).pathname;
  } // If we had a service worker update, no matter the path, reload window and
  // reset the pathname whitelist


  if (window.___swUpdated) {
    window.location = pathname;
    return;
  } // Start a timer to wait for a second before transitioning and showing a
  // loader in case resources aren't around yet.


  const timeoutId = setTimeout(() => {
    _emitter.default.emit(`onDelayedLoadPageResources`, {
      pathname
    });

    (0, _apiRunnerBrowser.apiRunner)(`onRouteUpdateDelayed`, {
      location: window.location
    });
  }, 1000);

  _loader.default.loadPage(pathname).then(pageResources => {
    // If no page resources, then refresh the page
    // Do this, rather than simply `window.location.reload()`, so that
    // pressing the back/forward buttons work - otherwise when pressing
    // back, the browser will just change the URL and expect JS to handle
    // the change, which won't always work since it might not be a Gatsby
    // page.
    if (!pageResources || pageResources.status === _loader.PageResourceStatus.Error) {
      window.history.replaceState({}, ``, location.href);
      window.location = pathname;
      clearTimeout(timeoutId);
      return;
    } // If the loaded page has a different compilation hash to the
    // window, then a rebuild has occurred on the server. Reload.


    if (process.env.NODE_ENV === `production` && pageResources) {
      if (pageResources.page.webpackCompilationHash !== window.___webpackCompilationHash) {
        // Purge plugin-offline cache
        if (`serviceWorker` in navigator && navigator.serviceWorker.controller !== null && navigator.serviceWorker.controller.state === `activated`) {
          navigator.serviceWorker.controller.postMessage({
            gatsbyApi: `clearPathResources`
          });
        }

        console.log(`Site has changed on server. Reloading browser`);
        window.location = pathname;
      }
    }

    (0, _router.navigate)(to, options);
    clearTimeout(timeoutId);
  });
};

function shouldUpdateScroll(prevRouterProps, {
  location
}) {
  const {
    pathname,
    hash
  } = location;
  const results = (0, _apiRunnerBrowser.apiRunner)(`shouldUpdateScroll`, {
    prevRouterProps,
    // `pathname` for backwards compatibility
    pathname,
    routerProps: {
      location
    },
    getSavedScrollPosition: args => this._stateStorage.read(args)
  });

  if (results.length > 0) {
    // Use the latest registered shouldUpdateScroll result, this allows users to override plugin's configuration
    // @see https://github.com/gatsbyjs/gatsby/issues/12038
    return results[results.length - 1];
  }

  if (prevRouterProps) {
    const {
      location: {
        pathname: oldPathname
      }
    } = prevRouterProps;

    if (oldPathname === pathname) {
      // Scroll to element if it exists, if it doesn't, or no hash is provided,
      // scroll to top.
      return hash ? decodeURI(hash.slice(1)) : [0, 0];
    }
  }

  return true;
}

function init() {
  // The "scroll-behavior" package expects the "action" to be on the location
  // object so let's copy it over.
  _history.globalHistory.listen(args => {
    args.location.action = args.action;
  });

  window.___push = to => navigate(to, {
    replace: false
  });

  window.___replace = to => navigate(to, {
    replace: true
  });

  window.___navigate = (to, options) => navigate(to, options); // Check for initial page-load redirect


  maybeRedirect(window.location.pathname);
}

class RouteAnnouncer extends _react.default.Component {
  constructor(props) {
    super(props);
    this.announcementRef = _react.default.createRef();
  }

  componentDidUpdate(prevProps, nextProps) {
    requestAnimationFrame(() => {
      let pageName = `new page at ${this.props.location.pathname}`;

      if (document.title) {
        pageName = document.title;
      }

      const pageHeadings = document.getElementById(`gatsby-focus-wrapper`).getElementsByTagName(`h1`);

      if (pageHeadings && pageHeadings.length) {
        pageName = pageHeadings[0].textContent;
      }

      const newAnnouncement = `Navigated to ${pageName}`;
      const oldAnnouncement = this.announcementRef.current.innerText;

      if (oldAnnouncement !== newAnnouncement) {
        this.announcementRef.current.innerText = newAnnouncement;
      }
    });
  }

  render() {
    return _react.default.createElement("div", (0, _extends2.default)({}, _routeAnnouncerProps.RouteAnnouncerProps, {
      ref: this.announcementRef
    }));
  }

} // Fire on(Pre)RouteUpdate APIs


class RouteUpdates extends _react.default.Component {
  constructor(props) {
    super(props);
    onPreRouteUpdate(props.location, null);
  }

  componentDidMount() {
    onRouteUpdate(this.props.location, null);
  }

  componentDidUpdate(prevProps, prevState, shouldFireRouteUpdate) {
    if (shouldFireRouteUpdate) {
      onRouteUpdate(this.props.location, prevProps.location);
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      onPreRouteUpdate(this.props.location, prevProps.location);
      return true;
    }

    return false;
  }

  render() {
    return _react.default.createElement(_react.default.Fragment, null, this.props.children, _react.default.createElement(RouteAnnouncer, {
      location: location
    }));
  }

}

exports.RouteUpdates = RouteUpdates;
RouteUpdates.propTypes = {
  location: _propTypes.default.object.isRequired
};