import React, { Component } from 'react';
// import { Field, reduxForm } from 'redux-form';
// import { Input } from 'semantic-ui-redux-form-fields';
import InjectedCheckoutForm from './StripeCheckoutForm';

export default class CartCheckout extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const total = this.props.location.state.total;
    return <InjectedCheckoutForm total={total} />;
  }
}
