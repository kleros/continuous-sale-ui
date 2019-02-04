import { Input, Row, Col, Checkbox, Button } from 'antd'
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components/macro'

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
  line-height: 2;
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

const ByInputData = () => {
  const { useCacheCall, drizzle } = useDrizzle()

  const [ maxPricePNK, setMaxPricePNK ] = useState(null)

  // Get all vars from contract.
  const INFINITY = useCacheCall('ContinuousICO', 'INFINITY')
  const lastBid = useCacheCall('ContinuousICO', 'globalLastBidID')
  const currentSubsaleNumber = useCacheCall('ContinuousICO', 'getOngoingSubsaleNumber')
  const tokensForSale = useCacheCall('ContinuousICO', 'tokensForSale')
  const numberOfSubsales = useCacheCall('ContinuousICO', 'numberOfSubsales')
  // Get search position once our other vars have been set/loaded.
  const amountForSaleToday = tokensForSale && numberOfSubsales && drizzle.web3.utils.toBN(tokensForSale).div(drizzle.web3.utils.toBN(numberOfSubsales))
  const maxVal = amountForSaleToday && INFINITY && (amountForSaleToday.mul(maxPricePNK ? drizzle.web3.utils.toBN(ethToWei(maxPricePNK)) : drizzle.web3.utils.toBN(INFINITY))).div(drizzle.web3.utils.toBN(ethToWei("1"))).toString() // convert price per pnk to total ETH contributed
  const searchStart = currentSubsaleNumber && maxVal && lastBid && useCacheCall('ContinuousICO', 'search', currentSubsaleNumber, maxVal, lastBid)

  let dataString = ''
  if (searchStart && maxVal) {
    dataString = drizzle.web3.eth.abi.encodeFunctionCall(
      {
        name: 'searchAndBidToOngoingSubsale',
        type: 'function',
        inputs: [{
          type: 'uint256',
          name: '_maxValuation'
        }, {
          type: 'uint256',
          name: '_next'
        }]
      }, [maxVal, searchStart]
    )
  }

  function maxValueChange (e) {
    const value = e.target.value
    if (value) setMaxPricePNK(ethToWei(value))
    else setMaxPricePNK(null)
  }

  return (
    <StyledPane>
      <StyledText style={{'marginTop' : '30px', 'padding' : '0px 20px'}}>Make a transaction by inputting the transaction data on MEW or Parity</StyledText>
      <Row style={{'marginTop' : '30px'}}>
        <Col offset={4} span={20}>
          <InputLabel><StyledText>Maximum Price per PNK</StyledText></InputLabel>
        </Col>
      </Row>
      <Row>
        <Col offset={4} span={14}>
          <StyledInput id='amount' type='number' placeholder={'INFINITY'} onChange={ maxValueChange }/>
        </Col>
        <Col offset={1} span={2}>
          <StyledValueText>ETH</StyledValueText>
        </Col>
      </Row>
      <Row>
       <StyledInput type='textinput' value={dataString} placeholder={'loading...'}/>
      </Row>
    </StyledPane>
  )
}

export default ByInputData
