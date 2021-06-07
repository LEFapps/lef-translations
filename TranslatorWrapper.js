import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'
import { MarkdownImageUpload } from 'meteor/lef:imgupload'
import { ApolloProvider } from '@apollo/client'
import { Translator, withTranslator } from '@lefapps/translations'

const { client } = require(Meteor.isServer ? './apollo/ssr' : './apollo/client')

const TranslatorWrapper = ({ children, ...props }) => {
  Object.assign(props, {
    getTranslation: (props, args = {}) => {
      return Meteor.callPromise('getTranslation', props, args)
    },
    allowEditing: () => {
      // note: new alanning:roles version no longer keeps user roles in user object, downgrade to a version before 2.0
      if (Meteor.isClient) return Roles.userIsInRole(Meteor.user(), 'admin')
      return false
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
      if (Meteor.isClient)
        return Meteor.user() ? Meteor.user().profile.language : undefined
    },
    MarkdownImageUpload: props => {
      return <MarkdownImageUpload {...props} picture />
    }
  })
  return (
    <Translator {...props}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </Translator>
  )
}

export default TranslatorWrapper
export { withTranslator }
