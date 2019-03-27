import React, { Component } from 'react'
import AdminList from 'meteor/lef:adminlist'
import { Button } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Collection from './Collection'

import { withTranslator, TranslationEdit } from '@lefapps/translations'

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
            doc[language]
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
      <AdminList
        collection={Collection}
        getIdsCall='translationIds'
        subscription='translationsList'
        fields={fields}
        getTotalCall='totalTranslations'
        extraColumns={extraColumns}
      />
    )
  }
}

const TranslationsContainer = withTranslator(Translations)

export default TranslationsContainer
