import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Write, MemoList } from 'components'
import { memoPostRequest, memoListRequest } from 'actions/memo'

export class Home extends Component {
    handlePost = (contents) => {
        return this.props.memoPostRequest(contents).then(
            () => {
                if(this.props.postStatus.status === 'SUCCESS') {
                    //trigger load new memo
                    this.loadNewMemo().then(
                        () => {
                            Materialize.toast('Success!', 2000)
                        }
                    )
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

    loadNewMemo = () => {
        //cancel if there is a pending request
        if(this.props.listStatus === 'WAITING') {
            return new Promise((resolve, reject) => {
                resolve()
            })
        }

        //if page is empty, do the initial loading
        if(this.props.memoData.length === 0) {
            return this.props.memoListRequest(true)
        }

        return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id)
    }
    
    
    componentDidMount() {
        //load new memo every 5sec
        const loadMemoLoop = () => {
            this.loadNewMemo().then(
                () => {
                    this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000)
                }
            )
        }
        
        this.props.memoListRequest(true).then(
            () => {
                loadMemoLoop()
            }
        )
    }

    componentWillUnmount() {
        //stop loadmemoloop
        clearTimeout(this.memoLoaderTimeoutId)
    }
    
    
    render() {
        const write = ( 
            <Write onPost={this.handlePost}/> 
        )
        return (
            <div className="wrapper">
                { this.props.isLoggedIn ? write : undefined }
                <MemoList data={this.props.memoData}
                    currentUser={this.props.currentUser}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.authentication.status.isLoggedIn,
        postStatus: state.memo.post,
        currentUser: state.authentication.status.currentUser,
        memoData: state.memo.list.data,
        listStatus: state.memo.list.status,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents))
        },
        memoListRequest: (isInitial, listType, id, username) => {
            return dispatch(memoListRequest(isInitial, listType, id, username))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home)
