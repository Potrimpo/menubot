import React, { PropTypes } from 'react'
import Please from 'pleasejs'

const NewItem = () => {
  const color = Please.make_color({base_color: '#B9F6CA'});
  const border_color = Please.make_color({base_color: '#a9e0b8'});

  return (
    <div className="row">
      <div
        className="col-xs-12 item-container closed-borders top-large-gap"
        // style={{backgroundColor: color, borderColor: border_color}}
      >
        <div className="col-xs-12">
          <input
            type="text"
            className="entry-input"
            placeholder="Add a new item...">
          </input>
        </div>
      </div>
    </div>
  )
};

export default NewItem
