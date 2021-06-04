import { Meteor } from 'meteor/meteor'
import { setup } from 'meteor/swydo:ddp-apollo'
import { makeExecutableSchema } from 'graphql-tools'
import { gql } from 'apollo-server'
import {
  typedefs as Translation,
  resolvers as translationResolver
} from '@lefapps/translations-server'

import translationModel from '../Collection'

const root = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [root, Translation],
  resolvers: translationResolver,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
})

const translator = () => {
  return {
    // Define findOne, find, update
    findOne: query => translationModel.findOne({ path, ...query }),
    find: query => translationModel.find(query).fetch(),
    update: (query, $set) => {
      const { insertedId } = translationModel.upsert(query, { $set })
      return translationModel.findOne(insertedId || query)
    }
  }
}

Meteor.startup(() => {
  setup({
    schema,
    context: { translator }
  })
})
