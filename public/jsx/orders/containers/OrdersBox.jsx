import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchOrders, receiveAndParse } from '../actions'
import VisibleOrders from './VisibleOrders'
import io from 'socket.io-client'

const socket = io.connect();

class OrdersBox extends Component {
  static propTypes = {
    forceReload: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    fbid: PropTypes.string
  };

  recieveOrders (orders) {
    const { dispatch } = this.props;
    console.log("recieved orders");
    return dispatch(receiveAndParse(orders));
  };

  componentDidMount() {
    const { fbid } = this.props;

    socket.on('connect', function () {
      console.log("we connected baby");
      socket.emit('request-orders', fbid);
    });

    socket.on('orders-list', orders => this.recieveOrders(orders));
    socket.on('new-order', order => console.log("got new order!", order));
  }

  static componentWillReceiveProps(nextProps) {
    const { dispatch, fbid } = nextProps;
    dispatch(fetchOrders(fbid));
  }

  render() {
    const { forceReload } = this.props;
    return (
      <div>
        <VisibleOrders/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { status, fbid } = state || { forceReload: true, fbid: "" };

  return {
    forceReload: status.forceReload,
    fbid
  }
};

export default connect(mapStateToProps)(OrdersBox)
