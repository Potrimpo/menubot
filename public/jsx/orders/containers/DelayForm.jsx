import { connect } from 'react-redux'
import { setDelayTime } from '../actions'
import Delay from '../components/Delay'

const mapStateToProps = (state) => ({
  currentDelayTime: () => {
    console.log("state.delayTime in DelayForm.jsx");
    console.log(state.delayTime);
    return state.delayTime
  }
});

const mapDispatchToProps = (dispatch) => ({
  handleChange: (event) => {
    console.log("event.target.value in DelayForm.jsx");
    console.log(event.target.value);
    dispatch(setDelayTime(event.target.value))
  }
});

const DelayForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(Delay);

export default DelayForm
