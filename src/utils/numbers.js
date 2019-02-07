import { toWei, fromWei, toBN } from 'web3-utils'


export const ethToWei = decimal => {
  return toWei(decimal)
}

export const weiToEth = weiString => {
  return fromWei(weiString, 'ether')
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

export const pricePerPNKToMaxVal = (pricePerPNK, amountForSale) => {
  const amountForSaleBN = toBN(amountForSale)
  const pricePerPNKWei = toBN(ethToWei(pricePerPNK.toString()))
  const ethDivisor = ethToWei(toBN("1"))
  return amountForSaleBN.mul(pricePerPNKWei).div(ethDivisor).toString() // convert price per pnk to total ETH contributed
}

export const INFINITY = '115792089237316195423570985008687907853269984665640564039457584007913129639934'
