import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'

const TranslatorContext = React.createContext()

class Translator extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.setCurrentLanguage = this.setCurrentLanguage.bind(this)
  }
  static getDerivedStateFromProps ({ settings, user }, { currentLanguage }) {
    let language
    language = user ? user.profile.language : currentLanguage
    if (!language) {
      const navLang = (navigator.language || navigator.userLanguage).split('-')[
        0
      ]
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
    if (this.user) {
      return Meteor.users.update(Meteor.user()._id, {
        $set: {
          'profile.language': language
        }
      })
    }
    this.setState({ currentLanguage: language })
  }
  render () {
    return (
      <TranslatorContext.Provider
        value={{
          translator: {
            ...this.state,
            setCurrentLanguage: this.setCurrentLanguage,
            user: this.props.user
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
