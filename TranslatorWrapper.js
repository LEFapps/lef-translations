import React from 'react'
import { Translator, withTranslator } from '@lefapps/translations'
import { Roles } from 'meteor/alanning:roles'

const TranslatorWrapper = ({ children, ...props }) => {
  Object.assign(props, {
    getTranslation: (props, args = {}) => {
      return Meteor.callPromise('getTranslation', props, args)
    },
    allowEditing: () => {
      return Roles.userIsInRole(Meteor.userId(), 'admin')
    },
    updateTranslation: doc => {
      return Meteor.callPromise('updateTranslation', doc)
    },
    setUserLanguage: language => {
      if (Meteor.user()) {
        Meteor.users.update(Meteor.user()._id, {
          $set: {
            'profile.language': language
          }
        })
      }
    },
    getUserLanguage: () => {
      return Meteor.user() ? Meteor.user().profile.language : undefined
    }
  })
  return <Translator {...props}>{children}</Translator>
}

export default TranslatorWrapper
export { withTranslator }
