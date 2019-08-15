import * as types from 'actions/ActionTypes'
import update from 'react-addons-update'

const initialState = {
    status: 'INIT',
    usernames: []
}

export default (state = initialState, action) => {
    switch (action.type) {

    case types.SEARCH_USER:
        return update(state, {
            status: { $set: 'WAITING'}
        })
        
    case types.SEARCH_USER_SUCCESS:
        return update(state, {
            status: { $set: 'SUCCESS' },
            usernames: { $set: action.usernames }
        })

    case types.SEARCH_USER_FAILURE:
        return update(state, {
            status: { $set: 'FAILURE' },
            usernames: { $set: action.usernames }
        })

    default:
        return state
    }
}
