import { Input, Row, Col, Checkbox, Button } from 'antd'
import React, { useRef } from 'react'
import styled from 'styled-components/macro'

import { useDrizzle, useDrizzleState } from '../../temp/drizzle-react-hooks'
import { StyledText, StyledValueText, StyledSubtext } from '../typography'

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
  const { useCacheCall } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => ({
    web3Status: drizzleState.web3.status
  }))
  // Unlock metamask message
  const unlockMetaMask =
    (drizzleState.web3Status !== 'failed')
    ? null
    : 'Unlock MetaMask to submit a bid'

  const submitDisabled = true

  const maxValInputsRef = useRef(null)

  function maxValChecked(e) {
    if (e.target.checked)
      maxValInputsRef.current.style.display = 'inline-block'
    else
      maxValInputsRef.current.style.display = 'none'
  }

  return (
    <StyledPane>
      <StyledText style={{'margin-top' : '30px', 'padding' : '0px 20px'}}>Making a transaction by inputting the transaction data on MEW or Parity</StyledText>
      <Row style={{'margin-top' : '30px'}}>
        <Col offset={4} span={20}>
          <InputLabel><StyledText>Amount to bid</StyledText></InputLabel>
        </Col>
      </Row>
      <Row>
        <Col offset={4} span={14}>
          <StyledInput id='amount' type='number' placeholder={0} />
        </Col>
        <Col offset={1} span={2}>
          <StyledValueText>ETH</StyledValueText>
        </Col>
      </Row>
      <Row>
        <Col offset={4} span={13}>
          <StyledSubtext style={{'text-align' : 'right', 'margin-right': '9px'}}>With Maximum Price per PNK</StyledSubtext>
        </Col>
        <Col span={1}>
          <StyledCheckbox type='checkbox' onChange={maxValChecked} />
        </Col>
      </Row>
      <MaxPrice className='maxPrice'>
        <div className='maxPrice-inputs' ref={maxValInputsRef}>
          <Row style={{'margin-top' : '30px'}}>
            <Col offset={4} span={20}>
              <InputLabel><StyledText>Maximum Price per PNK</StyledText></InputLabel>
            </Col>
          </Row>
          <Row>
            <Col offset={4} span={14}>
              <StyledInput id='amount' type='number' placeholder={0} />
            </Col>
            <Col offset={1} span={2}>
              <StyledValueText>ETH</StyledValueText>
            </Col>
          </Row>
        </div>
      </MaxPrice>

    </StyledPane>
  )
}

export default ByInputData
