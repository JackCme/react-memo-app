import * as types from './ActionTypes'
import axios from 'axios'

export const memoPostRequest = (contents) => {
    return dispatch => {
        dispatch(memoPost())

        return axios.post('/api/memo', {contents})
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



