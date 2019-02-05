import { Input, Row, Col, Checkbox, Button } from 'antd'
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import { toBN } from 'web3-utils'

import { useDrizzle, useDrizzleState } from '../../temp/drizzle-react-hooks'
import { StyledText, StyledValueText, StyledSubtext } from '../typography'
import { ethToWei } from '../../utils/numbers'

const StyledPane = styled.div`
  text-align: center;
`
const StyledInput = styled(Input)`
  border-color: transparent;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.3);
  font-size: 18px;
`

const InputLabel = styled.div`
  margin: auto;
  p {
    margin-bottom: 5px;
  }
  text-align: left;
`

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox {
    vertical-align: baseline;

    &-inner {
      background : transparent;

      &:hover &:focus {
        border-color: white;
      }
    }
  }
`

const MaxPrice = styled.div`
  height: 100px;

  .maxPrice-inputs {
    width: 100%;
    display: none;
  }
`

const StyledButton = styled(Button)`
  color: white;
  height: 40px;
  padding: 0px 33px;
  width: 100%;

  &:focus {
    color: white;
  }
  &:hover {
    color: white;
  }
`

const ByWeb3Browser = () => {
  const [ test, setTest ] = useState(0)
  const [ maxPricePNK, setMaxPricePNK ] = useState(null)

  const { useCacheCall, drizzle, useCacheSend } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    web3Status: drizzleState.web3.status,
    account: drizzleState.accounts[0]
  }))

  // Get all vars from contract.
  const INFINITY = useCacheCall('ContinuousICO', 'INFINITY')
  const lastBid = useCacheCall('ContinuousICO', 'globalLastBidID')
  const currentSubsaleNumber = useCacheCall('ContinuousICO', 'getOngoingSubsaleNumber')
  const tokensForSale = useCacheCall('ContinuousICO', 'tokensForSale')
  const numberOfSubsales = useCacheCall('ContinuousICO', 'numberOfSubsales')

  const amountForSaleToday = tokensForSale && numberOfSubsales && toBN(tokensForSale).div(toBN(numberOfSubsales))
  const maxVal = amountForSaleToday && INFINITY && (amountForSaleToday.mul(maxPricePNK ? toBN(ethToWei(maxPricePNK)) : toBN(INFINITY))).div(toBN(ethToWei("1"))).toString() // convert price per pnk to total ETH contributed
  const searchStart = currentSubsaleNumber && maxVal && lastBid && useCacheCall('ContinuousICO', 'search', currentSubsaleNumber, maxVal, lastBid)
  // Send bid
  const { send, status } = useCacheSend('ContinuousICO', 'searchAndBidToOngoingSubsale')

  // Unlock metamask message
  const unlockMetaMask =
    (drizzleState.web3Status === 'failed' || !drizzleState.account)
    ? 'Unlock MetaMask to submit a bid'
    : null

  const submitDisabled = false

  const maxValViewRef = useRef(null)
  const maxValInputRef = useRef(null)
  const amountToContributeRef = useRef(null)

  function maxValChecked(e) {
    if (e.target.checked) {
      maxValViewRef.current.style.display = 'inline-block'
      maxValueChange(maxValInputRef.current.state.value)
    }
    else {
      maxValViewRef.current.style.display = 'none'
      maxValueChange(null)
    }
  }

  function submitTransaction() {
    const amountWei = ethToWei(amountToContributeRef.current.state.value)

    if (!maxPricePNK) {
      // use fallback function if no max price
      drizzle.web3.eth.sendTransaction({
        from: drizzleState.account,
        to: drizzle.contracts['ContinuousICO'].address,
        value: amountWei
      })
    } else {
      send(maxVal, searchStart, { value: amountWei })
    }
  }

  function maxValueChange (value) {
    if (value) setMaxPricePNK(value.toString())
    else setMaxPricePNK(null)
  }

  return (
    <StyledPane>
      <StyledText style={{'marginTop' : '30px'}}>Make a transaction with a web3 wallet</StyledText>
      <Row style={{'marginTop' : '30px'}}>
        <Col offset={4} span={20}>
          <InputLabel><StyledText>Amount to bid</StyledText></InputLabel>
        </Col>
      </Row>
      <Row>
        <Col offset={4} span={14}>
          <StyledInput id='amount' type='number' placeholder={0} ref={amountToContributeRef} />
        </Col>
        <Col offset={1} span={2}>
          <StyledValueText>ETH</StyledValueText>
        </Col>
      </Row>
      <Row>
        <Col offset={4} span={13}>
          <StyledSubtext style={{'textAlign' : 'right', 'marginRight': '9px'}}>With Maximum Price per PNK</StyledSubtext>
        </Col>
        <Col span={1}>
          <StyledCheckbox type='checkbox' onChange={maxValChecked} />
        </Col>
      </Row>
      <MaxPrice className='maxPrice'>
        <div className='maxPrice-inputs' ref={maxValViewRef}>
          <Row style={{'marginTop' : '30px'}}>
            <Col offset={4} span={20}>
              <InputLabel><StyledText>Maximum Price per PNK</StyledText></InputLabel>
            </Col>
          </Row>
          <Row>
            <Col offset={4} span={14}>
              <StyledInput id='amount' type='number' placeholder={0} ref={maxValInputRef} onChange={(e) => maxValueChange(e.target.value)}
            />
            </Col>
            <Col offset={1} span={2}>
              <StyledValueText>ETH</StyledValueText>
            </Col>
          </Row>
        </div>
      </MaxPrice>
      <Row style={{'marginTop' : '100px'}}>
        <Col offset={4} span={14}>
          <StyledButton disabled={submitDisabled} onClick={submitTransaction}>Submit Bid</StyledButton>
        </Col>
      </Row>
      <Row style={{'marginTop' : '5px'}}>
        <Col offset={4} span={14}>
          { unlockMetaMask }
        </Col>
      </Row>

    </StyledPane>
  )
}

export default ByWeb3Browser
