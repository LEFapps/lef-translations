import { Meteor } from 'meteor/meteor'
import { set, keys, size, difference } from 'lodash'

import Collection from './Collection'

Meteor.publish('translation', ({ _id, md, category, params }, language) => {
  const fields = {}
  fields[language] = 1
  const cursor = Collection.find(_id)
  const translation = cursor.fetch()[0]
  if (!translation) {
    Collection.insert({ _id, md, category, params: keys(params) })
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
      console.log(`Translation ${_id} updated with ${JSON.stringify(modifier)}`)
      Collection.update(_id, modifier)
    }
  }
  return Collection.find(_id, { fields })
})

Meteor.publish('translationEdit', query => {
  return Collection.find(query)
})

Meteor.publish('translationsList', (query, params) => {
  return Collection.find(query)
})

Meteor.methods({
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
