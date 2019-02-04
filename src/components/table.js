import { Table } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components/macro'

import { useDrizzle, useDrizzleState } from '../temp/drizzle-react-hooks'
import MonthAbreviations from '../utils/month-abreviations'

const StyledTable = styled(Table)`
  .ant-table-content {
    background: rgba(255, 255, 255, 0.07);
    padding: 0px 8px;
    padding-top: 20px;

    td, th {
      border: none;
      border-right: 1px solid rgba(255, 255, 255, .2);
      padding: 5px 25px;
      font-size: 18px;
    }

    td {
      color: white;
    }

    th {
      color: white;
      opacity: 0.5;
    }

    td:last-child, th:last-child {
      border-right: none;
    }
  }

  .ant-table-thead {
    tr:nth-child(odd) {
      background: transparent;
    }
  }

  tr:nth-child(odd) {
    background: rgba(255, 255, 255, 0.07);
  }
  tr:nth-child(even) {
    background: transparent;
  }

  .ant-table-pagination {
    .ant-pagination-item-link {
      color: white;
    }

    .ant-pagination-item {
      border: none;
      background: transparent;
      font-size: 18px;
      a {
        color: white;
        opacity: 0.5;
      }

    }

    .ant-pagination-item-active {
      a {
        opacity: 1;
      }
    }
  }
`

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
  bidIDs
}) => {
  const { useCacheCall, drizzle } = useDrizzle()
  const [ columnData, setColumnData ] = useState([])

  for (let i = 0; i < bidIDs.length; i++) {
    // setColumnData(columnData[i] = {
    //   title: 'loading...'
    // })
    //
    // useCacheCall(['ContinuousICO'], async (call) => {
    //   const bid = await call('ContinuousICO', 'bids', bidIDs[i])
    //   console.log(bid)
    //   return setColumnData(columnData[i] = {
    //     title: 'found...'
    //   })
    // })
  }

  return (<StyledTable columns={columns} dataSource={columnData} />)
}
