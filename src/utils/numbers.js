import { toWei, fromWei } from 'web3-utils'


export const ethToWei = decimal => {
  return toWei(decimal)
}

export const weiToEth = weiString => {
  return fromWei(weiString.toString(), 'ether')
}

export const truncateDecimalString = (decimalString, decimalPoints) => {
  const decimalIndex = decimalString.indexOf('.')
  let cutOffPoint = decimalIndex + decimalPoints + 1
  if (decimalPoints === 0) cutOffPoint--
  if (decimalIndex > 0 && decimalString.length > cutOffPoint) {
    decimalString = decimalString.substring(0, cutOffPoint)
  }

  return decimalString
}
