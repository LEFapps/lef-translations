import { Meteor } from 'meteor/meteor'

import Collection from './Collection'

Meteor.publish('translation', ({ _id, md, category }, language) => {
  if (!Collection.findOne(_id)) {
    Collection.insert({ _id, md, category })
  }
  const fields = {}
  fields[language] = 1
  return Collection.find({ _id }, { fields })
})

Meteor.publish('translationEdit', query => {
  return Collection.find(query)
})

Meteor.publish('translationsList', (query, params) => {
  return Collection.find(query, params)
})

Meteor.methods({
  updateTranslation: update => {
    return Collection.update(update._id, { $set: update })
  },
  totalTranslations: query => {
    return Collection.find(query).count()
  }
})
