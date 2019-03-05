import React, { Component } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Roles } from 'meteor/alanning:roles'
import { keys, concat } from 'lodash'
import PropTypes from 'prop-types'
import MarkdownIt from 'markdown-it'
import AdminList from 'meteor/lef:adminlist'
import { MarkdownImageUpload } from 'meteor/lef:imgupload'

import { withTranslator } from './Translator'
import Collection from './Collection'
import MarkdownHelp from './MarkdownHelp'

const markdown = MarkdownIt({
  html: true,
  linkify: true,
  typography: true
}).use(require('markdown-it-video'))

const TranslationModalContainer = props => {
  const { translation } = props
  if (!translation) return null
  return (
    <TranslationModal
      {...props}
      key={`${translation._id}-${keys(translation).join('-')}`}
    />
  )
}

class TranslationModal extends Component {
  constructor (props) {
    super(props)
    const state = props.translation || false
    this.state = state
    this.save = this.save.bind(this)
    this.toggleUpload = this.toggleUpload.bind(this)
  }
  handleChange (e, language) {
    this.setState({ [language]: e.target.value })
  }
  handleUpload (result) {
    console.log(result)
  }
  toggleUpload () {
    this.setState({ upload: !this.state.upload })
  }
  save () {
    Meteor.call('updateTranslation', this.state, (error, result) => {
      if (result) {
        this.props.toggle()
      } else {
        alert(JSON.stringify(error))
      }
    })
  }
  onUpload (language) {
    return url => {
      let text = this.state[language]
      text += url
      this.setState({ [language]: text })
    }
  }
  render () {
    const { loading, open, toggle, translator } = this.props
    const translation = this.state
    if (loading || !translation) return null
    return (
      <Modal isOpen={open} toggle={toggle} size='lg'>
        <ModalHeader toggle={toggle}>
          <FontAwesomeIcon icon={faEdit} /> {translation._id}
        </ModalHeader>
        <ModalBody>
          <div className='row'>
            {translator.languages.map(language => {
              return (
                <div className='col' key={language}>
                  <h6>{language}</h6>
                  {translation.md ? (
                    <div>
                      <Input
                        type='textarea'
                        value={translation[language]}
                        onChange={e => this.handleChange(e, language)}
                        rows='10'
                      />
                      <MarkdownImageUpload
                        onSubmit={this.onUpload(language)}
                        sizes={[256, 512]}
                        label={'Upload je profielfoto'}
                        placeholder={'Optional'}
                      />
                      <hr />

                      <div
                        className='translator-preview'
                        dangerouslySetInnerHTML={{
                          __html: markdown.render(translation[language] || '')
                        }}
                      />
                    </div>
                  ) : (
                    <Input
                      type='text'
                      value={translation[language] || ''}
                      onChange={e => this.handleChange(e, language)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          {translation.md ? <MarkdownHelp /> : null}
          <Button onClick={this.save} color='success'>
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button onClick={toggle} color='danger'>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const ModalContainer = withTranslator(
  withTracker(({ translation, translator }) => {
    const handle = Meteor.subscribe('translationEdit', translation._id)
    return {
      translation: Collection.findOne(translation._id),
      loading: !handle.ready(),
      translator
    }
  })(TranslationModalContainer)
)

class Translate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
    this.toggleEditing = this.toggleEditing.bind(this)
  }
  toggleEditing () {
    if (
      Roles.userIsInRole(Meteor.userId(), 'admin') &&
      !this.props.preventInPageEdit
    ) {
      this.setState({ editing: !this.state.editing })
    }
  }
  render () {
    const {
      loading,
      translation,
      getString,
      tag,
      className,
      autoHide
    } = this.props
    if (loading) return null
    if (autoHide && !translation) return null
    const TagName = tag || 'span'
    const text =
      this.props.md && translation
        ? markdown.render(translation)
        : translation || this.props._id
    if (getString) {
      return text || this.props._id
    }
    return (
      <>
        <ModalContainer
          translation={this.props}
          toggle={this.toggleEditing}
          open={this.state.editing}
        />
        <TagName
          className={'translation ' + (className || '')}
          dangerouslySetInnerHTML={{ __html: text }}
          onDoubleClick={this.toggleEditing}
        />
      </>
    )
  }
}

const TranslateContainer = withTranslator(
  withTracker(({ _id, md, category, translator }) => {
    const language = translator.currentLanguage
    const handle = Meteor.subscribe(
      'translation',
      { _id, md, category },
      language
    )
    const translation = Collection.findOne({ _id })
      ? Collection.findOne({ _id })[language]
      : null
    return {
      loading: !handle.ready(),
      translation
    }
  })(Translate)
)

TranslateContainer.propTypes = {
  _id: PropTypes.string.isRequired,
  md: PropTypes.bool,
  getString: PropTypes.bool,
  preventInPageEdit: PropTypes.bool,
  autoHide: PropTypes.bool
}

class TranslationEdit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
    this.toggleEditing = this.toggleEditing.bind(this)
  }
  toggleEditing () {
    this.setState({ editing: !this.state.editing })
  }
  render () {
    return (
      <div>
        <ModalContainer
          translation={this.props.translation}
          toggle={this.toggleEditing}
          open={this.state.editing}
        />
        <Button onClick={this.toggleEditing} size='sm' outline>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      </div>
    )
  }
}

class Translations extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: {},
      editing: false
    }
  }
  search (e, key) {
    const query = this.state.query
    if (e.target.value) {
      query[key] = {
        $regex: e.target.value,
        $options: 'i'
      }
    } else {
      delete query[key]
    }
    this.setState(query)
  }
  render () {
    const fields = ['_id']
    if (!this.props.noCategories) fields.push('category')
    return (
      <AdminList
        collection={Collection}
        getIdsCall='translationIds'
        subscription='translationsList'
        fields={concat(fields, this.props.translator.languages)}
        getTotalCall='totalTranslations'
        extraColumns={[[doc => <TranslationEdit translation={doc} />, '', []]]}
      />
    )
  }
}

const TranslationsContainer = withTranslator(Translations)

export {
  TranslateContainer as Translate,
  TranslationsContainer as Translations
}
