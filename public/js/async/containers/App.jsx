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
    dispatch(requestPosts());
    return fetch("/api/orders/1766837970261548", { credentials : 'same-origin' })
      .then(response => response.json())
      .then(json => {
        console.log("parsed json", json);
        return dispatch(receivePosts(json))
      })
      .catch(e => console.error("something went wrong fetching the data"));
  }

  static componentWillReceiveProps(nextProps) {
    const { dispatch } = nextProps;
    dispatch(fetchPosts())
  }

  handleRefreshClick = e => {
    e.preventDefault();

    const { dispatch } = this.props;
    dispatch(reload());
    dispatch(requestPosts());
    return fetch("/api/orders/1766837970261548", { credentials : 'same-origin' })
      .then(response => {
        return response.json()
      })
      .then(json => dispatch(receivePosts(json)))
      .catch(e => console.error("something went wrong fetching the data"));
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
