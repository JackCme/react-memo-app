import React from 'react'
import ReactDOM from 'react-dom'
//Router
import { BrowserRouter as Router, Route } from 'react-router-dom'
//Components
import { App } from 'containers'
//Redux
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducers from 'reducers'
import thunk from 'redux-thunk'

const store = createStore(reducers, applyMiddleware(thunk))


const rootElement = document.getElementById("root")
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route path="/" component={App} />
        </Router>
    </Provider>
    , rootElement)

if (module.hot) {
    module.hot.accept()
}