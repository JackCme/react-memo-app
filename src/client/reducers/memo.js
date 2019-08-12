import * as types from 'actions/ActionTypes'
import update from 'react-addons-update'

const initialState = {
    post: {
        status: 'INIT',
        error: -1
    }
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.MEMO_POST:
            return update(state, {
                post: {
                    status: { $set: 'WAITING' },
                    error: { $set: -1 }
                }
            })
        case types.MEMO_POST_SUCCESS:
            return update(state, {
                post: {
                    status: { $set: 'SUCCESS' }
                }
            })
        case types.MEMO_POST_FAILURE:
            return update(state, {
                post: {
                    status: { $set: 'FAILURE' },
                    error: { $set: payload }
                }
            })
        default:
            return state
    }
}
