import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getItems, deleteItem } from "../actions/itemActions";

class Home extends Component {
    static propTypes = {
        getItems: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool,
    };

    componentDidMount() {
        this.props.getItems();
    }

    onDeleteClick = (id) => {
        this.props.deleteItem(id);
    };

    render() {
        const { items } = this.props.item;
        return (
                
                <div className="container">
                    <ul className="list-group">
                        {items.map(({ _id, name }) => (
                            <li key={_id} className="list-group-item">
                                {this.props.isAuthenticated ? (
                                    <button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={this.onDeleteClick.bind(this, _id)}
                                    >
                                        &times;
                                    </button>
                                ) : null}
                                {name}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    }

const mapStateToProps = (state) => ({
    item: state.item,
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getItems, deleteItem })(Home);