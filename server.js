import { Meteor } from 'meteor/meteor'
import { set, keys, size, difference } from 'lodash'

import Collection from './Collection'

Meteor.publish('translationEdit', query => {
  return Collection.find(query)
})

Meteor.publish('translationsList', (query, params) => {
  return Collection.find(query)
})

Meteor.methods({
  getTranslation: (
    { _id, md, category, params },
    { language, skipSettings = false }
  ) => {
    const fields = {}
    fields[language] = 1
    const translation = Collection.findOne(_id)
    if (!skipSettings) {
      if (!translation) {
        Collection.insert({ _id, md, category, params: keys(params) })
        return { _id }
      } else {
        const modifier = {}
        if (md !== translation.md) {
          md ? set(modifier, '$set.md', md) : set(modifier, '$unset.md', '')
        }
        const newParams = difference(keys(params), translation.params)
        if (newParams.length) {
          newParams.forEach(param => set(modifier, '$addToSet.params', param))
        }
        // maybe update category here too (for rare cases?)
        if (size(modifier) && _id) {
          console.log(
            `Translation ${_id} updated with ${JSON.stringify(modifier)}`
          )
          Collection.update(_id, modifier)
        }
      }
    }
    Collection.update(_id, { $inc: { views: 1 } })
    return Collection.findOne(_id, { fields })
  },
  getFullTranslation: _id => {
    return Collection.findOne(_id)
  },
  updateTranslation: update => {
    return Collection.update(update._id, { $set: update })
  },
  totalTranslations: query => {
    return Collection.find(query).count()
  },
  translationIds: (query, params) => {
    return Collection.find(query, params).map(({ _id }) => _id)
  }
})

export { Collection as TranslationsCollection }
