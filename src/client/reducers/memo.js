import * as types from 'actions/ActionTypes'
import update from 'react-addons-update'

const initialState = {
    post: {
        status: 'INIT',
        error: -1
    },
    list: {
        status: 'INIT',
        data: [],
        isLast: false
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
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
        case types.MEMO_LIST:
            return update(state, {
                list: {
                    status: { $set: 'WAITING' }
                }
            })
        case types.MEMO_LIST_SUCCESS:
            if(action.isInitial) {
                return update(state, {
                    list: {
                        status: { $set: 'SUCCESS' },
                        data: { $set: action.data },
                        isLast: { $set: action.data.length < 6 }
                    }
                })
            }

            return state

        case types.MEMO_LIST_FAILURE:
            return update(state, {
                list: {
                    status: { $set: 'FAILIRE' }
                }
            })
        default:
            return state
    }
}
