import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchOrders } from '../actions'
import VisibleOrders from './VisibleOrders'

class OrdersBox extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fbid: PropTypes.string
  };

  getOrdersQuietly () {
    const { dispatch, fbid } = this.props;
    console.log("getting thos orders");
    return dispatch(fetchOrders(fbid));
  };

  componentDidMount () {
    this.getOrdersQuietly();
    return setInterval(this.getOrdersQuietly.bind(this), 3000);
  }

  static componentWillReceiveProps (nextProps) {
    const { dispatch, fbid } = nextProps;
    dispatch(fetchOrders(fbid));
  }

  static render () {
    return (
      <div>
        <VisibleOrders/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { fbid } = state || { fbid: "" };

  return {
    fbid
  }
};

export default connect(mapStateToProps)(OrdersBox)
