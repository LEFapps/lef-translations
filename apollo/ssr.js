import { Meteor } from 'meteor/meteor'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'

import { schema } from './server'

export const ssrClient = new ApolloClient({
  ssrMode: true,
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache()
})