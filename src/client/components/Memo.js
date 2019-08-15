import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TimeAgo from 'react-timeago'

export class Memo extends Component {
    state = {
        editMode: false,
        value: this.props.data.contents
    }
    static propTypes = {
        data: PropTypes.object,
        ownership: PropTypes.bool,
        onEdit: PropTypes.func,
        index: PropTypes.number
    }

    static defaultProps = {
        data: {
            _id: 'dummy',
            writer: 'Writer',
            contents: 'Contents',
            isEdited: false,
            date: {
                edited: new Date(),
                created: new Date()
            },
            starred: []
        },
        ownership: true,
        onEdit: (id, index, contents) => {
            console.error('onEdit function not defined')
        },
        index: -1
    }

    toggleEdit = () => {
        if(this.state.editMode) {
            let id = this.props.data._id
            let index = this.props.index
            let contents = this.state.value

            this.props.onEdit(id, index, contents).then(
                () => {
                    this.setState({
                        editMode: !this.state.editMode
                    })
                }
            )
        }
        else {
            this.setState({
                editMode: !this.state.editMode
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }
    
    
    componentDidUpdate(prevProps, prevState) {
        //when component updates, initialize dropdown
        //triggered when logged in
        $(`#dropdown-button-${this.props.data._id}`).dropdown({
            belowOrigin: true //displays dropdown below the origin button
        })
    }

    componentDidMount() {
        //when component mounts, initialize dropdown
        //triggered when refreshed
        $(`#dropdown-button-${this.props.data._id}`).dropdown({
            belowOrigin: true //displays dropdown below the origin button
        })
    }
    
    render() {
        const { data, ownership } = this.props
        const dropDownMenu = (
            <div className="option-button">
                <a className='dropdown-button'
                    id={`dropdown-button-${data._id}`}
                    data-activates={`dropdown-${data._id}`}>
                    <i className="material-icons icon-button">more_vert</i>
                </a>
                <ul id={`dropdown-${data._id}`} className='dropdown-content'>
                    <li><a onClick={this.toggleEdit}>Edit</a></li>
                    <li><a>Remove</a></li>
                </ul>
            </div>
        )

        const editedInfo = (
            <span style={{ color: '#AAB5BC' }}> · Edited <TimeAgo date={new Date(this.props.data.date.edited)} live={true} /></span>
        );
        const memoView = (
            <div className="card">
                <div className="info">
                    <a className="username">{data.writer}</a> wrote a log · <TimeAgo date={new Date(this.props.data.date.created)} />
                    { this.props.data.isEdited ? editedInfo : undefined}
                    { ownership ? dropDownMenu : undefined }
                </div>
                <div className="card-content">
                    {data.contents}
                </div>
                <div className="footer">
                    <i className="material-icons log-footer-icon star icon-button">star</i>
                    <span className="star-count">{data.starred.length}</span>
                </div>
            </div>
        )

        const editView = (
            <div className="write">
                <div className="card">
                    <div className="card-content">
                        <textarea
                            className="materialize-textarea"
                            value={this.state.value}
                            onChange={this.handleChange}></textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={this.toggleEdit}>OK</a>
                    </div>
                </div>
            </div>
        )
        return (
            <div className="container memo">
                {this.state.editMode ? editView : memoView}
            </div>
        )
    }
}

export default Memo
