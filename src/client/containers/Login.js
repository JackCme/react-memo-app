import React, { Component } from 'react'
import { Authentication } from 'components'
export class Login extends Component {
    render() {
        return (
            <div>
                <Authentication
                    mode={true}/>
            </div>
        )
    }
}

export default Login
