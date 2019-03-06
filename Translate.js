import React, { Component } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Roles } from 'meteor/alanning:roles'
import { keys, concat, forEach, size } from 'lodash'
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

class InsertParams extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdownOpen: false
    }
  }
  render () {
    const { params, insertParam, where } = this.props
    return (
      <InputGroupButtonDropdown
        addonType='append'
        isOpen={this.state.dropdownOpen}
        toggle={() => this.setState({ dropdownOpen: !this.state.dropdownOpen })}
      >
        <DropdownToggle caret color={'info'}>
          <Translate _id='insert' category='admin' />
        </DropdownToggle>
        <DropdownMenu right>
          {params.map(param => {
            return (
              <DropdownItem
                onClick={() => insertParam(param, where)}
                key={param}
              >
                <Translate _id={param} category='admin' />
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </InputGroupButtonDropdown>
    )
  }
}

class TranslationModal extends Component {
  constructor (props) {
    super(props)
    const state = props.translation || false
    this.state = state
    this.save = this.save.bind(this)
    this.toggleUpload = this.toggleUpload.bind(this)
    this.insertParam = this.insertParam.bind(this)
    this.rememberCursorPosition = this.rememberCursorPosition.bind(this)
  }
  handleChange (e, language) {
    this.setState({ [language]: e.target.value })
    this.rememberCursorPosition(e)
  }
  handleUpload (result) {
    console.log(result)
  }
  toggleUpload () {
    this.setState({ upload: !this.state.upload })
  }
  save () {
    const { cursorPos, ...state } = this.state
    Meteor.call('updateTranslation', state, (error, result) => {
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
  rememberCursorPosition ({ target }) {
    this.setState({
      cursorPos: [target.selectionStart, target.selectionEnd]
    })
  }
  insertParam (param, language) {
    const { cursorPos } = this.state
    const value = `${this.state[language]} `
    const state = {}
    state[language] = size(cursorPos)
      ? value.substring(0, cursorPos[0]) +
        `{{${param}}}` +
        value.substring(cursorPos[1])
      : `${value}{{${param}}}`
    this.setState(state, () => {
      const input = document.getElementsByName(language)[0]
      if (input) {
        input.focus()
        if (cursorPos.length) {
          input.selectionStart = input.selectionEnd =
            cursorPos[0] + `{{${param}}}`.length
        }
      }
    })
  }
  render () {
    const { loading, open, toggle, translator, upload } = this.props
    const translation = this.state
    // {sizes: [256, 512], label: 'Upload je profielfoto', placeholder: 'Optional'}
    const uploadProps = upload || {}
    if (loading || !translation) return null
    return (
      <Modal isOpen={open} toggle={toggle} size='lg'>
        <ModalHeader toggle={toggle}>
          <FontAwesomeIcon icon={'edit'} /> {translation._id}
        </ModalHeader>
        <ModalBody>
          <div className='row'>
            {translator.languages.map(language => {
              return (
                <div className='col' key={language}>
                  <h6>{language}</h6>
                  {translation.md ? (
                    <div>
                      <InputGroup>
                        <Input
                          rows='10'
                          type='textarea'
                          name={language}
                          value={translation[language]}
                          onChange={e => this.handleChange(e, language)}
                        />
                        {translation.params ? (
                          <InsertParams
                            params={translation.params}
                            insertParam={this.insertParam}
                            where={language}
                          />
                        ) : null}
                      </InputGroup>
                      <MarkdownImageUpload
                        onSubmit={this.onUpload(language)}
                        {...uploadProps}
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
                    <InputGroup>
                      <Input
                        type='text'
                        name={language}
                        value={translation[language] || ''}
                        onChange={e => this.handleChange(e, language)}
                      />
                      {translation.params ? (
                        <InsertParams
                          params={translation.params}
                          insertParam={this.insertParam}
                          where={language}
                        />
                      ) : null}
                    </InputGroup>
                  )}
                </div>
              )
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          {translation.md ? <MarkdownHelp /> : null}
          <Button onClick={this.save} color='success'>
            <FontAwesomeIcon icon={'check'} />
          </Button>
          <Button onClick={toggle} color='danger'>
            <FontAwesomeIcon icon={'times'} />
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
      autoHide,
      params
    } = this.props
    if (loading) return null
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
        <ModalContainer
          translation={this.props}
          toggle={this.toggleEditing}
          open={this.state.editing}
        />
        <TagName
          className={'translation' + (className ? ' ' + className : '')}
          dangerouslySetInnerHTML={{ __html: text }}
          onDoubleClick={this.toggleEditing}
        />
      </>
    )
  }
}

const TranslateContainer = withTranslator(
  withTracker(({ _id, md, category, params, translator }) => {
    const language = translator.currentLanguage
    const handle = Meteor.subscribe(
      'translation',
      { _id, md, category, params },
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
  autoHide: PropTypes.bool,
  params: PropTypes.object,
  upload: PropTypes.object
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
          <FontAwesomeIcon icon={'edit'} />
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
        extraColumns={[{ value: doc => <TranslationEdit translation={doc} /> }]}
      />
    )
  }
}

const TranslationsContainer = withTranslator(Translations)

export {
  TranslateContainer as Translate,
  TranslationsContainer as Translations
}
