import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchPosts, reload, requestPosts, receivePosts } from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'

class App extends Component {
  static propTypes = {
    orders: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { dispatch } = this.props;
    return dispatch(fetchPosts());
  }

  static componentWillReceiveProps(nextProps) {
    const { dispatch } = nextProps;
    dispatch(fetchPosts())
  }

  handleRefreshClick = e => {
    e.preventDefault();

    const { dispatch } = this.props;
    dispatch(reload());
    return dispatch(fetchPosts());
  };

  render() {
    const { orders, isFetching } = this.props;
    const isEmpty = orders.length === 0;
    return (
      <div>
        <p>
          {!isFetching &&
            <a href="#"
               onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }
        </p>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Posts orders={orders} />
            </div>
        }
        <Picker
          value={'placeholder value'}
          onChange={this.handleChange}
          options={[ 'reactjs', 'frontend' ]}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { status, orders } = state || { isFetching: true, orders: [] };

  return {
    orders,
    isFetching: status.isFetching
  }
};

export default connect(mapStateToProps)(App)
