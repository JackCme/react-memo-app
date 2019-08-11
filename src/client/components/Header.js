import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export class Header extends Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool,
        onLogout: PropTypes.func
    }

    static defaultProps = {
        isLoggedIn: false,
        onLogout: () => {
            console.error("onLoout not defined")
        }
        
    }
    render() {
        const loginButton = (
            <li>
                <a><i className="material-icons">vpn_key</i></a>
            </li>
        )
        const logoutButton = (
            <li>
                <a><i className="material-icons">lock_open</i></a>
            </li>
        )
        return (
            <nav>
                <div className="nav-wrapper blue darken-1">
                    <Link to="/" className="brand-logo center">Memopad</Link>
                    <ul>
                        <li><a><i className="material-icons">search</i></a></li>
                    </ul>
                    <div className="right">
                        <ul>
                            {this.props.isLoggedIn ? logoutButton : loginButton}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Header
