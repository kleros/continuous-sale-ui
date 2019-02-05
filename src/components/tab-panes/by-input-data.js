import { Input, Row, Col, Checkbox, Button } from 'antd'
import Copy from 'copy-to-clipboard'
import React, { useRef, useState } from 'react'
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

const StyledDisplayInput = styled(StyledInput)`
  background: transparent;
  border-bottom: 1px solid white;
  height: 40px;
  color: white;
  text-overflow: ellipsis;
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
  border-radius: 3px;
  height: 40px;
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

  const copyDataRef = useRef(null)
  const copyAddrRef = useRef(null)

  // Get all vars from contract.
  const INFINITY = useCacheCall('ContinuousICO', 'INFINITY')
  const lastBid = useCacheCall('ContinuousICO', 'globalLastBidID')
  const currentSubsaleNumber = useCacheCall('ContinuousICO', 'getOngoingSubsaleNumber')
  const tokensForSale = useCacheCall('ContinuousICO', 'tokensForSale')
  const numberOfSubsales = useCacheCall('ContinuousICO', 'numberOfSubsales')
  // Get search position once our other vars have been set/loaded.
  const amountForSaleToday = tokensForSale && numberOfSubsales && toBN(tokensForSale).div(toBN(numberOfSubsales))
  const maxVal = amountForSaleToday && INFINITY && (amountForSaleToday.mul(maxPricePNK ? toBN(ethToWei(maxPricePNK)) : toBN(INFINITY))).div(toBN(ethToWei("1"))).toString() // convert price per pnk to total ETH contributed
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
          <StyledInput id='amount' type='number' placeholder={'No Max Price'} onChange={ maxValueChange }/>
        </Col>
        <Col offset={1} span={2}>
          <StyledValueText>ETH</StyledValueText>
        </Col>
      </Row>
      <Row style={{"marginTop": "127px"}}>
        <Col offset={4}>
          <InputLabel><StyledText>Contribution Address</StyledText></InputLabel>
        </Col>
      </Row>
      <Row>
        <Col offset={4} span={14}>
          <StyledDisplayInput ref={copyAddrRef} type='textinput' value={drizzle.contracts['ContinuousICO'].address} placeholder={'loading...'}/>
        </Col>
        <Col span={1}>
          <StyledButton onClick={() => Copy(copyAddrRef.current.state.value)}>Copy</StyledButton>
        </Col>
      </Row>
      <Row style={{"marginTop": "16px"}}>
        <Col offset={4}>
          <InputLabel><StyledText>Transaction Data</StyledText></InputLabel>
        </Col>
      </Row>
      <Row>
        <Col offset={4} span={14}>
          <StyledDisplayInput ref={copyDataRef} type='textinput' value={dataString} placeholder={'loading...'}/>
        </Col>
        <Col span={1}>
          <StyledButton onClick={() => Copy(copyDataRef.current.state.value)}>Copy</StyledButton>
        </Col>
      </Row>

    </StyledPane>
  )
}

export default ByInputData
