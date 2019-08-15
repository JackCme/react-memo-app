import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Search } from 'components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

export class Header extends Component {
    /* TODO:
    - create search status
    - create toggleSearch method to toggle Search component
    */
    state = {
        isSearch: false
    }

    static propTypes = {
        isLoggedIn: PropTypes.bool,
        onLogout: PropTypes.func,
        onSearch: PropTypes.func,
        usernames: PropTypes.array,
    }

    static defaultProps = {
        isLoggedIn: false,
        onLogout: () => {
            console.error("onLoout not defined")
        },
        onSearch: () => {
            console.error("onSearch not defined")
        }
        
    }

    toggleSearch = () => {
        this.setState({
            isSearch: !this.state.isSearch
        })
    }

    handleSearch = (keyword) => {
        this.props.onSearch(keyword)
    }
    
    render() {
        const loginButton = (
            <li>
                <Link to="/login">
                    <i className="material-icons">vpn_key</i>
                </Link>
            </li>
        )
        const logoutButton = (
            <li>
                <a onClick={this.props.onLogout}><i className="material-icons">lock_open</i></a>
            </li>
        )
        const searchView = (
            <CSSTransition classNames="search-screen"
                timeout={300} in={this.state.isSearch} mountOnEnter={true} >
                <Search onClose={this.toggleSearch} onSearch={this.handleSearch} usernames={this.props.usernames} {...this.props}/>
            </CSSTransition>
        )
        return (
            <div>
                <nav>
                    <div className="nav-wrapper blue darken-1">
                        <Link to="/" className="brand-logo center">Memopad</Link>
                        <ul>
                            <li onClick={this.toggleSearch}><a><i className="material-icons">search</i></a></li>
                        </ul>
                        <div className="right">
                            <ul>
                                {this.props.isLoggedIn ? logoutButton : loginButton}
                            </ul>
                        </div>
                    </div>
                </nav>
                <TransitionGroup>
                    {this.state.isSearch
                        ? searchView
                        : undefined}
                </TransitionGroup>
            </div>
            
        )
    }
}



export default Header
