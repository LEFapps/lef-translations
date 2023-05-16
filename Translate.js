import React, { useEffect } from 'react'
import Translate from '@lefapps/translations'
import forEach from 'lodash/forEach'

import Collection from './Collection'
import { markdown } from './helpers/markdown'

const TranslateClient = ({ _id, register = () => null, onLoad, ...props }) => {
  if (!_id || typeof _id === 'undefined') return ''
  useEffect(() => {
    register(_id)
  }, [_id])
  return <Translate _id={_id} {...props} />
}

const TranslateSsr = ({ _id, ...props }) => {
  if (!_id || typeof _id === 'undefined') return ''
  const translation = Collection.findOne(_id)
  const lang = Meteor.settings.public.languages.default
  let result = translation[lang] || ''
  if (props.params)
    forEach(
      props.params,
      (value, key) =>
        (result = result.replaceAll(new RegExp(`{{${key}}}`, 'g'), value))
    )
  return props.md ? markdown.render(result) : result
}

export default Meteor.isServer ? TranslateSsr : TranslateClient
