import { 
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_REGISTER,
    AUTH_REGISTER_FAILURE,
    AUTH_REGISTER_SUCCESS,
 } from './ActionTypes'
 import axios from 'axios'

/* Login actions */
export const loginRequest = (username, password) => {
    return (dispatch) => {
        dispatch(login())

        return axios.post('/api/account/signin', {username, password})
                    .then((response) => {
                        dispatch(loginSuccess(username))
                    })
                    .catch((err) => {
                        dispatch(loginFailure())
                    })
    }
    
}

export const login = () => {
    return {
        type: AUTH_LOGIN
    }
}

export const loginSuccess = (username) => {
    return {
        type: AUTH_LOGIN_SUCCESS,
        username
    }
}

export const loginFailure = () => {
    return {
        type: AUTH_LOGIN_FAILURE
    }
}

/* Register actions */
export const registerRequest = (username, password) => {
    return (dispatch) => {
        dispatch(register())

        return axios.post('/api/account/signup', { username, password })
                    .then(() => {
                        dispatch(registerSuccess())
                    })
                    .catch((err) => {
                        dispatch(registerFailure(err.response.data.code))
                    })
    }
}

export const register = () => {
    return {
        type: AUTH_REGISTER
    }
}

export const registerSuccess = () => {
    return {
        type: AUTH_REGISTER_SUCCESS
    }   
}

export const registerFailure = (err) => {
    return {
        type: AUTH_LOGIN_FAILURE,
        err
    }
}


