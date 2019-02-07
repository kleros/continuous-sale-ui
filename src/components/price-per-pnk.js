import React from 'react'
import { useDrizzle, useDrizzleState } from '../temp/drizzle-react-hooks'
import { ethToWei, truncateDecimalString, weiToEth } from '../utils/numbers'
import { toBN } from 'web3-utils'

export default () => {
  const { useCacheCall } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    loaded: drizzleState.drizzleStatus.initialized
  }))

  let tokensForSale
  let numberOfSubsales
  let currentSubsaleNumber
  let valuationAndCutOff
  if (drizzleState.loaded) {
    tokensForSale = useCacheCall('ContinuousICO', 'tokensForSale')
    numberOfSubsales = useCacheCall('ContinuousICO', 'numberOfSubsales')
    currentSubsaleNumber = useCacheCall(
      'ContinuousICO',
      'getOngoingSubsaleNumber'
    )
    valuationAndCutOff =
      currentSubsaleNumber &&
      useCacheCall('ContinuousICO', 'valuationAndCutOff', currentSubsaleNumber)
  }

  const amountForSaleToday =
    numberOfSubsales &&
    tokensForSale &&
    toBN(tokensForSale).div(toBN(numberOfSubsales))

  const currentPricePerPNK =
    valuationAndCutOff &&
    amountForSaleToday &&
    toBN(ethToWei(valuationAndCutOff.valuation.toString())).div(
      amountForSaleToday
    )

  return (
    <div>
      {currentPricePerPNK
        ? `${truncateDecimalString(
            weiToEth(currentPricePerPNK.toString()),
            8
          )} ETH`
        : 'loading...'}
    </div>
  )
}
