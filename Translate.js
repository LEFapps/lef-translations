import React from 'react'
import Translate from '@lefapps/translations'

export default ({ _id, register = () => null, ...props }) => (
  <Translate _id={_id} {...props} onInit={register} />
)
