import React from 'react'
import FilterLink from '../containers/FilterLink'

const Footer = () => (
  <div style={{"marginTop": "0px"}} className="page-header text-center">
    <a href="/" className="btn btn-default btn-space" role="button">
      <i className="fa fa-long-arrow-left" style={{fontSize: "18px"}} aria-hidden="true"></i>
    </a>
    <div>
      <FilterLink filter="SHOW_ACTIVE"><p className="btn btn-default btn-space" role="button">Active</p></FilterLink>
      <FilterLink filter="SHOW_COMPLETED"><p className="btn btn-default btn-space" role="button">Completed</p></FilterLink>
    </div>
  </div>
);

export default Footer
