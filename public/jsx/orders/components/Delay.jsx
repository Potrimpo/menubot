import React, { PropTypes } from 'react'

const Delay =({currentDelayTime, handleChange}) => {
  return (
    <div className="location-setter-container text-center">
      <form id="order-delay-setter" className="form-inline the-magic-fix-that-fixes-everything-and-you-have-no-idea-why-it-does-that">
        <div className="input-group">
          <span className="input-group-addon">Current time to fulfil orders? </span>
          <select id="order-delay-setter-input" className="form-control" value={currentDelayTime} onChange={handleChange}>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
            <option value="25">25 minutes</option>
          </select>
        </div>
      </form>
    </div>
  )
};

export default Delay
