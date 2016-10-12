import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchPosts, reload } from '../actions'
import VisibleOrders from './VisibleOrders'

class OrdersBox extends Component {
  static propTypes = {
    orders: PropTypes.array,
    forceReload: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    fbid: PropTypes.string
  };

  componentDidMount() {
    const { dispatch, fbid } = this.props;
    return dispatch(fetchPosts(fbid));
  }

  static componentWillReceiveProps(nextProps) {
    const { dispatch, fbid } = nextProps;
    dispatch(fetchPosts(fbid));
  }

  handleRefreshClick = e => {
    e.preventDefault();
    const { dispatch, fbid } = this.props;
    dispatch(reload());
    return dispatch(fetchPosts(fbid));
  };

  render() {
    const { forceReload } = this.props;
    return (
      <div>
        <p>
          {!forceReload &&
          <a href="#"
             onClick={this.handleRefreshClick}>
            Refresh
          </a>
          }
        </p>
        <VisibleOrders/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { orders, status, fbid } = state || { orders: [], forceReload: true, fbid: "" };

  return {
    orders,
    forceReload: status.forceReload,
    fbid
  }
};

export default connect(mapStateToProps)(OrdersBox)
