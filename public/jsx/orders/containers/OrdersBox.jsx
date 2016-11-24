import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
<<<<<<< HEAD
import { fetchOrders, receiveAndParse } from '../actions'
=======
import { fetchOrders } from '../actions'
>>>>>>> master
import VisibleOrders from './VisibleOrders'
import io from 'socket.io-client'

const socket = io.connect();

class OrdersBox extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fbid: PropTypes.string
  };

  recieveOrders (orders) {
    const { dispatch } = this.props;
    console.log("recieved orders");
    return dispatch(receiveAndParse(orders));
  };

<<<<<<< HEAD
  componentDidMount() {
    const { fbid } = this.props;

    socket.on('connect', function () {
      console.log("we connected baby");
      socket.emit('request-orders', fbid);
    });

    socket.on('orders-list', orders => this.recieveOrders(orders));
    socket.on('new-order', order => console.log("got new order!", order));
=======
  componentDidMount () {
    this.getOrdersQuietly();
    return setInterval(this.getOrdersQuietly.bind(this), 3000);
>>>>>>> master
  }

  static componentWillReceiveProps (nextProps) {
    const { dispatch, fbid } = nextProps;
    dispatch(fetchOrders(fbid));
  }

<<<<<<< HEAD
  render() {
    const { forceReload } = this.props;
=======
  render () {
>>>>>>> master
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
