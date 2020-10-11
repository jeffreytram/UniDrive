import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RequestProgrssElement extends Component {
    constructor() {
        super();
        this.state = {
            percent: 0
        };
    }
    componentDidMount() {
        console.log("Did Mount");
        const { request } = this.props.requested;
        request.upload.addEventListener('load', this.handler);
        request.upload.addEventListener('error', this.handler);
        request.upload.addEventListener('abort', this.handler);
        request.upload.addEventListener('progress', this.progressHandler);
    }
    /**
     * Log the request on events called for
     * @param {*} event 
     */
    handler = (event) => {
        console.log(event);
    }
    /**
     * Update percent with new percent
     * @param {*} event 
     */
    progressHandler = (event) => {
        this.setState({
            percent: (event.loaded / event.total) * 100
        });
    }

    render() {
        const { requested } = this.props;
        const { name } = requested;
        return (
            <div>
                <div>
                    {name}
                </div>
                <progress id="progressBar" value={this.state.percent} max="100" style={{width: '300px'}}></progress>
            </div>
        );
    }
}

File.propTypes = {
    requested: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string])).isRequired
}

export default RequestProgrssElement;