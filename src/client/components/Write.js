import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class Write extends Component {
    static propTypes = {
        onPost: PropTypes.func
    }

    static defaultProps = {
        onPost: (contents) => { console.warn('post function not defined')}
    }
    state = {
        contents: ''
    }

    handleChange = (e) => {
        this.setState({
            contents: e.target.value
        })
    }

    handlePost = () => {
        let contents = this.state.contents
        console.log("handle post : " + contents)
        this.props.onPost(contents).then(
            () => {
                this.setState({
                    contents: ""
                })
            }
        )
    }
    
    
    render() {
        return (
            <div className="container write">
                <div className="card">
                    <div className="card-content">
                        <textarea className="materialize-textarea"
                            placeholder="Write down your memo"
                            value={this.state.contents}
                            onChange={this.handleChange}
                            name="contents"></textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={this.handlePost}>POST</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Write
