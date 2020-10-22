import React, { useEffect } from 'react'
import Translate from '@lefapps/translations'

export default ({ _id, register = () => null, onLoad, ...props }) => {
  useEffect(() => {
    register(_id)
  }, [_id])
  return <Translate _id={_id} {...props} />
}
