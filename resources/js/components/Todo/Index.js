import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Plus } from 'react-feather'
import { Button } from 'reactstrap'

import { Route, withRouter } from "react-router-dom"

import TodoItem from './Item'
import CreateControl from './CreateControl'
import UpdateControl from './UpdateControl'

import { getItems } from '../Service/Item'
import { CSSTransitionGroup } from 'react-transition-group'

class TodoIndex extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item_modal: false,
            items: [],
            mode: 'all'
        }
    }
    render() {
        
        const { item_modal, selected_item_id, mode } = this.state

        return (    
            <div className="container">
                <div className="col-md-12 mb-3">
                    <nav className="nav nav-pills">
                        <a className={`nav-item nav-link ${mode === 'all' ? 'active' : '' }`} href="#"
                            onClick={() => this.setState({mode : 'all'})}>
                            All
                        </a>
                        <a className={`nav-item nav-link ${mode === 'uncomplete' ? 'active' : '' }`}  href="#"
                            onClick={() => this.setState({mode : 'uncomplete'})}>
                            Uncomplete
                        </a>
                        <a className={`nav-item nav-link ${mode === 'completed' ? 'active' : '' }`}  href="#"
                            onClick={() => this.setState({mode : 'completed'})}>
                            Completed
                        </a>
                    </nav>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">Simple Todo List</div>
                            <div className="card-body">
                                <table className="table item">
                                    <CSSTransitionGroup
                                        component="tbody"
                                        transitionName="ani"
                                        transitionEnterTimeout={500}
                                        transitionLeaveTimeout={300}>
                                            {this.items.map(item => (
                                            <TodoItem key={item.id} item={item}
                                                onSelected={(id) => this.setState({selected_item_id : id})}
                                                onUpdated={this.handleUpdateItem}
                                                onDeleted={this.handleDeletedItem}
                                            />
                                            ))}   
                                    </CSSTransitionGroup>                              
                                </table>
                                <Button outline
                                    onClick={() => this.setState({item_modal: true})}
                                >
                                    <Plus/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {item_modal && 
                    <CreateControl 
                        onAdded={this.handleAddItem}
                    /> 
                }  

                <Route path={`/todo/:item_id`}>
                    <UpdateControl 
                        onUpdated={this.handleUpdateItem}
                    />
                </Route>
            </div>
        )
    }

    get selected_item() {
        return this.state.items.filter(item => item.id == this.state.selected_item_id)[0]
    }

    get items() {
        const { mode } = this.state

        if (mode === 'all')
            return this.state.items
        
        if (mode === 'uncomplete')
            return this.state.items.filter(item => !item.done_at)

        if (mode === 'completed')
            return this.state.items.filter(item => item.done_at)
    }

    handleAddItem = (item) => {
        if (!item) {
            this.setState({item_modal : false})
            return;
        }
        
        let n_items = this.state.items.slice(0);
        n_items.push(item);
        
        this.setState({
            items: n_items
        })
    }

    handleUpdateItem = (item) => {
        if (!item) {
            this.setState({selected_item_id : null})
            this.props.history.replace(this.props.match.url);
            return;
        }

        let n_items = this.state.items.slice(0);
        n_items = n_items.map(o_item => o_item.id == item.id ? item : o_item)
        this.setState({
            items: n_items
        })
    }

    handleDeletedItem = (item_id) => {
        let items = this.state.items.filter(item => item.id !== item_id)
        this.setState({items})
    }

    componentDidMount() {
        getItems().then(items => {
            this.setState({items})
        })
    }
}

TodoIndex.propTypes = {
}

export default withRouter(TodoIndex)

