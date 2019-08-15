import * as types from './ActionTypes'
import axios from 'axios'

export const searchUserRequest = (keyword) => {
    return dispatch => {
        dispatch(searchUser())

        return axios.get('/api/account/search/' + keyword)
                    .then((response) => {
                        dispatch(searchUserSuccess(response.data))
                    })
    }
}

export const searchUser = () => {
    return {
        type: types.SEARCH_USER
    }
}

export const searchUserSuccess = (usernames) => {
    return {
        type: types.SEARCH_USER_SUCCESS,
        usernames
    }
}

export const searchUserFailure = (error) => {
    return {
        type: types.SEARCH_USER_FAILURE,
        error
    }
}

