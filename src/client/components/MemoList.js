import React, { Component } from 'react'
import { Memo } from 'components'
import PropTypes from 'prop-types'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

export class MemoList extends Component {
    static propTypes = {
        data: PropTypes.array,
        currentUser: PropTypes.string,
        onEdit: PropTypes.func,
        onRemove: PropTypes.func,
        onStar: PropTypes.func
    }

    static defaultProps = {
        data: [],
        currentUser: '',
        onEdit: (id, index, contents) => {
            console.error('edit function not defined')
        },
        onRemove: (id, index) => {
            console.error('remove function not defined')
        },
        onStar: (id, index) => {
            console.error('onStar function not defined')
        }
    }
    render() {
        const mapToComponents = (data) => {
            return data.map((memo, i) => {
                return (
                    <CSSTransition classNames="memo"
                                    timeout={1000}
                                    key={memo._id}>
                        <Memo
                            data={memo}
                            ownership={(memo.writer === this.props.currentUser)}
                            key={memo._id}
                            index={i}
                            onEdit={this.props.onEdit}
                            onRemove={this.props.onRemove}
                            onStar={this.props.onStar}
                            currentUser={this.props.currentUser}
                        />
                    </CSSTransition>
                    
                )
            })
        }
        
        return (
            <div>
                <TransitionGroup>
                    {mapToComponents(this.props.data)}
                </TransitionGroup>
            </div>
        )
    }
}

export default MemoList
