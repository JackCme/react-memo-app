import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Write } from 'components'
import { memoPostRequest } from 'actions/memo'

export class Home extends Component {
    handlePost = (contents) => {
        return this.props.memoPostRequest(contents).then(
            () => {
                if(this.props.postStatus.status === 'SUCCESS') {
                    //trigger load new memo to be implemented
                    Materialize.toast('Success!', 2000)
                }
                else {
                    let $toastContent
                    switch (this.props.postStatus.error) {
                        case 1001:
                            // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
                            $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>')
                            Materialize.toast($toastContent, 2000)
                            setTimeout(() => { this.props.history.push('/login') }, 2000)
                            break

                        case 1002:
                            $toastContent = $('<span style="color: #FFB4BA">Invalid content</span>');
                            Materialize.toast($toastContent, 2000);
                            break

                        case 1003:
                            $toastContent = $('<span style="color: #FFB4BA">Please write something</span>')
                            Materialize.toast($toastContent, 2000)
                            break
                        default:
                            break;
                    }
                }
            }
        )
    }
    
    render() {
        const write = ( 
            <Write onPost={this.handlePost}/> 
        )
        return (
            <div className="wrapper">
                { this.props.isLoggedIn ? write : undefined }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.status.isLoggedIn,
        postStatus: state.memo.post
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home)
