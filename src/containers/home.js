import { Button, Col, Divider, Radio, Row, Tabs } from 'antd'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components/macro'
import { toBN } from 'web3-utils'

import {
  StyledHeading,
  StyledSubheading,
  StyledText,
  StyledSubtext,
  StyledValueText
} from '../components/typography'
import BreakLine from '../components/break-line'
import InformationCardsBox from '../components/information-cards-box'
import Table from '../components/table'
import ByAddressPane from '../components/tab-panes/by-address'
import ByWeb3Browser from '../components/tab-panes/by-web3-browser'
import ByInputData from '../components/tab-panes/by-input-data'
import { useDrizzle, useDrizzleState } from '../temp/drizzle-react-hooks'
import { weiToEth, ethToWei, truncateDecimalString } from '../utils/numbers'

const StyledCardContainer = styled.div`
  margin-top: 25px;

  .ant-tabs-card {
    .ant-tabs-content {
      height: 515px;
      background: rgba(255, 255, 255, 0.08);

      .ant-tabs-tabpane {
        padding: 16px;
      }
    }
    .ant-tabs-bar {
      border: none;
      margin: 0;
      height: 35px;

      .ant-tabs-tab-next {
        display: none;
      }

      .ant-tabs-nav-container {
        margin-bottom: 0px;
      }

      .ant-tabs-nav {
        width: 100%;
        height: 35px;

        .ant-tabs-tab {
          border-bottom: 1px solid #009aff;
          border-left: none;
          border-right: none;
          border-top: none;
          margin-right: 0px;
          text-align: center;
          width: 33.3%;
          height: 34px;
        }

        .ant-tabs-tab-active {
          border: 1px solid #009aff;
          border-bottom: none;
          background: rgba(255, 255, 255, 0.08);
          height: 35px;
        }
      }
    }
  }
`

const StyledTabText = styled(StyledText)`
  font-weight: 500;
  font-size: 0.95vw;
`

const fakeData = [{
  'amount': 8700,
  'price': 2,
  'date': 1548364678,
  'status': 'Pending'
}, {
  'amount': 1233,
  'price': 0.9,
  'date': 1548278278,
  'status': 'Accepted'
}, {
  'amount': 81462,
  'price': 1.2,
  'date': 1547155078,
  'status': 'Rejected'
}]

