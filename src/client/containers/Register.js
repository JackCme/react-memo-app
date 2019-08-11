import React, { Component } from 'react'
import { Authentication } from 'components'
export class Register extends Component {
    render() {
        return (
            <div>
                <Authentication
                    mode={false}/>
            </div>
        )
    }
}

export default Register
