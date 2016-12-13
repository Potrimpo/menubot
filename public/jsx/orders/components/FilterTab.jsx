import React from 'react'
import FilterLink from '../containers/FilterLink'
import DelayForm from '../containers/DelayForm'

const FilterTab = () => (
  <div className="row">
    <div className="col-xs-12">
      <div className="row">
        <div className="col-sm-6 col-xs-12">
          <h1 className="company-head">ORDERS</h1>
        </div>

        <div className="col-sm-6 col-xs-12" style={{'marginTop':'20px'}}>
          <DelayForm />
        </div>
      </div>

      <div className="row reactive-centering">
        <div style={{"marginTop":"0px"}}>
          <a href="/" className="btn btn-default btn-space" role="button">
            <i className="fa fa-long-arrow-left" style={{"fontSize": "18px"}} aria-hidden="true"/>
          </a>
          <a href="https://youtu.be/64S6wWF8DS0" target="_blank" role="button" className="btn btn-default btn-space" style={{"marginLeft":"4px"}}>
            <i className="fa fa-info-circle info-button" aria-hidden="true"/>
          </a>
          <div>
            <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
            <FilterLink filter="SHOW_COMPLETED">Complete</FilterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FilterTab
