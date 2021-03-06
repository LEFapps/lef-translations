import React, { Component } from 'react'
import AdminList from 'meteor/lef:adminlist'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import truncate from 'lodash/truncate'

import Collection from './Collection'

import {
  withTranslator,
  TranslationEdit,
  Translate
} from '@lefapps/translations'

class Edit extends Component {
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
        {this.state.editing ? (
          <TranslationEdit
            translation={this.props.translation}
            toggle={this.toggleEditing}
            open={this.state.editing}
          />
        ) : null}
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
    extraColumns = []
    this.props.translator.languages.map(language => {
      extraColumns.push({
        value: doc =>
          doc.md && doc[language] ? (
            <FontAwesomeIcon icon='align-left' />
          ) : (
            truncate(doc[language], {
              length: 96,
              omission: '…',
              separator: ' '
            })
          ),
        label: language.toUpperCase(),
        fields: [language, 'md'],
        search: {
          fields: language,
          value: value => value
        }
      })
    })
    extraColumns.push({
      value: ({ views }) => views,
      label: <FontAwesomeIcon icon='eye' />,
      fields: ['views']
    })
    extraColumns.push({
      value: doc => <Edit translation={doc} />
    })
    return (
      <>
        <header className='admin-board__head'>
          <Translate
            _id='translations'
            category='admin'
            tag='h2'
            className='admin-board__head-title'
          />
        </header>
        <section className='admin-board__body'>
          <AdminList
            collection={Collection}
            getIdsCall='translationIds'
            subscription='translationsList'
            defaultSort={{ _id: 1 }}
            fields={fields}
            getTotalCall='totalTranslations'
            extraColumns={extraColumns}
          />
        </section>
      </>
    )
  }
}

const TranslationsContainer = withTranslator(Translations)

export default TranslationsContainer
