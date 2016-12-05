import React from 'react'
import FilterLink from '../containers/FilterLink'

const FilterTab = () => (
  <div style={{"marginTop": "0px"}} className="page-header text-center">
    <a href="/" className="btn btn-default btn-space" role="button">
      <i className="fa fa-long-arrow-left" style={{fontSize: "18px"}} aria-hidden="true"/>
    </a>
    <div>
      <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
      <FilterLink filter="SHOW_COMPLETED">Complete</FilterLink>
    </div>
  </div>
);

export default FilterTab
