import { Table } from 'antd'
import React from 'react'
import styled from 'styled-components/macro'

import MonthAbreviations from '../utils/month-abreviations'

const columns = [{
  title: 'Amount',
  dataIndex: 'amount',
  key: 'amount'
}, {
  title: 'Price',
  dataIndex: 'price',
  key: 'price'
}, {
  title: 'Date',
  dataIndex: 'date',
  key: 'date',
  render: text => getDateFromTimestamp(text)
}, {
  title: 'Status',
  dataIndex: 'status',
  key: 'status'
}]

const getDateFromTimestamp = (ts) => {
  const date = new Date(ts * 1000)
  const today = (new Date()).getDate()

  if (date.getDate() === today) return 'Today'
  else if (date.getDate() === today - 1) return 'Yesterday'

  return `${date.getDate()} ${MonthAbreviations[date.getMonth()]} ${date.getFullYear()}`
}

export default ({
  data
}) => (<Table columns={columns} dataSource={data} />)
