import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import EditorComp from '../components/EditorComp'

const mapStateToProps = (state, ownProps) => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeEntryName: (event) => {
    dispatch(changeEntry({
      newValue: event.target.value,
      column: ownProps.editor.entryType,
      entryType: [`IS_${ownProps.editor.entryType.toUpperCase()}`],
      id: ownProps.editor.index,
      fbid: ownProps.editor.fbid
    }))
  }
});

const EditorCont = connect(mapStateToProps, mapDispatchToProps)(EditorComp);

export default EditorCont
