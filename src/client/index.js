import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { App, Home, Login, Register } from 'containers'


const rootElement = document.getElementById("root")
ReactDOM.render(
    <Router>
        <Route path="/" component={App}/> 
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
    </Router>, rootElement)

if (module.hot) {
    module.hot.accept()
}