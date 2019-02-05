import { Card, Col, Row } from 'antd'
import React from 'react'
import styled from 'styled-components/macro'

import { StyledSubheading, StyledText } from './typography'

const StyledRow = styled(Row)`
  background: rgba(255, 255, 255, 0.08);

  .ant-card {
    background: none;
  }
`

const StyledCard = styled(Card)`
  border: none;
  padding: 16px;

  .ant-card {
    background: none;

    &-body {
      padding: 0px;
    }
  }
`

const StyledCardMiddleLine = styled(StyledCard)`
  .ant-card-body {
    border-right: 1px solid white;
  }
`

const Heading = styled(StyledSubheading)`
  margin-bottom: 0px;
`

const Subtext = styled(StyledText)`
  font-size: 16px;
  opacity: 0.5;
  margin-top: -5px;
`

const InformationCardsBox = ({
  textMain,
  subtextMain,
  textSecondary,
  subtextSecondary
}) => {
  return (
    <div style={{"marginTop": "36px"}}>
      <StyledRow>
        <Col span={12}>
          <StyledCardMiddleLine>
            <Heading>{textMain}</Heading>
            <Subtext>{subtextMain}</Subtext>
          </StyledCardMiddleLine>
        </Col>
        <Col span={12}>
          <StyledCard>
            <Heading>{textSecondary}</Heading>
            <Subtext>{subtextSecondary}</Subtext>
          </StyledCard>
        </Col>
      </StyledRow>
    </div>
  )
}

export default InformationCardsBox
