import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchOrder } from '../store/pastOrders';
import OrderConfirmation from './OrderConfirmation';

const mapState = function(state, ownProps) {
  console.log('order confirm state', state);
  return {
    order: state.pastOrders,
    cart: state.cart
  };
};

const mapDispatch = function(dispatch) {
  return {
    confirmationOrder: function(id) {
      dispatch(fetchOrder(id));
    }
  };
};

export default connect(mapState, mapDispatch)(OrderConfirmation);
