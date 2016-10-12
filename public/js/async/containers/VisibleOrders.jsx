import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleOrder } from '../actions'
import OrdersList from '../components/OrdersList'

const getVisibleOrders = (orders, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return orders;
    case 'SHOW_COMPLETED':
      return orders.filter(o => !o.pending);
    case 'SHOW_ACTIVE':
      return orders.filter(o => o.pending);
    default:
      throw new Error('Unknown filter: ' + filter)
  }
};

const mapStateToProps = (state) => ({
  orders: getVisibleOrders(state.orders, state.filter)
});

const mapDispatchToProps =  ({
  onOrderClick: toggleOrder
});

const VisibleOrders = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersList);

export default VisibleOrders
