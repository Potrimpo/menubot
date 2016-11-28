import React, { PropTypes } from 'react'

const Link = ({ active, children, onClick }) => {
  return (
    <a href="#"
       onClick={e => {
         e.preventDefault();
         onClick()
       }}
    >
      <button className={ active ? "btn btn-default btn-space active " : "btn btn-default btn-space" }
         type="button"
      >
        {children}
      </button>
    </a>
  )
};

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Link
