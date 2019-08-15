import * as types from './ActionTypes'
import axios from 'axios'

export const memoPostRequest = (contents) => {
    return dispatch => {
        dispatch(memoPost())
        console.log("memo action post request: " + contents)
        return axios.post('/api/memo', { contents: contents})
                    .then(() => {
                        dispatch(memoPostSuccess())
                    })
                    .catch((error) => {
                        dispatch(memoPostFailure(error.response.data.code))
                    })
    }
}

export const memoPost = () => {
    return {
        type: types.MEMO_POST
    }
}

export const memoPostSuccess = () => {
    return {
        type: types.MEMO_POST_SUCCESS
    }
}

export const memoPostFailure = (error) => {
    return {
        type: types.MEMO_POST_FAILURE,
        error
    }
}

/*
    Parameter:
        - isInitial: whether it is for initial loading
        - listType:  OPTIONAL; loading 'old' memo or 'new' memo
        - id:        OPTIONAL; memo id (one at the bottom or one at the top)
        - username:  OPTIONAL; find memos of following user
*/
export const memoListRequest = (isInitial, listType, id, username) => {
    return dispatch => {
        dispatch(memoList())

        let url = '/api/memo'

        if(typeof username === 'undefined') {
            //username not given, load public memo
            url = isInitial 
                    ? url
                    : `${url}/${listType}/${id}`
        }
        else {
            //laod memos of specific user
            
        }

        return axios.get(url)
                    .then(response => {
                        dispatch(memoListSuccess(response.data, isInitial, listType))
                    })
                    .catch(error => {
                        dispatch(memoListFailure())
                    })
    }
}

export const memoList = () => {
    return {
        type: types.MEMO_LIST
    }
}

export const memoListSuccess = (data, isInitial, listType) => {
    return {
        type: types.MEMO_LIST_SUCCESS,
        data,
        isInitial,
        listType
    }
}

export const memoListFailure = () => {
    return {
        type: types.MEMO_LIST_FAILURE
    }
}

export const memoEditRequest = (id, index, contents) => {
    return dispatch => {
        dispatch(memoEdit())

        return axios.put('/api/memo/' + id, {contents})
                    .then(response => {
                        dispatch(memoEditSuccess(index, response.data.memo))
                    })
                    .catch(error => {
                        dispatch(memoEditFailure(error.response.data.code))
                    })
    }
}

export const memoEdit = () => {
    return {
        type: types.MEMO_EDIT
    }
}

export const memoEditSuccess = (index, memo) => {
    return {
        type: types.MEMO_EDIT_SUCCESS,
        index,
        memo
    }   
}

export const memoEditFailure = (error) => {
    return {
        type: types.MEMO_EDIT_FAILURE,
        error
    }
}

export const memoRemoveRequest = (id, index) => {
    return dispatch => {
        dispatch(memoRemove())

        return axios.delete('/api/memo/' + id)
                    .then(response => {
                        dispatch(memoRemoveSuccess(index))
                    })
                    .catch(error => {
                        dispatch(memoRemoveFailure(error.response.data.code))
                    })
    }
}

export const memoRemove = () => {
    return {
        type: types.MEMO_REMOVE
    }
}


export const memoRemoveSuccess = (index) => {
    return {
        type: types.MEMO_REMOVE_SUCCESS,
        index
    }
}

export const memoRemoveFailure = (error) => {
    return {
        type: types.MEMO_REMOVE_FAILURE,
        error
    }
}
