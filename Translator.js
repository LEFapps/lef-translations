import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'

const TranslatorContext = React.createContext()

class Translator extends Component {
  constructor (props) {
    super(props)
    this.state = {
      translations: {}
    }
    this.setCurrentLanguage = this.setCurrentLanguage.bind(this)
    this.getTranslation = this.getTranslation.bind(this)
  }
  static getDerivedStateFromProps ({ settings, user }, { currentLanguage }) {
    let language
    language = user ? user.profile.language : currentLanguage
    if (!language) {
      const navLang = (navigator.language || navigator.userLanguage).split(
        '-'
      )[0]
      if (settings.languages.includes(navLang)) {
        language = navLang
      } else {
        language = settings.default
      }
    }
    settings.currentLanguage = language
    return settings
  }
  setCurrentLanguage (language) {
    if (Meteor.user()) {
      Meteor.users.update(Meteor.user()._id, {
        $set: {
          'profile.language': language
        }
      })
    } else {
      this.setState({ currentLanguage: language })
    }
    Object.keys(this.state.translations).map(_id => {
      this.getTranslation(
        { _id },
        { language, skipSettings: true, forceUpdate: true }
      )
    })
  }
  getTranslation (props, params = {}) {
    const { skipSettings, forceUpdate } = params
    const { translations, currentLanguage } = this.state
    const language = params.language || currentLanguage
    const { _id } = props
    if (!translations[_id] || forceUpdate) {
      translations[_id] = true
      Meteor.call(
        'getTranslation',
        props,
        { language: language, skipSettings },
        (e, r) => {
          if (r) {
            translations[_id] = r
          } else {
            console.error(e)
          }
          this.setState({ translations })
        }
      )
    }
  }
  render () {
    return (
      <TranslatorContext.Provider
        value={{
          translator: {
            ...this.state,
            setCurrentLanguage: this.setCurrentLanguage,
            user: this.props.user,
            getTranslation: this.getTranslation
          }
        }}
      >
        {this.props.children}
      </TranslatorContext.Provider>
    )
  }
}

const TranslatorContainer = withTracker(() => {
  return { user: Meteor.user() }
})(Translator)

const withTranslator = Component => {
  return function TranslatorComponent (props) {
    return (
      <TranslatorContext.Consumer>
        {translator => <Component {...props} {...translator} />}
      </TranslatorContext.Consumer>
    )
  }
}

export { TranslatorContainer as Translator, withTranslator }
