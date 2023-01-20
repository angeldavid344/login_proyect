import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import { loadUser } from "../actions/authActions";
import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import PrivateRoute from "./PrivateRoute";

import "./App.css";

class App extends

    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (

            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Navbar />
                        <div className="container">
                            <Switch>
                                <PrivateRoute exact path="/" component={Home} />
                                <Route exact path="/login" component={Login} />
                                <Route exact path="/register" component={Register} />
                            </Switch>
                        </div>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;