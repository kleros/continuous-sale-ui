import React from 'react'
import { toBN } from 'web3-utils'

import { ReactComponent as Clock } from '../assets/images/clock-regular.svg'
import { useDrizzle, useDrizzleState } from '../temp/drizzle-react-hooks'

export default ({}) => {
  const { useCacheCall } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => {
    return ({
      loaded: drizzleState.drizzleStatus.initialized
    })
  })

  let subsaleNumber
  let startTime
  let secondsPerSubsale
  if (drizzleState.loaded) {
   subsaleNumber = useCacheCall('ContinuousICO', 'getOngoingSubsaleNumber')
   startTime = useCacheCall('ContinuousICO', 'startTime')
   secondsPerSubsale = useCacheCall('ContinuousICO', 'secondsPerSubsale')
  }

  let nextSubsaleStartInSeconds = null
  if (startTime && secondsPerSubsale && subsaleNumber)
    nextSubsaleStartInSeconds = toBN(startTime.toString()).add(
      (toBN(secondsPerSubsale.toString()).mul(toBN(subsaleNumber.toString())))
    )

  const secondsNow = parseInt(new Date().getTime() / 1000)
  const secondsRemainingBN = nextSubsaleStartInSeconds && nextSubsaleStartInSeconds.sub(toBN(secondsNow.toString()))
  const secondsRemainingInt = secondsRemainingBN && (secondsRemainingBN.lt(0) ? 0 : secondsRemainingBN.toNumber())

  const hours = secondsRemainingInt && ('0' + Math.floor(secondsRemainingInt/3600)).slice(-2)
  const minutes = secondsRemainingInt && ('0' + Math.floor(secondsRemainingInt/60) % 60).slice(-2)

  return (
    <div>
      {hours ? `${hours}:${minutes}` : 'loading...'}
      {hours ? <Clock style={{ "height": "17px", "marginLeft": "5px"}}/> : null }
    </div>
  )
}
