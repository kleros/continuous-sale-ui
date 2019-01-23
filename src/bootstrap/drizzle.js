import { Drizzle, generateStore } from 'drizzle'
import ContinuousICO from '../assets/contracts/continuous-ico.json'

const options = {
  contracts: [
    {
      ...ContinuousICO,
      networks: {
        42: { address: process.env.REACT_APP_KLEROS_TEST_ICO_ADDRESS },
        1: { address: process.env.REACT_APP_KLEROS_ICO_ADDRESS }
      }
    }
  ],
  polls: {
    accounts: 3000,
    blocks: 3000
  },
  web3: {
    fallback: {
      type: 'ws',
      url: process.env.REACT_APP_WEB3_FALLBACK_URL
    }
  }
}
export default new Drizzle(options, generateStore(options))
