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
import keys from 'lodash/keys'
import size from 'lodash/size'
import merge from 'lodash/merge'

import { withTranslator } from './Translator'
import MarkdownHelp from './MarkdownHelp'
import markdown from './markdown'

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
          <FontAwesomeIcon icon='plus' />
        </DropdownToggle>
        <DropdownMenu right>
          {params.map(param => {
            return (
              <DropdownItem
                onClick={() => insertParam(param, where)}
                key={param}
              >
                {param}
              </DropdownItem>
            )
          })}
        </DropdownMenu>
      </InputGroupButtonDropdown>
    )
  }
}

class TranslationModal extends Component {
  _isMounted = false
  constructor (props) {
    super(props)
    this.state = { MarkdownImageUpload: false }
    this.save = this.save.bind(this)
    this.toggleUpload = this.toggleUpload.bind(this)
    this.insertParam = this.insertParam.bind(this)
    this.rememberCursorPosition = this.rememberCursorPosition.bind(this)
    this.loadUploader = this.loadUploader.bind(this)
  }
  componentDidMount () {
    this._isMounted = true
    this.loadUploader('meteor/lef:imgupload')
    Meteor.call('getFullTranslation', this.props.translation._id, (e, r) => {
      if (r) this.setState(merge(this.state, r))
    })
  }
  componentWillUnmount () {
    this._isMounted = false
  }
  loadUploader (uploader) {
    import(uploader)
      .then(({ MarkdownImageUpload }) =>
        this._isMounted ? this.setState({ MarkdownImageUpload }) : null
      )
      .catch(e =>
        console.warn(
          'Uploader: ',
          e,
          'run "meteor add lef:imgupload" if this module is missing'
        )
      )
  }
  handleChange (e, language) {
    this.setState({ [language]: e.target.value })
    this.rememberCursorPosition(e)
  }
  toggleUpload () {
    this.setState({ upload: !this.state.upload })
  }
  save () {
    const { cursorPos, MarkdownImageUpload, ...state } = this.state
    this.props.translator
      .updateTranslation(state)
      .then(result => {
        // TODO: use result to update translator.translations
        this.props.toggle()
        const {
          translation: { _id },
          translator: { getTranslation }
        } = this.props
        getTranslation({ _id }, { skipSettings: true, forceUpdate: true })
      })
      .catch(error => alert(JSON.stringify(error)))
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
        if (cursorPos && cursorPos.length) {
          input.selectionStart = input.selectionEnd =
            cursorPos[0] + `{{${param}}}`.length
        }
      }
    })
  }
  render () {
    const { open, toggle, translator, upload } = this.props
    const { MarkdownImageUpload, cursorPos, ...translation } = this.state
    // {sizes: [256, 512], label: 'Upload je profielfoto', placeholder: 'Optional'}
    const uploadProps = upload || {}
    if (!translation) return null
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
                      {MarkdownImageUpload ? (
                        <MarkdownImageUpload
                          onSubmit={this.onUpload(language)}
                          {...uploadProps}
                        />
                      ) : (
                        'Initialising uploader ...'
                      )}
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

const ModalContainer = withTranslator(TranslationModalContainer)

export default ModalContainer
