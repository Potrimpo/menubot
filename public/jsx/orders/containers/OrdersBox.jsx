import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { initOrders, newOrder } from '../actions'
import VisibleOrders from './VisibleOrders'
import io from 'socket.io-client'

const socket = io.connect();

class OrdersBox extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fbid: PropTypes.string
  };

  firstOrders (orders) {
    const { dispatch } = this.props;
    console.log("recieved orders");
    console.log(orders[0]);
    return dispatch(initOrders(orders));
  };

  moreOrders (orders) {
    const { dispatch } = this.props;
    console.log("ORDER UPDATE");
    console.log(orders[0]);
    return dispatch(newOrder(orders));
  }

  componentDidMount() {
    const { fbid } = this.props;

    socket.on('connect', function () {
      console.log("we connected baby");
      socket.emit('request-orders', fbid);
    });

    socket.on('orders-list', orders => this.firstOrders(orders));
    socket.on('new-order', order => this.moreOrders(JSON.parse(order)));
  }

  render () {
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
