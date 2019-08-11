import React, { Component } from 'react'
import { Header } from 'components'


export class App extends Component {
    render() {
        //로그인 회원가입 페이지는 헤더 보이지 않게 하기
        let re = /(login|register)/
        let isAuth = re.test(this.props.location.pathname)

        return (
            <div>
                {isAuth ? undefined: <Header />}
                {this.props.children}
            </div>
        )
    }
}

export default App
