import React, { Component } from 'react'
import PropTypes from 'prop-types';

import { withRouter } from "react-router-dom"

import { updateItem, formatPostValue, extractSubmitValue, getItem } from '../Service/Item'
import ItemModal from './Modal';

class UpdateControl extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal : true,
            item : null
        }
    }

    render() {
        const { item } = this.state
        if (!item)
            return null

        return (
            <ItemModal 
                onSubmit={this.handleSubmit}
                onClosed={this.handleClosed}
                values={formatPostValue(item)}
                item={item}
            />
        )
    }
    
    handleSubmit = (values) => {
        const { item } = this.state
        const ext_values = extractSubmitValue(values, item)

        return updateItem(item.id, ext_values)
            .then(resp => {
                this.props.onUpdated(resp)
                this.setState({item: resp})
                return resp
            });
    }

    handleClosed = () => {
        this.setState({modal: false})
        this.props.onUpdated(null)
    }

    componentDidMount() {
        const item_id = this.props.match.params.item_id
        getItem(item_id)
            .then(item => {
                this.setState({item})
            })
    }
}

UpdateControl.propTypes = {
   onUpdated: PropTypes.func.isRequired
}

export default withRouter(UpdateControl)