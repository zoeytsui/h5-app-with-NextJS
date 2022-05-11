import React from 'react'

const Error = ({ ret = 401, msg = 'Access Denied' }) => {
  return (
    <div className='p-4'>{`${ret}: ${msg}`}</div>
  )
}

export default Error