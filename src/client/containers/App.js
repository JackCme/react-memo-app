import React, { Component } from 'react'
import { Header } from 'components'
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from 'actions/authentication'
import { searchUserRequest } from 'actions/search'
import { Route } from 'react-router-dom'
import { Home, Login, Register, Wall } from 'containers'


export class App extends Component {

    componentDidMount() {
        //get cookie by name
        let getCookie = (name) => {
            let value = "; " + document.cookie
            let parts = value.split('; ' + name + '=')
            if(parts.length >= 2) 
                return parts.pop().split(";").shift()
        }
        
        //get logindata from cookie
        let loginData = getCookie('key')

        //if loginData is undefined, do noting
        if(typeof loginData === "undefined") return

        //decode base64 & parse json
        loginData = JSON.parse(atob(loginData))

        //if not logged in, do nothing
        if(!loginData.isLoggedIn) return

        this.props.getStatusRequest().then(
            () => {
                if(!this.props.status.valid) {
                    loginData = {
                        isLoggedIn: false,
                        username: ''
                    }

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData))
                    let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
                    Materialize.toast($toastContent, 4000);
                }

            }
        )
    }
    
    handleLogout = () => {
        this.props.logoutRequest().then(
            () => {
                Materialize.toast('Good Bye!', 2000)

                let loginData = {
                    isLoggedIn: false,
                    username: ''
                }

                document.cookie = 'key=' + btoa(JSON.stringify(loginData))
            }
        )
    }
    
    handleSearch = (keyword) => {
        this.props.searchUserRequest(keyword)
    }
    
    render() {
        //로그인 회원가입 페이지는 헤더 보이지 않게 하기
        let re = /(login|register)/
        let isAuth = re.test(this.props.location.pathname)

        return (
            <div>
                {isAuth ? undefined: <Header isLoggedIn={this.props.status.isLoggedIn}
                                            onLogout={this.handleLogout}
                                            onSearch={this.handleSearch}
                                            usernames={this.props.usernames}
                                            {...this.props}/>}

                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/wall/:username" component={Wall} />

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
        searchStatus: state.search.status,
        usernames: state.search.usernames
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getStatusRequest: () => {
            return dispatch(getStatusRequest())
        },
        logoutRequest: () => {
            return dispatch(logoutRequest())
        },
        searchUserRequest: (keyword) => {
            return dispatch(searchUserRequest(keyword))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App) 
