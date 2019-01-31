import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Pivot, PivotItem, Label } from "office-ui-fabric-react";
import { combineReducers, applyMiddleware, compose, createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter, connectRouter, routerMiddleware, push, RouterState } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';

const reducers = (history : History<any>) => combineReducers({
  router: connectRouter(history)
});

const history = createBrowserHistory();

const makeStore = function configureStore(preloadedState: {}) {
  const store = createStore(
    reducers(history),
    {},
    compose(
      applyMiddleware(routerMiddleware(history)
      ),
    ),
  )

  return store;
}

const store = makeStore({});

interface IBodyProps {
  path: string
}

const Body : React.SFC<IBodyProps> = ({ path }) => (
  <Pivot selectedKey={path.replace('/', '') || 'first'} onLinkClick={(item) => item && store.dispatch(push(item.props.itemKey || ""))}>
    <PivotItem headerText="My Files" itemKey="first">
      <Route path={['/first', '/']} component={() => <Label>Pivot #1</Label>} />
    </PivotItem>
    <PivotItem linkText="Recent" itemKey="second">
    <Route path="/second" component={() => <Label>Pivot #2</Label>} />
    </PivotItem>
    <PivotItem linkText="Shared with me" itemKey="third">
    <Route path="/third" component={() => <Label>Pivot #3</Label>} />
    </PivotItem>
  </Pivot>
);

interface IState {
  router: RouterState
}

const mstp = (state : IState) => {
  return {
    path: state.router.location.pathname
  };
};

const ConnectedBody = connect(mstp)(Body);

class App extends Component {
  render() {
    return (
      <div className="App">
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ConnectedBody />
        </ConnectedRouter>
      </Provider>
      </div>
    );
  }
}

export default App;
