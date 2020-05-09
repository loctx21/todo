import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { addItem, formatPostValue, extractSubmitValue } from '../Service/Item'
import ItemModal from './Modal'

class CreateControl extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal : true
        }
    }

    render() {
        return (
            <ItemModal 
                onSubmit={this.handleSubmit}
                onClosed={this.handleClosed}
                values={formatPostValue()}
            />
        )
    }

    handleSubmit = (values) => {
        const ext_values = extractSubmitValue(values)

        return addItem(ext_values)
            .then(resp => {
                this.props.onAdded(resp);
            })
    }

    handleClosed = () => {
        this.setState({modal: false})
        this.props.onAdded(null)
    }
}

CreateControl.propTypes = {
   onAdded: PropTypes.func.isRequired
}

export default CreateControl