import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import React from 'react'
import { Translator, withTranslator } from '@lefapps/translations'
import { MarkdownImageUpload } from 'meteor/lef:imgupload'

const TranslatorWrapper = ({ children, ...props }) => {
  Object.assign(props, {
    getTranslation: (props, args = {}) => {
      return Meteor.callPromise('getTranslation', props, args)
    },
    allowEditing: () => {
      // note: new alanning:roles version no longer keeps user roles in user object, downgrade to a version before 2.0
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
    },
    MarkdownImageUpload: props => {
      return <MarkdownImageUpload {...props} picture />
    }
  })
  return <Translator {...props}>{children}</Translator>
}

export default TranslatorWrapper
export { withTranslator }
