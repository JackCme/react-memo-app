import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Write, MemoList } from 'components'
import { memoPostRequest, memoListRequest, memoEditRequest } from 'actions/memo'

export class Home extends Component {
    state = {
        loadingState: false
    }

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
    
    loadOldMemo = () => {
        if(this.props.isLast) {
            return new Promise((resolve, reject) => {
                resolve()
            })
        }

        //get id of the memo at bottom
        let lastId = this.props.memoData[this.props.memoData.length - 1]._id

        //start request
        return this.props.memoListRequest(false, 'old', lastId).then(
            () => {
                //if this is last page, notify
                if(this.props.isLast) {
                    Materialize.toast('You are reading the last page', 2000)
                }
            }
        )
    }

    handleEdit = (id, index,contents) => {
        return this.props.memoEditRequest(id, index, contents).then(
            () => {
                if(this.props.editStatus.status === 'SUCCESS') {
                    Materialize.toast('Success!', 2000)
                }
                else {
                    let errorMessage = [
                        'Something broke',
                        'Please write soemthing',
                        'You are not logged in',
                        'That memo does not exist anymore',
                        'You do not have permission'
                    ];

                    let error = this.props.editStatus.error

                    // NOTIFY ERROR
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error % 1000 - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);

                    if(error === 1003) {
                        setTimeout(() => {
                            this.props.location.reload(false)
                        }, 200);
                    }
                }
            }
        )
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
        
        const loadUntilScrollable = () => {
            //if scrollbar does not exist
            if ($("body").height() < $(window).height()) {
                this.loadOldMemo().then(
                    () => {
                        //do it recursively unless it's last page
                        if (!this.props.isLast) {
                            loadUntilScrollable()
                        }
                    }
                )
            }
        }

        $(window).scroll(() => {
            if($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
                if(!this.state.loadingState) {
                    this.loadOldMemo()
                    this.setState({
                        loadingState: true
                    })
                }
            }
            else {
                if(this.state.loadingState) {
                    this.setState({
                        loadingState: false
                    })
                }
            }
        })

        this.props.memoListRequest(true).then(
            () => {
                loadMemoLoop()
                loadUntilScrollable()
            }
        )
        
    }

    componentWillUnmount() {
        //stop loadmemoloop
        clearTimeout(this.memoLoaderTimeoutId)

        //remove window scroll listener
        $(window).unbind()
    }
    
    
    render() {
        const write = ( 
            <Write onPost={this.handlePost}/> 
        )
        return (
            <div className="wrapper">
                { this.props.isLoggedIn ? write : undefined }
                <MemoList data={this.props.memoData}
                    currentUser={this.props.currentUser}
                    onEdit={this.handleEdit}/>
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
        isLast: state.memo.list.isLast,
        editStatus: state.memo.edit
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        memoPostRequest: (contents) => {
            return dispatch(memoPostRequest(contents))
        },
        memoListRequest: (isInitial, listType, id, username) => {
            return dispatch(memoListRequest(isInitial, listType, id, username))
        },
        memoEditRequest: (id, index, contents) => {
            return dispatch(memoEditRequest(id, index, contents))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Home)
