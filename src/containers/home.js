import React from 'react'

import { useDrizzle, useDrizzleState } from '../temp/drizzle-react-hooks'

export default () => {
  const { useCacheCall, useCacheEvents } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    account: drizzleState.accounts[0]
  }))

  return <div>{'Hello'}</div>
}
