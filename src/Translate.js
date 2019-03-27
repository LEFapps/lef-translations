import React, { Component } from 'react'
import forEach from 'lodash/forEach'
import PropTypes from 'prop-types'

import { withTranslator } from './Translator'
import TranslationEdit from './TranslationEdit'
import markdown from './markdown'

class Translate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
    this.toggleEditing = this.toggleEditing.bind(this)
  }
  componentDidMount () {
    const { translator, ...props } = this.props
    translator.getTranslation(props)
  }
  toggleEditing () {
    if (this.props.translator.allowEditing() && !this.props.preventInPageEdit) {
      this.setState({ editing: !this.state.editing })
    }
  }
  render () {
    const {
      _id,
      getString,
      tag,
      className,
      autoHide,
      params,
      translator: { translations, currentLanguage }
    } = this.props
    if (!translations[_id]) return ''
    const translation = translations[_id][currentLanguage]
    if (autoHide && !translation) return null
    const TagName = tag || 'span'
    let withParams = translation || ''
    forEach(params, (value, key) => {
      const pattern = new RegExp(`{{${key}}}`, 'g')
      withParams = withParams.replace(pattern, value)
    })
    const text =
      this.props.md && withParams
        ? markdown.render(withParams)
        : withParams || this.props._id
    if (getString) {
      return text || this.props._id
    }
    return (
      <>
        {this.state.editing ? (
          <TranslationEdit
            translation={this.props}
            upload={this.props.upload}
            toggle={this.toggleEditing}
            open={this.state.editing}
          />
        ) : null}
        <TagName
          className={'translation' + (className ? ' ' + className : '')}
          dangerouslySetInnerHTML={{ __html: text }}
          onDoubleClick={this.toggleEditing}
        />
      </>
    )
  }
}

const TranslateContainer = withTranslator(Translate)

TranslateContainer.propTypes = {
  _id: PropTypes.string.isRequired,
  md: PropTypes.bool,
  getString: PropTypes.bool,
  preventInPageEdit: PropTypes.bool,
  autoHide: PropTypes.bool,
  params: PropTypes.object,
  upload: PropTypes.object
}

export default TranslateContainer
