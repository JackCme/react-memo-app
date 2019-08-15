import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export class Search extends Component {
    constructor(props) {
        super(props)
        document.onkeydown = (evt) => {
            evt = evt || window.event
            if(evt.keyCode == 27) {
                this.handleClose()
            }
        }
    }

    state = {
        keyword: ''
    }

    handleClose = () => {
        this.handleSearch('')
        document.onkeydown = null
        this.props.onClose()
    }
    
    handleChange = (e) => {
        this.setState({
            keyword: e.target.value
        })
        this.handleSearch(e.target.value)
    }
    
    handleSearch = (keyword) => {
        this.props.onSearch(keyword)
    }

    handleKeyDown = (e) => {
        if(e.keyCode === 13) {
            if(this.props.usernames.length > 0) {
                this.props.history.push('/wall/' + this.props.usernames[0].username)
                this.handleClose()
            }
        }
    }
    
    
    componentDidMount() {
        this.searchInput.focus()
    }
    

    render() {
        const mapDataToLinks = (data) => {
            //TODO: map data array to array of link components
            //create links to '/wall/:username'
            return data.map((user, i) => {
                return (
                    <Link to={`/wall/${user.username}`}
                        key={user._id}
                        onClick={this.handleClose}>
                            {user.username}
                    </Link>

                )
            })
        }
        
        return (
            <div className="search-screen white-text">
                <nav>
                    <div className="nav-wrapper blue darken-3">
                        <ul>
                            <li>
                                <a onClick={this.handleClose}><i className="material-icons">close</i></a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    <input placeholder="Search a user"
                        value={this.state.keyword}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        ref={(input) => {this.searchInput = input}}></input>
                    <ul className="search-results">
                        {mapDataToLinks(this.props.usernames)}
                    </ul>

                </div>
            </div>
        )
    }
}

Search.propTypes = {
    onClose: PropTypes.func,
    onSearch: PropTypes.func,
    usernames: PropTypes.array
}

Search.defaultProps = {
    onClose: () => {
        console.error('onClose not defined')
    },
    onSearch: () => {
        console.error('onSearch not defined')    
    },
    usernames: []
    
    
}

export default Search
