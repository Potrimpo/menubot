import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchOrders, reload } from '../actions'
import VisibleOrders from './VisibleOrders'
import io from 'socket.io-client'

const socket = io.connect();

class OrdersBox extends Component {
  static propTypes = {
    forceReload: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    fbid: PropTypes.string
  };

  getOrdersQuietly () {
    const { dispatch, fbid } = this.props;
    console.log("getting thos orders");
    return dispatch(fetchOrders(fbid));
  };

  componentDidMount() {
    this.getOrdersQuietly();
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', {my: 'data'});
    });
  }

  static componentWillReceiveProps(nextProps) {
    const { dispatch, fbid } = nextProps;
    dispatch(fetchOrders(fbid));
  }

  handleRefreshClick = e => {
    e.preventDefault();
    const { dispatch, fbid } = this.props;
    dispatch(reload());
    return dispatch(fetchOrders(fbid));
  };

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
