import React, { Fragment } from 'react'
import Translate from '@lefapps/translations'
import { getDataFromTree } from '@apollo/client/react/ssr'

import { ssrClient } from './apollo/ssr'

const TranslateClient = ({ _id, register = () => null, ...props }) => (
  <Translate _id={_id} {...props} onInit={register} />
)

// Replace the TODO with this
// getDataFromTree(TranslateClient).then(content => {
//   // Extract the entirety of the Apollo Client cache's current state
//   const initialState = ssrClient.extract()

//   // Add both the page content and the cache state to a top-level component
//   return <Fragment content={content} state={initialState} />
// })

const TranslateSsr = Translate

const Trs = Meteor.isServer ? TranslateSsr : TranslateClient

export default Trs
