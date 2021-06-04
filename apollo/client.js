import { ApolloClient, InMemoryCache } from '@apollo/client'
import { DDPLink } from 'apollo-link-ddp'

export const client = new ApolloClient({
  link: new DDPLink(),
  cache: new InMemoryCache()
})