export default () => {
  const { useCacheCall, drizzle } = useDrizzle()
  const drizzleState = useDrizzleState(drizzleState => {
    return ({
      loaded: drizzleState.drizzleStatus.initialized,
      account: drizzleState.accounts[0]
    })
  })

  const [ account, setAccount ] = useState(drizzleState.account)

  // Set account when drizzle state loads
  useEffect(() => {
    setAccount(drizzleState.account)
  }, [drizzleState.account])

  let tokensForSale
  let numberOfSubsales
  let currentSubsaleNumber
  let valuationAndCutOff
  let startTime
  let secondsPerSubsale
  let bidIDs = []
  let INFINITY
  if (drizzleState.loaded) {
   tokensForSale = useCacheCall('ContinuousICO', 'tokensForSale')
   numberOfSubsales = useCacheCall('ContinuousICO', 'numberOfSubsales')
   currentSubsaleNumber = useCacheCall('ContinuousICO', 'getOngoingSubsaleNumber')
   valuationAndCutOff = currentSubsaleNumber && useCacheCall('ContinuousICO', 'valuationAndCutOff', currentSubsaleNumber)
   startTime = useCacheCall('ContinuousICO', 'startTime')
   secondsPerSubsale = useCacheCall('ContinuousICO', 'secondsPerSubsale')
   bidIDs = (account && useCacheCall('ContinuousICO', 'getBidIDsForContributor', account, 'false')) || []
   INFINITY = useCacheCall('ContinuousICO', 'INFINITY')
  }

  const amountForSaleToday = numberOfSubsales
    && tokensForSale
    && toBN(tokensForSale)
      .div(toBN(numberOfSubsales))

  const currentPricePerPNK = valuationAndCutOff && amountForSaleToday && ethToWei(toBN(valuationAndCutOff.valuation)).div(amountForSaleToday)

  const secondsNow = parseInt(new Date().getTime() / 1000)
  const nextSubsaleStart = secondsPerSubsale &&
    startTime &&
    currentSubsaleNumber &&
    toBN(startTime).add(
      (toBN(secondsPerSubsale).mul(
        toBN(currentSubsaleNumber))
      )
    )
  const secondsRemaining =  nextSubsaleStart && nextSubsaleStart.sub(
    toBN(secondsNow)
  ).toString()

  const bids = useCacheCall(['ContinuousICO'], call =>
    bidIDs.length
      ? bidIDs.reduce(
          (acc, bidID) => {
            if (!acc.IDs[bidID]) {
              acc.IDs[bidID] = true
              const bid = call(
                'ContinuousICO',
                'bids',
                bidID
              )
              if (bid) {
                acc.bids.push({...bid, bidID})
                if (!acc.subsaleIDs[bid.subsaleNumber]) {
                  acc.subsaleIDs[bid.subsaleNumber] = true
                  const valAndCutOffForSubsale = call(
                    'ContinuousICO',
                    'valuationAndCutOff',
                    bid.subsaleNumber
                  )

                  if (valAndCutOffForSubsale)
                    acc.valAndCutOffForSubsale[bid.subsaleNumber.toString()] = valAndCutOffForSubsale
                  else
                    acc.loadingValAndCutOffs = true
                }
              }

              else acc.loading = true
            }
            return acc
          },
          { loading: false, loadingValAndCutOffs: false, bids: [], valAndCutOffForSubsale: {}, IDs: {}, subsaleIDs: {} }
        )
      : { loading: true, loadingValAndCutOffs: true, bids: [], valAndCutOffForSubsale: {}, IDs: {}, subsaleIDs: {} }
    )
  console.log(bids.bids)
  const columnData = []
  if (!bids.loading && !bids.loadingValAndCutOffs && amountForSaleToday && currentPricePerPNK && INFINITY && startTime && secondsPerSubsale) {
    for (let i=0; i<bids.bids.length; i++){
      const _bid = bids.bids[i]
      const bidColData = {
        'amount': null,
        'price': null,
        'date': null,
        'status': null
      }

      const valAndCutOff = bids.valAndCutOffForSubsale[_bid.subsaleNumber]
      // currentCutOffBidMaxValuation will come back as 0 if all bids are accepted
      const currentCutOffBidMaxValuation = valAndCutOff.currentCutOffBidMaxValuation

      let contrib = 0
      if (toBN(_bid.maxValuation).gt(toBN(currentCutOffBidMaxValuation))) {
        contrib = _bid.contrib
      }
      else if (toBN(_bid.maxValuation).eq(toBN(currentCutOffBidMaxValuation))) {
        if (_bid.bidID === valAndCutOff.currentCutOffBidID)
          contrib = valAndCutOff.currentCutOffBidContrib
        else if (_bid.bidID > valAndCutOff.currentCutOffBidID)
          contrib = _bid.contrib
      }

      if (contrib > 0) {
        if (currentSubsaleNumber === _bid.subsaleNumber) bidColData.status = 'pending'
        else bidColData.status = 'accepted'
      } else {
        bidColData.status = 'rejected'
      }

      bidColData.amount = truncateDecimalString(weiToEth(amountForSaleToday.mul(toBN(contrib)).div(toBN(valAndCutOff.valuation))).toString(), 0)

      bidColData.price = weiToEth(bids.bids[i].contrib)

      // calcuate start date
      const _startTime = toBN(startTime)
      const _subsaleNumberMultiplyer = toBN(_bid.subsaleNumber - 1)
      const _secondsPerSubsale = toBN(secondsPerSubsale)
      bidColData.date = (_startTime.add((_subsaleNumberMultiplyer.mul(_secondsPerSubsale)))).toNumber()

      columnData[i] = bidColData
    }
  }

  return (
    <div>
      <Row style={{'marginBottom': '76px'}}>
        <Col span={9}>
          <StyledSubheading>Contribution Options</StyledSubheading>
          <StyledCardContainer>
            <Tabs type="card">
              <Tabs.TabPane
                tab={<StyledTabText>by Address</StyledTabText>}
                key={1}
              >
                <ByAddressPane
                  contributionAddress={
                    drizzle.contracts['ContinuousICO']
                    ? drizzle.contracts['ContinuousICO'].address
                    : 'loading...'
                  }
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={<StyledTabText>by Web3 Wallet</StyledTabText>}
                key={2}
              >
                <ByWeb3Browser />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={<StyledTabText>by Inputing Data</StyledTabText>}
                key={3}
              >
                <ByInputData />
              </Tabs.TabPane>
            </Tabs>
          </StyledCardContainer>
        </Col>
        <Col span={13} offset={1}>
          <StyledHeading>
            Kleros Pinakion (PNK) Token Distribution
          </StyledHeading>
          <StyledText style={{ 'marginBottom': '18px' }}>
            Kleros Continuous Sale: 12% of the token supply is to be sold over a
            12-month period in daily auction
          </StyledText>
          <BreakLine />
          <StyledSubheading style={{ 'marginTop': '34px' }}>
            Daily Auction
          </StyledSubheading>
          <InformationCardsBox
            textMain={amountForSaleToday ? truncateDecimalString(weiToEth(amountForSaleToday).toString(), 2) + ' PNK': 'loading...'}
            subtextMain={"Amount for Sale"}
            textSecondary={valuationAndCutOff ? truncateDecimalString(weiToEth(valuationAndCutOff.valuation), 5) + ' ETH' : 'loading...'}
            subtextSecondary={"ETH Contributed Today"}
          />
          <InformationCardsBox
            textMain={currentPricePerPNK ? truncateDecimalString(weiToEth(currentPricePerPNK).toString(), 8) + ' ETH' : 'loading...'}
            subtextMain={"PNK price if no other bids are made"}
            textSecondary={secondsRemaining ? `${('0' + Math.floor(secondsRemaining/3600)).slice(-2)}:${('0' + Math.floor(secondsRemaining/60) % 60).slice(-2)}` : 'loading...'}
            subtextSecondary={"Remaining Time"}
          />
        </Col>
      </Row>
      <BreakLine />
      <Row style={{'margin': '45px 0px'}}>
        <Col span={9}>
          <StyledSubheading>My Bids</StyledSubheading>
        </Col>
        <Col span={15}>
          <StyledSubtext>Add your ETH address to see your bids</StyledSubtext>
          Search Bar...
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table columnData={columnData} />
        </Col>
      </Row>
    </div>
  )
}
