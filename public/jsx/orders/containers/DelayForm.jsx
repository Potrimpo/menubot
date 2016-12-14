import { connect } from 'react-redux'
import { setDelayTime } from '../actions'
import Delay from '../components/Delay'

const mapStateToProps = (state) => ({
  currentDelayTime: state.delay
});

const mapDispatchToProps = (dispatch) => ({
  handleChange: (event) => {
    event.preventDefault();
    dispatch(setDelayTime(event.target.value))
  }
});

const DelayForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(Delay);

export default DelayForm
