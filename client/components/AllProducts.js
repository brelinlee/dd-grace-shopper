import React, { Component } from 'react';

export default class AllProducts extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getAllProducts();
  }

  render() {
    console.log('!!!!!!', this.props);
    return (
      <div>
        <h1>All Products</h1>
        <p>Here</p>
      </div>
    );
  }
}
