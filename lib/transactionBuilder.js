/* eslint-disable no-async-promise-executor */

const Ethers = require('ethers')
const keccak256 = require('keccak256')
const Long = require('long')
const { Network, TransactionType, Transaction } = require('semux-js')
const utils = require('../utils/utils');

const FEE = 5000000

class TranasctionBuilder {
  constructor(semWeb = false) {
    this.semWeb = semWeb
  }

  // eslint-disable-next-line class-methods-use-this
  createValidData(params = [], functionSelector) {
    let newFuncSelector
    let newParams
    newFuncSelector = functionSelector.replace('/\s*/g', '');
    if (params.length) {
      const abiCoder = new Ethers.utils.AbiCoder();
      const types = []
      const values = []
      for (let i = 0; i < params.length; i += 1) {
        const { type, value } = params[i]
        if (!type || !utils.isString(type) || !type.length) {
          throw new Error(`Invalid parameter type provided: ${type}`)
        }
        types.push(type)
        values.push(value)
      }
      try {
        newParams = abiCoder.encode(types, values).replace(/^(0x)/, '')
      } catch (e) {
        throw new Error('Cannot encode  params')
      }
    } else newParams = ''
    newFuncSelector = keccak256(functionSelector).toString('hex').substring(0, 8)
    return `0x${newFuncSelector + newParams}`
  }

  triggerSmartContract(contractAddress, params = [], functionSelector) {
    return new Promise(async (resolve) => {
      const hexInput = this.createValidData(params, functionSelector)

      const res = await this.semWeb.fullNode.request('/local-call', {
        to: contractAddress,
        data: hexInput,
      }, 'get')
      if (res.data) return resolve(res.data)
      throw new Error('Error during contract call')
    })
  }

  sendSmartContract(
    contractAddress,
    params = [],
    functionSelector,
    feeLimit,
    callValue,
    from = this.semWeb.defaultAddress,
  ) {
    return new Promise(async (resolve, reject) => {
      const hexInput = this.createValidData(params, functionSelector)
      let evmTx
      try {
        evmTx = await this.sendSem(
          from,
          contractAddress,
          callValue,
          hexInput,
          '', // nonce
          'CALL',
        )
      } catch (e) {
        reject(e)
      }
      if (evmTx) resolve(evmTx)
    })
  }

  async sendSem(from = false, to = false, amount = false, data, nonce, type, chain) {
    let estimageGas
    let newNonce
    let newChain
    if (!nonce) {
      // geting nonce
      const accountData = await this.semWeb.sem.getBalance(from)
      newNonce = parseInt(accountData.nonce, 10) + parseInt(accountData.pendingTransactionCount, 10)
    }
    if (!chain) {
      // getting network chain
      const networkInfo = await this.semWeb.sem.getNetworkInfo()
      newChain = networkInfo.network
    }
    if (type === 'CALL') {
      estimageGas = await this.semWeb.sem.getEstimateGas(to, amount, data)
    }
    let tx
    try {
      tx = new Transaction(
        Network[chain || newChain],
        TransactionType[type],
        utils.hexBytes(to), // to
        Long.fromNumber(parseInt(amount, 10)), // value
        Long.fromNumber(type === 'CALL' || type === 'CREATE' ? 0 : FEE), // fee
        // TEMP FIX (+30% increase gas limit)
        Long.fromNumber(Number(estimageGas) + Number(estimageGas) * 0.3 || '0'), // gas
        Long.fromString(estimageGas ? '100' : '0'), // gasPrice
        Long.fromNumber(Number(nonce) || newNonce), // nonce
        Long.fromNumber(new Date().getTime()), // timestamp
        utils.hexBytes(data), // data
      )
    } catch (e) {
      throw new Error('Cannot create tx object')
    }
    return tx
  }
}

module.exports = TranasctionBuilder;
