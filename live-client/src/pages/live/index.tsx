import React, { memo } from 'react'
import { useSearchParams } from 'react-router-dom'

const Live: React.FC = () => {
  let [params] = useSearchParams()

  return <div>Live</div>
}

export default memo(Live)
