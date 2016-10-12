import React, { PropTypes } from 'react'

const Picker = ({ value }) => (
  <span>
    <h4>{value}</h4>
  </span>
);

Picker.propTypes = {
  value: PropTypes.string.isRequired,
};

export default Picker
