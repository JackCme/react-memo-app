import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Write, MemoList } from 'components'
import { 
    memoPostRequest,
    memoListRequest, 
    memoEditRequest, 
    memoRemoveRequest,
    memoStarRequest } from 'actions/memo'
import PropTypes from 'prop-types'

export class Home extends Component {
    state = {
        loadingState: false,
        initiallyLoaded: false,
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
            return this.props.memoListRequest(true, undefined, undefined, this.props.username)
        }

        return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id, this.props.username)
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
        return this.props.memoListRequest(false, 'old', lastId, this.props.username).then(
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
                        console.log(this.props.location)
                        setTimeout(() => {
                            this.props.history.replace(this.props.location.pathname)
                        }, 200);
                    }
                }
            }
        )
    }
    
    handleRemove = (id, index) => {
        this.props.memoRemoveRequest(id, index).then(
            () => {
                if(this.props.removeStatus.status === 'SUCCESS') {
                    //load more memo if there is no scroll bar
                    //1sec later. (animation takes 1sec)
                    setTimeout(() => {
                        if($("body").height() < $(window).height()) {
                            this.loadOldMemo()
                        }
                    }, 1000);
                }
                else {
                    let errorMessage = [
                        'Something broke',
                        'You are not logged in',
                        'That memo does not exist',
                        'You do not have permission'
                    ];

                    // NOTIFY ERROR
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.removeStatus.error % 1000 - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);


                    // IF NOT LOGGED IN, REFRESH THE PAGE
                    if (this.props.removeStatus.error === 2) {
                        setTimeout(() => { this.props.history.replace(this.props.location.pathname) }, 2000);
                    }
                }
            }
        )
    }
    
    handleStar = (id, index) => {
        this.props.memoStarRequest(id, index).then(
            () => {
                if(this.props.starStatus.status !== 'SUCCESS') {
                    let errorMessage = [
                        'Something broke',
                        'You are not logged in',
                        'That memo does not exist'
                    ];


                    // NOTIFY ERROR
                    let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.starStatus.error % 1000 - 1] + '</span>');
                    Materialize.toast($toastContent, 2000);


                    // IF NOT LOGGED IN, REFRESH THE PAGE
                    if (this.props.starStatus.error === 2) {
                        setTimeout(() => { this.props.history.replace(this.props.location.pathname) }, 2000);
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

        this.props.memoListRequest(true, undefined, undefined, this.props.username).then(
            () => {
                setTimeout(loadUntilScrollable, 1000)
                loadMemoLoop()
                this.setState({
                    initiallyLoaded: true
                })
            }
        )
        
    }

    componentWillUnmount() {
        //stop loadmemoloop
        clearTimeout(this.memoLoaderTimeoutId)

        //remove window scroll listener
        $(window).unbind()

        this.setState({
            initiallyLoaded: false
        })
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(this.props.username !== prevProps.username) {
            this.componentWillUnmount()
            this.componentDidMount()
        }
    }
    
    render() {
        const write = ( 
            <Write onPost={this.handlePost}/> 
        )

        const emptyView = (
            <div className="container">
                <div className="empty-page">
                    <b>{this.props.username}</b> isn't registered or hasn't written any memo
                </div>
            </div>
        )

        const wallHeader = (
            <div>
                <div className="container wall-info">
                    <div className="card wall-info blue lighten-2 white-text">
                        <div className="card-content">
                            {this.props.username}
                        </div>
                    </div>
                </div>
                {this.props.memoData.length === 0 && this.state.initiallyLoaded 
                    ? emptyView 
                    : undefined}
            </div>
        )

        return (
            <div className="wrapper">
                { typeof this.props.username !== "undefined"
                    ? wallHeader
                    : undefined }
                { this.props.isLoggedIn && typeof this.props.username === "undefined" 
                    ? write 
                    : undefined }
                <MemoList data={this.props.memoData}
                    currentUser={this.props.currentUser}
                    onEdit={this.handleEdit}
                    onRemove={this.handleRemove}
                    onStar={this.handleStar}/>
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
        editStatus: state.memo.edit,
        removeStatus: state.memo.remove,
        starStatus: state.memo.star
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
        },
        memoRemoveRequest: (id, index) => {
            return dispatch(memoRemoveRequest(id, index))
        },
        memoStarRequest: (id, index) => {
            return dispatch(memoStarRequest(id, index))
        }
    }
}

Home.propTypes = {
    username: PropTypes.string
}

Home.defaultProps = {
    username: undefined
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)
