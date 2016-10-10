import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchPosts, reload } from '../actions'
import Picker from '../components/Picker'
import Posts from '../components/Posts'

class App extends Component {
  static propTypes = {
    orders: PropTypes.array.isRequired,
    forceReload: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    fbid: PropTypes.string
  };

  componentDidMount() {
    const { dispatch, fbid } = this.props;
    return dispatch(fetchPosts(fbid));
  }

  static componentWillReceiveProps(nextProps) {
    const { dispatch } = nextProps;
    dispatch(fetchPosts())
  }

  handleRefreshClick = e => {
    e.preventDefault();

    const { dispatch, fbid } = this.props;
    dispatch(reload());
    return dispatch(fetchPosts(fbid));
  };

  render() {
    const { orders, forceReload } = this.props;
    const isEmpty = orders.length === 0;
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
        {isEmpty
          ? (forceReload ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: forceReload ? 0.5 : 1 }}>
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
  const { status, orders, fbid } = state || { forceReload: true, orders: [], fbid: "" };

  return {
    orders,
    forceReload: status.forceReload,
    fbid
  }
};

export default connect(mapStateToProps)(App)
