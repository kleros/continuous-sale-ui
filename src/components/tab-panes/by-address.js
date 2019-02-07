import { Button } from 'antd'
import Copy from 'copy-to-clipboard'
import QRCode from 'qrcode.react' // TODO should use hardcoded image for security?
import React, { useState } from 'react'
import styled from 'styled-components/macro'

import { StyledText, StyledValueText } from '../typography'

const StyledPane = styled.div`
  text-align: center;
`

const StyledButton = styled(Button)`
  color: white;
  height: 40px;
  width: 66%;
  padding: 0px 33px;
  &:focus {
    color: white;
  }
  &:hover {
    color: white;
  }
`

const AddressResponsive = styled(StyledValueText)`
  font-size: 100%;
  margin-top: 10px;
`

const ByAddressPane = ({
  contributionAddress
}) => {
  const [state, setState] = useState({
    buttonText: 'Copy Contribution Address'
  })

  const CopyToClipboard = () => {
    Copy(contributionAddress)
    setState({
      buttonText: 'Copied!'
    })

    setTimeout(function(){ setState({
      buttonText: 'Copy Contribution Address'
    }) }, 500);
  }

  return (
    <StyledPane>
      <StyledText style={{'marginTop' : '30px', 'marginBottom' : '34px'}}>
        Send ETH directly to the following address<sup>*</sup>
      </StyledText>
      <QRCode
        value={contributionAddress}
        size={167}
        bgColor={"rgba(255, 255, 255, 0.17)"}
      />
      <AddressResponsive>{contributionAddress}</AddressResponsive>
      <StyledButton onClick={CopyToClipboard}>{state.buttonText}</StyledButton>
      <StyledText style={{'padding': '0px 54px', 'marginTop': '55px'}}><sup>*</sup>This guarantees a purchase of PNK</StyledText>
    </StyledPane>
  )
}

export default ByAddressPane
