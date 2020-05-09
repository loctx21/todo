import React from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom"
import TodoIndex from './Todo/Index'


export default function App() {
    return (
        <Router>
            <Switch>
                <Route path="/todo">
                    <TodoIndex />
                </Route>
            </Switch>
        </Router>
    );
}

if (document.getElementById('todo_index')) {
    ReactDOM.render(
        <App 
        />, document.getElementById('todo_index'));
}