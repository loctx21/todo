import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Info, Trash2 } from 'react-feather'

import { confirmAlert } from '../Confirm/ConfirmWrapper'
import { Link } from "react-router-dom"

import { updateItem, deleteItem } from '../Service/Item'
import moment from 'moment'
import { DATE_TIME_FORMAT } from './Const'

class TodoItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            on_update : false
        }
    }
    
    render() {
        const { item } = this.props

        return (    
            <tr>
                <td>{this.dueDate}</td>
                <td>
                    <input
                        name="is_done"
                        type="checkbox"
                        checked={this.checked}
                        onChange={this.handleStatusChange} 
                        disabled={this.state.on_update}
                    />
                </td>
                <td>{item.name}</td>
                <td>
                    <div className="action">
                        <span className="clickable icon mr-1">
                            <Link to={`/todo/${item.id}`}>
                                <Info/>
                            </Link>
                        </span>
                        <span className="clickable icon delete"
                            onClick={this.handleDelete}>
                            <Trash2/>
                        </span>
                    </div>
                </td>
            </tr>
        );
    }

    get checked()
    {
        return this.props.item.done_at ? true : false
    }

    get dueDate()
    {
        const { due_at, done_at } = this.props.item

        if (!due_at)
            return null
        
        const local_due_at = moment.utc(due_at).local()
        if (done_at)
            return (<span className="badge badge-success lg">{local_due_at.format(DATE_TIME_FORMAT)}</span>)

        let today = new Date()
        if (local_due_at < today)
            return (<span className="badge badge-danger lg">{local_due_at.format(DATE_TIME_FORMAT)}</span>)

        let next24 = (new Date()).setDate(today.getDate() + 1)
        if (local_due_at > today && local_due_at < next24 )
            return (<span className="badge badge-warning lg">{local_due_at.format(DATE_TIME_FORMAT)}</span>)

        return (<span className="badge lg">{local_due_at.format(DATE_TIME_FORMAT)}</span>)
    }

    handleDelete = () => {
        const { item } = this.props

        confirmAlert({
            content: () => ("Delete cannot be undone. Do you want to continute?"),
            buttons: [
                {
                    label: "No",
                    color: "secondary"
                },
                {
                    label: "Yes",
                    color: "primary",
                    onClick: () => this.persitDelete()
                }
            ]
        })
    }

    persitDelete() {
        const { item } = this.props
        deleteItem(item.id)
            .then(() => this.props.onDeleted(item.id))
    }

    handleStatusChange = () => {
        const { item } = this.props

        this.setState({ on_update :  true})
        updateItem(item.id, {status : !this.checked})
            .then(item => {
                this.props.onUpdated(item)
            }).finally(() => {
                this.setState({ on_update :  false})
            })
            
    }
}

TodoItem.propTypes = {
    item: PropTypes.object.isRequired,
    onSelected: PropTypes.func.isRequired,
    onDeleted: PropTypes.func.isRequired
}

export default TodoItem