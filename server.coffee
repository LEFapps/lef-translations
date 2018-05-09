import Translator from './lib'


Meteor.publish 'translation', (options, language) ->
  # options expect _id, md, preventInPageEdit
  unless Translator.translations.findOne options._id
    Translator.translations.insert options
  fields = {}
  fields[language] = 1
  Translator.translations.find {_id:options._id}, {fields: fields}

Meteor.publish 'translations', (id) ->
  if id
    Translator.translations.find {_id:id}
  else
    Translator.translations.find {}, {sort:{_id:1}}

Meteor.methods
  updateTranslation: (update) ->
    check update, Object
    if Roles.userIsInRole(this.userId, 'admin')
      Translator.translations.update update._id, {$set: update}
  removeTranslation: (id) ->
    check id, String
    # Guard 'admin', -> Translator.translations.remove _id:id