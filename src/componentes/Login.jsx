//create me a complete login component

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../actions/authActions";
import { clearErrors } from "../actions/errorActions";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

class Login extends Component {

    state = {
        username: "",
        password: "",
        msg: null,
    };
    

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
    };

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            // Check for login error
            if (error.id === "LOGIN_FAIL") {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();

        const { username, password } = this.state;

        // Create user object
        const user = {
            username,
            password,
        };

        // Attempt to login
        this.props.login(user);
    };

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />;
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col s8 offset-s2">
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <h4>
                                <b>Login</b> below
                            </h4>
                            <p className="grey-text text-darken-1">
                                Don't have an account? <Link to="/register">Register</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.username}
                                    error={this.state.msg}
                                    id="username"
                                    type="text"
                                    className="validate"
                                    name="username"
                                />
                                <label htmlFor="username">Username</label>
                                <span className="red-text">{this.state.msg}</span>
                            </div>
                            <div className="input-field col s12">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={this.state.msg}
                                    id="password"
                                    type="password"
                                    className="validate"
                                    name="password"
                                />
                                <label htmlFor="password">Password</label>
                                <span className="red-text">{this.state.msg}</span>

                            </div>


                            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                <button
                                    style={{
                                        width: "150px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px",
                                        marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
});

export default connect(mapStateToProps, { login, clearErrors })(Login);

// Path: src/actions/authActions.js
//create me a complete authActions

import axios from "axios";
import { returnErrors } from "./errorActions";

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from "./types";

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });

    axios
        .get("/api/auth/user", tokenConfig(getState))
        .then((res) =>
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            })
        )
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR,
            });
        });
};

// Register User
export const register = ({ username, email, password }) => (dispatch) => {
    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    // Request body
    const body = JSON.stringify({ username, email, password });

    axios
        .post("/api/users", body, config)
        .then((res) =>
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
            })
        )
        .catch((err) => {
            dispatch(
                returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
            );
            dispatch({
                type: REGISTER_FAIL,
            });
        });
};

// Login User
export const login = ({ username, password }) => (dispatch) => {
    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    // Request body
    const body = JSON.stringify({ username, password });

    axios
        .post("/api/auth", body, config)
        .then((res) =>
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            })
        )
        .catch((err) => {
            dispatch(
                returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
            );
            dispatch({
                type: LOGIN_FAIL,
            });
        });
};

// Logout User
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS,
    };
};

// Setup
export const tokenConfig = (getState) => {

    // Get token from localstorage
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    // If token, add to headers
    if (token) {
        config.headers["x-auth-token"] = token;
    }

    return config;
}

// Path: src/reducers/authReducer.js

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from "../actions/types";

const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: false,
    user: null,
};

export default function (state = initialState, action) {

    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        default:
            return state;
    }
}

// Path: src/reducers/errorReducer.js

import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initialState = {
    msg: {},
    status: null,
    id: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id,
            };
        case CLEAR_ERRORS:
            return {
                msg: {},
                status: null,
                id: null,
            };
        default:
            return state;
    }
}

// Path: src/reducers/index.js

import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
});

// Path: src/components/auth/Register.js

import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";

import { connect } from "react-redux";
import { register } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

class Register extends Component {

    state = {
        username: "",
        email: "",
        password: "",
        msg: null,
    };

    componentDidUpdate(prevProps) {
        const { error } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === "REGISTER_FAIL") {
                this.setState({ msg: error.msg.msg });
            } else {
                this.setState({ msg: null });
            }
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = (e) => {
        e.preventDefault();

        const { username, email, password } = this.state;

        // Create user object
        const newUser = {
            username,
            email,
            password,
        };

        // Attempt to register
        this.props.register(newUser);
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col md="6" className="mx-auto">
                        <h1 className="text-center">Register</h1>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Username"
                                    className="mb-3"
                                    onChange={this.onChange}
                                />

                                <Label for="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email"
                                    className="mb-3"
                                    onChange={this.onChange}
                                />

                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    className="mb-3"
                                    onChange={this.onChange}
                                />
                                <Button color="dark" style={{ marginTop: "2rem" }} block>
                                    Register
                                </Button>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
});

export default connect(mapStateToProps, { register, clearErrors })(Register);



