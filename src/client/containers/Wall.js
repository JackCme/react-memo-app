import React, { Component } from 'react'
import { Home } from 'containers'

export class Wall extends Component {
    render() {
        return (
            <Home username={this.props.match.params.username}/>
        )
    }
}

export default Wall
